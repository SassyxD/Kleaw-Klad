"""
Flood-related database models
"""

from sqlalchemy import Column, Integer, Float, String, DateTime, JSON, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


class FloodZone(Base):
    """Flood zone/area model"""
    __tablename__ = "flood_zones"
    
    id = Column(String, primary_key=True)
    name = Column(String(255), nullable=False)
    name_en = Column(String(255))
    
    # Geometry (stored as GeoJSON)
    geometry = Column(JSON, nullable=False)
    centroid_lat = Column(Float, nullable=False)
    centroid_lon = Column(Float, nullable=False)
    area_sqkm = Column(Float)
    
    # Current status
    current_depth = Column(Float, default=0.0)  # meters
    depth_category = Column(String(20), default="none")  # none, low, medium, high
    risk_score = Column(Float, default=0.0)  # 0-100
    
    # Population data
    estimated_population = Column(Integer, default=0)
    affected_population = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    flood_events = relationship("FloodEvent", back_populates="zone")


class FloodEvent(Base):
    """Historical and current flood events"""
    __tablename__ = "flood_events"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    zone_id = Column(String, ForeignKey("flood_zones.id"))
    
    # Event details
    event_type = Column(String(50))  # flash_flood, river_overflow, drainage_failure
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime)
    peak_time = Column(DateTime)
    
    # Measurements
    peak_depth = Column(Float)
    rainfall_mm = Column(Float)
    duration_hours = Column(Float)
    
    # Impact
    damage_estimate_thb = Column(Float)
    evacuees_count = Column(Integer)
    
    # Data source
    source = Column(String(100))  # satellite, sensor, report
    confidence = Column(Float, default=0.8)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    zone = relationship("FloodZone", back_populates="flood_events")


class WaterLevel(Base):
    """Water level measurements from U-Tapao Canal and sensors"""
    __tablename__ = "water_levels"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    station_id = Column(String, ForeignKey("monitoring_stations.id"))
    
    timestamp = Column(DateTime, nullable=False)
    level_m = Column(Float, nullable=False)  # meters above reference
    flow_rate = Column(Float)  # cubic meters per second
    
    # Thresholds
    warning_level = Column(Float)
    critical_level = Column(Float)
    
    created_at = Column(DateTime, default=datetime.utcnow)


class MonitoringStation(Base):
    """Water level monitoring stations"""
    __tablename__ = "monitoring_stations"
    
    id = Column(String, primary_key=True)
    name = Column(String(255), nullable=False)
    name_en = Column(String(255))
    
    # Location
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    # Station info
    station_type = Column(String(50))  # canal, river, drainage, rain_gauge
    is_active = Column(Boolean, default=True)
    
    # Thresholds
    warning_level = Column(Float)
    critical_level = Column(Float)
    
    created_at = Column(DateTime, default=datetime.utcnow)
