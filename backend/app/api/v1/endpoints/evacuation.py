"""
Evacuation Routes API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.core.database import get_db
from app.schemas import EvacuationRouteResponse, RouteStatus, EvacuationRequest, EvacuationResponse
from app.services.data_service import DataService
from app.ai import get_evacuation_agent

router = APIRouter()


@router.get("/routes", response_model=List[EvacuationRouteResponse])
async def get_evacuation_routes(
    status: Optional[RouteStatus] = Query(None, description="Filter by route status"),
    passable_only: bool = Query(False, description="Only return passable routes"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get all evacuation routes with current status.
    Routes are color-coded: open (green), at_risk (yellow), closed (red)
    """
    data_service = DataService(db)
    routes = await data_service.get_evacuation_routes()
    
    if status:
        routes = [r for r in routes if r.get("status") == status.value]
    if passable_only:
        routes = [r for r in routes if r.get("is_passable", True)]
    
    return routes


@router.get("/routes/{route_id}", response_model=EvacuationRouteResponse)
async def get_evacuation_route(
    route_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get specific evacuation route by ID"""
    data_service = DataService(db)
    route = await data_service.get_evacuation_route(route_id)
    
    if not route:
        raise HTTPException(status_code=404, detail=f"Route {route_id} not found")
    
    return route


@router.get("/routes/geojson")
async def get_routes_geojson(
    db: AsyncSession = Depends(get_db),
):
    """Get evacuation routes as GeoJSON for map rendering"""
    data_service = DataService(db)
    routes = await data_service.get_evacuation_routes()
    
    features = []
    for r in routes:
        features.append({
            "type": "Feature",
            "id": r["id"],
            "properties": {
                "name": r.get("name", ""),
                "status": r.get("status", "open"),
                "risk_score": r.get("risk_score", 0),
                "water_depth": r.get("current_water_depth", 0),
                "length_km": r.get("length_km"),
                "is_passable": r.get("is_passable", True),
            },
            "geometry": r.get("geometry", {}),
        })
    
    return {
        "type": "FeatureCollection",
        "features": features,
    }


@router.post("/plan", response_model=EvacuationResponse)
async def generate_evacuation_plan(
    request: EvacuationRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Generate AI-powered evacuation plan using RL agent.
    
    The agent considers:
    - Current flood conditions
    - Population distribution
    - Shelter capacities
    - Route passability
    - Travel times and risks
    """
    data_service = DataService(db)
    
    # Get current data
    zones = await data_service.get_flood_zones()
    shelters = [f for f in await data_service.get_facilities() if f.get("facility_type") == "shelter"]
    routes = await data_service.get_evacuation_routes()
    
    # Filter shelters if specified
    if request.available_shelters:
        shelters = [s for s in shelters if s["id"] in request.available_shelters]
    
    # Get evacuation agent
    agent = get_evacuation_agent()
    
    # Generate plan
    plan = agent.get_evacuation_plan(
        flood_state=request.current_flood_state,
        zones=zones,
        shelters=shelters,
        routes=routes,
    )
    
    return EvacuationResponse(**plan)


@router.get("/plan/quick")
async def get_quick_evacuation_routes(
    from_zone: str = Query(..., description="Zone ID to evacuate from"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get quick evacuation recommendations for a specific zone.
    Returns top 3 recommended shelters and routes.
    """
    data_service = DataService(db)
    
    # Get zone data
    zone = await data_service.get_flood_zone(from_zone)
    if not zone:
        raise HTTPException(status_code=404, detail=f"Zone {from_zone} not found")
    
    # Get available shelters
    facilities = await data_service.get_facilities()
    shelters = [f for f in facilities if f.get("facility_type") == "shelter" and f.get("is_operational", True)]
    
    # Get routes
    routes = await data_service.get_evacuation_routes()
    passable_routes = [r for r in routes if r.get("is_passable", True)]
    
    # Simple distance-based recommendation
    recommendations = []
    zone_lat = zone.get("centroid_lat", 0)
    zone_lon = zone.get("centroid_lon", 0)
    
    for shelter in shelters:
        s_lat = shelter.get("latitude", 0)
        s_lon = shelter.get("longitude", 0)
        
        # Simple Euclidean distance (would use actual routing in production)
        dist = ((zone_lat - s_lat) ** 2 + (zone_lon - s_lon) ** 2) ** 0.5 * 111  # Approx km
        
        capacity_remaining = shelter.get("capacity", 0) - shelter.get("current_occupancy", 0)
        
        recommendations.append({
            "shelter_id": shelter["id"],
            "shelter_name": shelter.get("name", ""),
            "distance_km": round(dist, 2),
            "estimated_time_minutes": round(dist * 5, 0),  # Approx 12 km/h during flood
            "capacity_remaining": capacity_remaining,
            "risk_score": shelter.get("risk_score", 0),
        })
    
    # Sort by distance
    recommendations.sort(key=lambda x: x["distance_km"])
    
    return {
        "from_zone": from_zone,
        "zone_name": zone.get("name", ""),
        "population": zone.get("estimated_population", 0),
        "current_depth": zone.get("current_depth", 0),
        "recommendations": recommendations[:3],
    }


@router.get("/shelter-capacity")
async def get_shelter_capacity_overview(
    db: AsyncSession = Depends(get_db),
):
    """Get overview of shelter capacities across all evacuation centers"""
    data_service = DataService(db)
    facilities = await data_service.get_facilities()
    
    shelters = [f for f in facilities if f.get("facility_type") == "shelter"]
    
    total_capacity = sum(s.get("capacity", 0) for s in shelters)
    total_occupancy = sum(s.get("current_occupancy", 0) for s in shelters)
    operational_shelters = [s for s in shelters if s.get("is_operational", True)]
    
    return {
        "total_shelters": len(shelters),
        "operational_shelters": len(operational_shelters),
        "total_capacity": total_capacity,
        "current_occupancy": total_occupancy,
        "available_capacity": total_capacity - total_occupancy,
        "utilization_percent": round(total_occupancy / total_capacity * 100, 1) if total_capacity > 0 else 0,
        "shelters": [
            {
                "id": s["id"],
                "name": s.get("name", ""),
                "capacity": s.get("capacity", 0),
                "occupancy": s.get("current_occupancy", 0),
                "available": s.get("capacity", 0) - s.get("current_occupancy", 0),
                "status": s.get("status", "normal"),
                "is_operational": s.get("is_operational", True),
            }
            for s in shelters
        ],
    }
