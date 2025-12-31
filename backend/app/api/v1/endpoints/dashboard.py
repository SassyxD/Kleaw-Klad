"""
Dashboard API Endpoints
Provides aggregated data for the main dashboard view
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from datetime import datetime

from app.core.database import get_db
from app.schemas import DashboardSummary
from app.services.data_service import DataService

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(
    db: AsyncSession = Depends(get_db),
):
    """
    Get comprehensive dashboard summary including:
    - Current flood statistics
    - Affected population
    - Facilities at risk
    - Active alerts
    - Water levels
    """
    data_service = DataService(db)
    
    # Get flood statistics
    flood_zones = await data_service.get_flood_zones()
    facilities = await data_service.get_facilities()
    routes = await data_service.get_evacuation_routes()
    
    # Calculate summary statistics
    affected_area = sum(z.get("area_sqkm", 0) for z in flood_zones if z.get("current_depth", 0) > 0)
    affected_population = sum(z.get("affected_population", 0) for z in flood_zones)
    
    facilities_at_risk = len([f for f in facilities if f.get("status") in ["at_risk", "affected"]])
    routes_closed = len([r for r in routes if r.get("status") == "closed"])
    
    # Generate active alerts
    active_alerts = []
    for zone in flood_zones:
        if zone.get("current_depth", 0) > 1.0:
            active_alerts.append({
                "id": f"alert_{zone['id']}",
                "type": "flood_warning",
                "severity": "high" if zone.get("current_depth", 0) > 1.5 else "medium",
                "message": f"High water level in {zone.get('name', zone['id'])}",
                "zone_id": zone["id"],
                "depth": zone.get("current_depth", 0),
                "timestamp": datetime.now().isoformat(),
            })
    
    # Mock water levels (would come from sensors in production)
    water_levels = {
        "u_tapao_canal_north": 2.35,
        "u_tapao_canal_central": 2.78,
        "u_tapao_canal_south": 2.45,
        "songkhla_lake_inlet": 1.85,
    }
    
    return DashboardSummary(
        flood_stats={
            "total_zones": len(flood_zones),
            "flooded_zones": len([z for z in flood_zones if z.get("current_depth", 0) > 0]),
            "high_risk_zones": len([z for z in flood_zones if z.get("risk_score", 0) > 70]),
            "average_depth": sum(z.get("current_depth", 0) for z in flood_zones) / max(len(flood_zones), 1),
            "max_depth": max((z.get("current_depth", 0) for z in flood_zones), default=0),
        },
        affected_population=affected_population,
        affected_area_sqkm=affected_area,
        facilities_at_risk=facilities_at_risk,
        routes_closed=routes_closed,
        active_alerts=active_alerts,
        water_levels=water_levels,
        last_updated=datetime.now(),
    )


@router.get("/stats")
async def get_quick_stats(
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Get quick statistics for dashboard cards"""
    data_service = DataService(db)
    
    flood_zones = await data_service.get_flood_zones()
    facilities = await data_service.get_facilities()
    routes = await data_service.get_evacuation_routes()
    
    return {
        "flood_area_sqkm": sum(z.get("area_sqkm", 0) for z in flood_zones if z.get("current_depth", 0) > 0),
        "affected_population": sum(z.get("affected_population", 0) for z in flood_zones),
        "total_facilities": len(facilities),
        "facilities_operational": len([f for f in facilities if f.get("is_operational", True)]),
        "facilities_at_risk": len([f for f in facilities if f.get("status") == "at_risk"]),
        "shelters_available": len([f for f in facilities if f.get("facility_type") == "shelter" and f.get("is_operational", True)]),
        "shelter_capacity": sum(f.get("capacity", 0) for f in facilities if f.get("facility_type") == "shelter"),
        "routes_open": len([r for r in routes if r.get("status") == "open"]),
        "routes_closed": len([r for r in routes if r.get("status") == "closed"]),
        "routes_at_risk": len([r for r in routes if r.get("status") == "at_risk"]),
    }


@router.get("/timeline")
async def get_flood_timeline(
    hours: int = 24,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Get historical and projected flood timeline"""
    data_service = DataService(db)
    
    # Would query historical data in production
    # For demo, generate sample timeline
    timeline = []
    base_time = datetime.now()
    
    for i in range(hours):
        from datetime import timedelta
        t = base_time - timedelta(hours=hours - i - 1)
        
        # Simulated data
        timeline.append({
            "timestamp": t.isoformat(),
            "hour": i,
            "avg_water_level": 1.5 + (i / hours) * 1.2 + np.random.uniform(-0.1, 0.1),
            "flooded_area_sqkm": 5 + (i / hours) * 3,
            "affected_population": int(5000 + (i / hours) * 7000),
        })
    
    return {
        "timeline": timeline,
        "period_hours": hours,
        "start_time": timeline[0]["timestamp"] if timeline else None,
        "end_time": timeline[-1]["timestamp"] if timeline else None,
    }


# Import numpy for simulation
import numpy as np
