"""
Simulation-related database models
"""

from sqlalchemy import Column, Integer, Float, String, DateTime, JSON, Boolean, Text
from datetime import datetime

from app.core.database import Base


class SimulationScenario(Base):
    """Flood simulation scenarios"""
    __tablename__ = "simulation_scenarios"
    
    id = Column(String, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    
    # Scenario parameters
    rainfall_mm_per_hour = Column(Float, nullable=False)
    duration_hours = Column(Float, nullable=False)
    initial_canal_level = Column(Float)  # U-Tapao Canal initial level
    tide_factor = Column(Float, default=1.0)  # Songkhla Lake tide influence
    
    # Simulation status
    status = Column(String(30), default="pending")  # pending, running, completed, failed
    progress_percent = Column(Float, default=0.0)
    
    # Results summary
    peak_flood_area_sqkm = Column(Float)
    max_water_depth = Column(Float)
    affected_population = Column(Integer)
    affected_facilities_count = Column(Integer)
    closed_routes_count = Column(Integer)
    
    # Timing
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    
    # User
    created_by = Column(String(100))


class SimulationTimeStep(Base):
    """Time-series data for each simulation step"""
    __tablename__ = "simulation_timesteps"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    scenario_id = Column(String, nullable=False)
    
    # Time info
    timestep = Column(Integer, nullable=False)  # step number
    simulation_time = Column(DateTime, nullable=False)
    
    # Flood state
    flood_extent_geojson = Column(JSON)
    total_flooded_area_sqkm = Column(Float)
    average_depth = Column(Float)
    max_depth = Column(Float)
    
    # Zone-level data
    zone_depths = Column(JSON)  # {zone_id: depth}
    zone_risk_scores = Column(JSON)  # {zone_id: score}
    
    # Infrastructure status
    affected_facilities = Column(JSON)  # [facility_id, ...]
    closed_routes = Column(JSON)  # [route_id, ...]
    
    # Canal levels
    canal_levels = Column(JSON)  # {station_id: level}
    
    created_at = Column(DateTime, default=datetime.utcnow)


class AIModelPrediction(Base):
    """AI model predictions for logging and analysis"""
    __tablename__ = "ai_predictions"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Model info
    model_type = Column(String(50), nullable=False)  # cyclegan, gnn, rl_agent
    model_version = Column(String(50))
    
    # Input/Output
    input_data = Column(JSON)
    output_data = Column(JSON)
    
    # Performance
    inference_time_ms = Column(Float)
    confidence_score = Column(Float)
    
    # Context
    scenario_id = Column(String)
    timestep = Column(Integer)
    
    created_at = Column(DateTime, default=datetime.utcnow)


class EvacuationPlan(Base):
    """AI-generated evacuation plans"""
    __tablename__ = "evacuation_plans"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    scenario_id = Column(String, nullable=False)
    timestep = Column(Integer)
    
    # Plan details
    priority_zones = Column(JSON)  # [{zone_id, priority, reason}, ...]
    recommended_routes = Column(JSON)  # [{from_zone, to_shelter, route_ids, eta_minutes}, ...]
    shelter_assignments = Column(JSON)  # {zone_id: shelter_id}
    
    # Road closures
    roads_to_close = Column(JSON)  # [route_id, ...]
    closure_times = Column(JSON)  # {route_id: expected_closure_time}
    
    # Facilities at risk
    facilities_to_evacuate = Column(JSON)  # [{facility_id, priority, deadline}, ...]
    
    # Summary
    total_evacuees = Column(Integer)
    estimated_completion_hours = Column(Float)
    
    created_at = Column(DateTime, default=datetime.utcnow)
