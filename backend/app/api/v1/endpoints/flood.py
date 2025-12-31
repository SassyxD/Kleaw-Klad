"""
Flood Data API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.schemas import (
    FloodZoneResponse,
    FloodZoneCreate,
    FloodZoneUpdate,
)
from app.services.data_service import DataService

router = APIRouter()


@router.get("/zones", response_model=List[FloodZoneResponse])
async def get_flood_zones(
    depth_min: Optional[float] = Query(None, description="Minimum water depth filter"),
    risk_min: Optional[float] = Query(None, description="Minimum risk score filter"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get all flood zones with current status.
    Optionally filter by minimum depth or risk score.
    """
    data_service = DataService(db)
    zones = await data_service.get_flood_zones()
    
    # Apply filters
    if depth_min is not None:
        zones = [z for z in zones if z.get("current_depth", 0) >= depth_min]
    if risk_min is not None:
        zones = [z for z in zones if z.get("risk_score", 0) >= risk_min]
    
    return zones


@router.get("/zones/{zone_id}", response_model=FloodZoneResponse)
async def get_flood_zone(
    zone_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get specific flood zone by ID"""
    data_service = DataService(db)
    zone = await data_service.get_flood_zone(zone_id)
    
    if not zone:
        raise HTTPException(status_code=404, detail=f"Flood zone {zone_id} not found")
    
    return zone


@router.post("/zones", response_model=FloodZoneResponse)
async def create_flood_zone(
    zone: FloodZoneCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new flood zone"""
    data_service = DataService(db)
    created = await data_service.create_flood_zone(zone.model_dump())
    return created


@router.patch("/zones/{zone_id}", response_model=FloodZoneResponse)
async def update_flood_zone(
    zone_id: str,
    update: FloodZoneUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update flood zone status (depth, risk score, affected population)"""
    data_service = DataService(db)
    updated = await data_service.update_flood_zone(zone_id, update.model_dump(exclude_unset=True))
    
    if not updated:
        raise HTTPException(status_code=404, detail=f"Flood zone {zone_id} not found")
    
    return updated


@router.get("/zones/{zone_id}/history")
async def get_zone_flood_history(
    zone_id: str,
    days: int = Query(default=30, le=365),
    db: AsyncSession = Depends(get_db),
):
    """Get historical flood events for a zone"""
    data_service = DataService(db)
    history = await data_service.get_zone_flood_history(zone_id, days)
    
    return {
        "zone_id": zone_id,
        "period_days": days,
        "events": history,
    }


@router.get("/water-levels")
async def get_water_levels(
    db: AsyncSession = Depends(get_db),
):
    """
    Get current water levels from monitoring stations.
    Includes U-Tapao Canal stations and drainage sensors.
    """
    data_service = DataService(db)
    levels = await data_service.get_water_levels()
    
    return {
        "stations": levels,
        "last_updated": datetime.now().isoformat(),
    }


@router.get("/rainfall")
async def get_rainfall_data(
    hours: int = Query(default=24, le=168),
    db: AsyncSession = Depends(get_db),
):
    """Get rainfall data from rain gauges"""
    data_service = DataService(db)
    rainfall = await data_service.get_rainfall_data(hours)
    
    return {
        "period_hours": hours,
        "total_mm": sum(r.get("amount_mm", 0) for r in rainfall),
        "readings": rainfall,
    }


@router.get("/extent/geojson")
async def get_flood_extent_geojson(
    db: AsyncSession = Depends(get_db),
):
    """
    Get current flood extent as GeoJSON FeatureCollection.
    Suitable for direct rendering on maps.
    """
    data_service = DataService(db)
    zones = await data_service.get_flood_zones()
    
    features = []
    for zone in zones:
        if zone.get("current_depth", 0) > 0:
            features.append({
                "type": "Feature",
                "id": zone["id"],
                "properties": {
                    "name": zone.get("name", ""),
                    "depth": zone.get("current_depth", 0),
                    "depth_category": zone.get("depth_category", "low"),
                    "risk_score": zone.get("risk_score", 0),
                    "affected_population": zone.get("affected_population", 0),
                },
                "geometry": zone.get("geometry", {}),
            })
    
    return {
        "type": "FeatureCollection",
        "features": features,
        "generated_at": datetime.now().isoformat(),
    }
