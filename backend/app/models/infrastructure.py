"""
Infrastructure and facilities database models
"""

from sqlalchemy import Column, Integer, Float, String, DateTime, JSON, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


class Facility(Base):
    """Critical infrastructure and facilities"""
    __tablename__ = "facilities"
    
    id = Column(String, primary_key=True)
    name = Column(String(255), nullable=False)
    name_en = Column(String(255))
    
    # Location
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    # Classification
    facility_type = Column(String(50), nullable=False)  # hospital, school, shelter, power_station
    category = Column(String(50))  # critical, essential, standard
    
    # Capacity
    capacity = Column(Integer)  # people capacity for shelters
    current_occupancy = Column(Integer, default=0)
    
    # Status
    status = Column(String(30), default="normal")  # normal, at_risk, affected, closed
    risk_score = Column(Float, default=0.0)
    is_operational = Column(Boolean, default=True)
    
    # Flood vulnerability
    elevation_m = Column(Float)
    flood_threshold_m = Column(Float)  # water depth at which facility is affected
    
    # Contact
    contact_phone = Column(String(50))
    address = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class EvacuationRoute(Base):
    """Evacuation routes"""
    __tablename__ = "evacuation_routes"
    
    id = Column(String, primary_key=True)
    name = Column(String(255), nullable=False)
    name_en = Column(String(255))
    
    # Route geometry (GeoJSON LineString)
    geometry = Column(JSON, nullable=False)
    
    # Route properties
    length_km = Column(Float)
    estimated_time_minutes = Column(Float)
    road_type = Column(String(50))  # highway, main_road, secondary
    
    # Status
    status = Column(String(30), default="open")  # open, at_risk, closed
    risk_score = Column(Float, default=0.0)
    current_water_depth = Column(Float, default=0.0)
    
    # Capacity
    vehicle_capacity_per_hour = Column(Integer)
    is_passable = Column(Boolean, default=True)
    
    # Connections
    origin_zone_id = Column(String)
    destination_facility_id = Column(String, ForeignKey("facilities.id"))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class RoadSegment(Base):
    """Individual road segments for detailed routing"""
    __tablename__ = "road_segments"
    
    id = Column(String, primary_key=True)
    osm_id = Column(String)  # OpenStreetMap ID
    
    # Geometry
    geometry = Column(JSON, nullable=False)
    start_lat = Column(Float, nullable=False)
    start_lon = Column(Float, nullable=False)
    end_lat = Column(Float, nullable=False)
    end_lon = Column(Float, nullable=False)
    
    # Road properties
    road_name = Column(String(255))
    road_type = Column(String(50))
    length_m = Column(Float)
    elevation_m = Column(Float)
    
    # Flood vulnerability
    min_elevation = Column(Float)
    flood_prone = Column(Boolean, default=False)
    current_water_depth = Column(Float, default=0.0)
    
    # Status
    is_passable = Column(Boolean, default=True)
    risk_score = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class InfrastructureGraph(Base):
    """Graph edges for GNN - connections between infrastructure nodes"""
    __tablename__ = "infrastructure_graph"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Edge endpoints
    source_node_id = Column(String, nullable=False)
    source_node_type = Column(String(50), nullable=False)  # facility, zone, intersection
    target_node_id = Column(String, nullable=False)
    target_node_type = Column(String(50), nullable=False)
    
    # Edge properties
    edge_type = Column(String(50))  # road, drainage, dependency
    distance_m = Column(Float)
    travel_time_minutes = Column(Float)
    
    # For drainage network
    flow_direction = Column(String(10))  # upstream, downstream
    drainage_capacity = Column(Float)
    
    created_at = Column(DateTime, default=datetime.utcnow)
