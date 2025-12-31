"""
Pydantic schemas for API request/response models
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


# ============== Enums ==============

class DepthCategory(str, Enum):
    NONE = "none"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class FacilityType(str, Enum):
    HOSPITAL = "hospital"
    SCHOOL = "school"
    SHELTER = "shelter"
    POWER_STATION = "power_station"


class FacilityStatus(str, Enum):
    NORMAL = "normal"
    AT_RISK = "at_risk"
    AFFECTED = "affected"
    CLOSED = "closed"


class RouteStatus(str, Enum):
    OPEN = "open"
    AT_RISK = "at_risk"
    CLOSED = "closed"


# ============== Flood Schemas ==============

class FloodZoneBase(BaseModel):
    name: str
    name_en: Optional[str] = None
    geometry: Dict[str, Any]  # GeoJSON
    centroid_lat: float
    centroid_lon: float


class FloodZoneCreate(FloodZoneBase):
    id: str
    area_sqkm: Optional[float] = None
    estimated_population: Optional[int] = None


class FloodZoneResponse(FloodZoneBase):
    id: str
    current_depth: float = 0.0
    depth_category: DepthCategory = DepthCategory.NONE
    risk_score: float = 0.0
    affected_population: int = 0
    area_sqkm: Optional[float] = None
    
    class Config:
        from_attributes = True


class FloodZoneUpdate(BaseModel):
    current_depth: Optional[float] = None
    risk_score: Optional[float] = None
    affected_population: Optional[int] = None


# ============== Facility Schemas ==============

class FacilityBase(BaseModel):
    name: str
    name_en: Optional[str] = None
    latitude: float
    longitude: float
    facility_type: FacilityType
    category: Optional[str] = None


class FacilityCreate(FacilityBase):
    id: str
    capacity: Optional[int] = None
    elevation_m: Optional[float] = None
    flood_threshold_m: Optional[float] = None


class FacilityResponse(FacilityBase):
    id: str
    status: FacilityStatus = FacilityStatus.NORMAL
    risk_score: float = 0.0
    is_operational: bool = True
    capacity: Optional[int] = None
    current_occupancy: int = 0
    
    class Config:
        from_attributes = True


# ============== Evacuation Route Schemas ==============

class EvacuationRouteBase(BaseModel):
    name: str
    name_en: Optional[str] = None
    geometry: Dict[str, Any]  # GeoJSON LineString


class EvacuationRouteCreate(EvacuationRouteBase):
    id: str
    length_km: Optional[float] = None
    road_type: Optional[str] = None


class EvacuationRouteResponse(EvacuationRouteBase):
    id: str
    status: RouteStatus = RouteStatus.OPEN
    risk_score: float = 0.0
    current_water_depth: float = 0.0
    is_passable: bool = True
    length_km: Optional[float] = None
    estimated_time_minutes: Optional[float] = None
    
    class Config:
        from_attributes = True


# ============== Simulation Schemas ==============

class SimulationScenarioCreate(BaseModel):
    name: str
    description: Optional[str] = None
    rainfall_mm_per_hour: float = Field(..., ge=0, le=500)
    duration_hours: float = Field(..., ge=0.5, le=72)
    initial_canal_level: Optional[float] = None
    tide_factor: float = Field(default=1.0, ge=0.5, le=2.0)


class SimulationScenarioResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    rainfall_mm_per_hour: float
    duration_hours: float
    status: str
    progress_percent: float
    peak_flood_area_sqkm: Optional[float] = None
    affected_population: Optional[int] = None
    affected_facilities_count: Optional[int] = None
    closed_routes_count: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class SimulationTimeStepResponse(BaseModel):
    timestep: int
    simulation_time: datetime
    total_flooded_area_sqkm: float
    average_depth: float
    max_depth: float
    zone_depths: Dict[str, float]
    zone_risk_scores: Dict[str, float]
    affected_facilities: List[str]
    closed_routes: List[str]
    
    class Config:
        from_attributes = True


# ============== AI Prediction Schemas ==============

class RiskPropagationRequest(BaseModel):
    """Request for GNN risk propagation"""
    flood_depths: Dict[str, float]  # {zone_id: depth}
    rainfall_mm: float
    hours_ahead: int = Field(default=6, ge=1, le=48)


class RiskPropagationResponse(BaseModel):
    """Response from GNN risk propagation"""
    zone_risk_scores: Dict[str, float]
    facility_risk_scores: Dict[str, float]
    route_risk_scores: Dict[str, float]
    critical_warnings: List[Dict[str, Any]]
    cascade_timeline: List[Dict[str, Any]]  # When each asset becomes affected


class EvacuationRequest(BaseModel):
    """Request for RL evacuation planning"""
    current_flood_state: Dict[str, float]  # {zone_id: depth}
    priority_zones: Optional[List[str]] = None
    available_shelters: Optional[List[str]] = None


class EvacuationResponse(BaseModel):
    """Response from RL evacuation agent"""
    recommended_routes: List[Dict[str, Any]]
    shelter_assignments: Dict[str, str]  # {zone_id: shelter_id}
    priority_order: List[str]  # Zone IDs in evacuation priority order
    estimated_completion_hours: float
    roads_to_close: List[str]


class SARTranslationRequest(BaseModel):
    """Request for CycleGAN SAR-to-optical translation"""
    sar_image_url: Optional[str] = None
    sar_image_base64: Optional[str] = None
    timestamp: Optional[datetime] = None


class SARTranslationResponse(BaseModel):
    """Response from CycleGAN"""
    optical_image_base64: str
    flood_mask_geojson: Dict[str, Any]
    detected_water_area_sqkm: float
    confidence: float


# ============== Dashboard Schemas ==============

class DashboardSummary(BaseModel):
    """Overall dashboard data"""
    flood_stats: Dict[str, Any]
    affected_population: int
    affected_area_sqkm: float
    facilities_at_risk: int
    routes_closed: int
    active_alerts: List[Dict[str, Any]]
    water_levels: Dict[str, float]
    last_updated: datetime


class RealTimeUpdate(BaseModel):
    """WebSocket real-time update payload"""
    update_type: str  # flood_update, facility_update, route_update, alert
    data: Dict[str, Any]
    timestamp: datetime
