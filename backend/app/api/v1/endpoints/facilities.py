"""
Facilities API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.core.database import get_db
from app.schemas import FacilityResponse, FacilityCreate, FacilityType, FacilityStatus
from app.services.data_service import DataService

router = APIRouter()


@router.get("/", response_model=List[FacilityResponse])
async def get_facilities(
    facility_type: Optional[FacilityType] = Query(None, description="Filter by facility type"),
    status: Optional[FacilityStatus] = Query(None, description="Filter by status"),
    operational_only: bool = Query(False, description="Only return operational facilities"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get all facilities with optional filters.
    Facility types: hospital, school, shelter, power_station
    """
    data_service = DataService(db)
    facilities = await data_service.get_facilities()
    
    # Apply filters
    if facility_type:
        facilities = [f for f in facilities if f.get("facility_type") == facility_type.value]
    if status:
        facilities = [f for f in facilities if f.get("status") == status.value]
    if operational_only:
        facilities = [f for f in facilities if f.get("is_operational", True)]
    
    return facilities


@router.get("/hospitals", response_model=List[FacilityResponse])
async def get_hospitals(
    db: AsyncSession = Depends(get_db),
):
    """Get all hospitals with their current status"""
    data_service = DataService(db)
    facilities = await data_service.get_facilities()
    
    hospitals = [f for f in facilities if f.get("facility_type") == "hospital"]
    return hospitals


@router.get("/shelters", response_model=List[FacilityResponse])
async def get_shelters(
    available_only: bool = Query(False, description="Only return shelters with available capacity"),
    db: AsyncSession = Depends(get_db),
):
    """Get all evacuation shelters with capacity information"""
    data_service = DataService(db)
    facilities = await data_service.get_facilities()
    
    shelters = [f for f in facilities if f.get("facility_type") == "shelter"]
    
    if available_only:
        shelters = [
            s for s in shelters 
            if s.get("is_operational", True) and 
               s.get("capacity", 0) > s.get("current_occupancy", 0)
        ]
    
    return shelters


@router.get("/power-stations", response_model=List[FacilityResponse])
async def get_power_stations(
    db: AsyncSession = Depends(get_db),
):
    """Get all power stations with their current status"""
    data_service = DataService(db)
    facilities = await data_service.get_facilities()
    
    power_stations = [f for f in facilities if f.get("facility_type") == "power_station"]
    return power_stations


@router.get("/{facility_id}", response_model=FacilityResponse)
async def get_facility(
    facility_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get specific facility by ID"""
    data_service = DataService(db)
    facility = await data_service.get_facility(facility_id)
    
    if not facility:
        raise HTTPException(status_code=404, detail=f"Facility {facility_id} not found")
    
    return facility


@router.get("/{facility_id}/accessibility")
async def get_facility_accessibility(
    facility_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Check accessibility of a facility.
    Returns available routes and estimated travel times.
    """
    data_service = DataService(db)
    accessibility = await data_service.get_facility_accessibility(facility_id)
    
    if accessibility is None:
        raise HTTPException(status_code=404, detail=f"Facility {facility_id} not found")
    
    return accessibility


@router.get("/at-risk")
async def get_facilities_at_risk(
    risk_threshold: float = Query(default=50.0, ge=0, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Get facilities with risk score above threshold"""
    data_service = DataService(db)
    facilities = await data_service.get_facilities()
    
    at_risk = [
        f for f in facilities 
        if f.get("risk_score", 0) >= risk_threshold or f.get("status") in ["at_risk", "affected"]
    ]
    
    # Sort by risk score descending
    at_risk.sort(key=lambda x: x.get("risk_score", 0), reverse=True)
    
    return {
        "risk_threshold": risk_threshold,
        "count": len(at_risk),
        "facilities": at_risk,
    }


@router.get("/geojson")
async def get_facilities_geojson(
    facility_type: Optional[FacilityType] = None,
    db: AsyncSession = Depends(get_db),
):
    """Get facilities as GeoJSON for map rendering"""
    data_service = DataService(db)
    facilities = await data_service.get_facilities()
    
    if facility_type:
        facilities = [f for f in facilities if f.get("facility_type") == facility_type.value]
    
    features = []
    for f in facilities:
        features.append({
            "type": "Feature",
            "id": f["id"],
            "properties": {
                "name": f.get("name", ""),
                "type": f.get("facility_type", ""),
                "status": f.get("status", "normal"),
                "risk_score": f.get("risk_score", 0),
                "capacity": f.get("capacity"),
                "is_operational": f.get("is_operational", True),
            },
            "geometry": {
                "type": "Point",
                "coordinates": [f.get("longitude", 0), f.get("latitude", 0)],
            },
        })
    
    return {
        "type": "FeatureCollection",
        "features": features,
    }
