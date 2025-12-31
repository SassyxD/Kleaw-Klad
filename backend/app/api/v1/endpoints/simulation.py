"""
Flood Simulation API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime
import uuid

from app.core.database import get_db
from app.schemas import (
    SimulationScenarioCreate,
    SimulationScenarioResponse,
    SimulationTimeStepResponse,
)
from app.services.data_service import DataService
from app.services.simulation_service import SimulationService

router = APIRouter()


@router.get("/scenarios", response_model=List[SimulationScenarioResponse])
async def get_scenarios(
    status: Optional[str] = Query(None, description="Filter by status: pending, running, completed"),
    limit: int = Query(default=20, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Get list of simulation scenarios"""
    data_service = DataService(db)
    scenarios = await data_service.get_simulation_scenarios(status=status, limit=limit)
    return scenarios


@router.get("/scenarios/{scenario_id}", response_model=SimulationScenarioResponse)
async def get_scenario(
    scenario_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get specific simulation scenario"""
    data_service = DataService(db)
    scenario = await data_service.get_simulation_scenario(scenario_id)
    
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario {scenario_id} not found")
    
    return scenario


@router.post("/scenarios", response_model=SimulationScenarioResponse)
async def create_scenario(
    scenario: SimulationScenarioCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """
    Create and start a new flood simulation scenario.
    
    Parameters:
    - **rainfall_mm_per_hour**: Expected rainfall intensity
    - **duration_hours**: Duration of the rainfall event
    - **initial_canal_level**: Starting water level in U-Tapao Canal
    - **tide_factor**: Songkhla Lake tide influence (1.0 = normal)
    """
    # Generate scenario ID
    scenario_id = f"sim_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}"
    
    # Create scenario in database
    data_service = DataService(db)
    created = await data_service.create_simulation_scenario({
        "id": scenario_id,
        **scenario.model_dump(),
        "status": "pending",
        "progress_percent": 0,
        "created_at": datetime.now(),
    })
    
    # Start simulation in background
    sim_service = SimulationService()
    background_tasks.add_task(sim_service.run_simulation, scenario_id, scenario.model_dump())
    
    return created


@router.get("/scenarios/{scenario_id}/timesteps")
async def get_scenario_timesteps(
    scenario_id: str,
    start_step: int = Query(default=0, ge=0),
    end_step: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
):
    """Get time-series results for a simulation scenario"""
    data_service = DataService(db)
    timesteps = await data_service.get_simulation_timesteps(scenario_id, start_step, end_step)
    
    return {
        "scenario_id": scenario_id,
        "start_step": start_step,
        "end_step": end_step,
        "count": len(timesteps),
        "timesteps": timesteps,
    }


@router.delete("/scenarios/{scenario_id}")
async def delete_scenario(
    scenario_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Delete a simulation scenario"""
    data_service = DataService(db)
    deleted = await data_service.delete_simulation_scenario(scenario_id)
    
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Scenario {scenario_id} not found")
    
    return {"message": f"Scenario {scenario_id} deleted successfully"}


@router.post("/quick-sim")
async def run_quick_simulation(
    rainfall_mm: float = Query(..., ge=10, le=500, description="Rainfall in mm/hr"),
    duration_hours: float = Query(default=6, ge=1, le=48),
    db: AsyncSession = Depends(get_db),
):
    """
    Run a quick simulation preview without saving to database.
    Returns predicted flood impacts for immediate visualization.
    """
    sim_service = SimulationService()
    
    results = sim_service.quick_simulate(
        rainfall_mm=rainfall_mm,
        duration_hours=duration_hours,
    )
    
    return {
        "parameters": {
            "rainfall_mm_per_hour": rainfall_mm,
            "duration_hours": duration_hours,
        },
        "predictions": results,
    }


@router.get("/presets")
async def get_simulation_presets():
    """
    Get predefined simulation scenarios based on historical events.
    """
    return {
        "presets": [
            {
                "id": "monsoon_moderate",
                "name": "Moderate Monsoon",
                "name_th": "มรสุมปานกลาง",
                "description": "Typical monsoon rainfall event",
                "rainfall_mm_per_hour": 40,
                "duration_hours": 12,
                "tide_factor": 1.0,
            },
            {
                "id": "monsoon_severe",
                "name": "Severe Monsoon",
                "name_th": "มรสุมรุนแรง",
                "description": "Heavy monsoon with sustained rainfall",
                "rainfall_mm_per_hour": 80,
                "duration_hours": 18,
                "tide_factor": 1.2,
            },
            {
                "id": "flash_flood",
                "name": "Flash Flood",
                "name_th": "น้ำท่วมฉับพลัน",
                "description": "Intense short-duration rainfall",
                "rainfall_mm_per_hour": 120,
                "duration_hours": 4,
                "tide_factor": 1.0,
            },
            {
                "id": "2010_historical",
                "name": "2010 Historic Flood",
                "name_th": "น้ำท่วม 2553",
                "description": "Simulates the 2010 Hat Yai flood event",
                "rainfall_mm_per_hour": 150,
                "duration_hours": 24,
                "tide_factor": 1.3,
            },
            {
                "id": "climate_extreme",
                "name": "Climate Change Extreme",
                "name_th": "สถานการณ์สุดขีด",
                "description": "Potential future extreme event",
                "rainfall_mm_per_hour": 200,
                "duration_hours": 36,
                "tide_factor": 1.5,
            },
        ]
    }


@router.get("/current-state")
async def get_current_simulation_state(
    db: AsyncSession = Depends(get_db),
):
    """
    Get current flood state for the digital twin.
    Combines real sensor data with simulation predictions.
    """
    data_service = DataService(db)
    
    # Get current flood zones
    zones = await data_service.get_flood_zones()
    facilities = await data_service.get_facilities()
    routes = await data_service.get_evacuation_routes()
    
    return {
        "timestamp": datetime.now().isoformat(),
        "flood_zones": [
            {
                "id": z["id"],
                "name": z.get("name", ""),
                "depth": z.get("current_depth", 0),
                "depth_category": z.get("depth_category", "none"),
                "risk_score": z.get("risk_score", 0),
            }
            for z in zones
        ],
        "affected_facilities": [
            {
                "id": f["id"],
                "name": f.get("name", ""),
                "type": f.get("facility_type", ""),
                "status": f.get("status", "normal"),
            }
            for f in facilities if f.get("status") != "normal"
        ],
        "route_status": [
            {
                "id": r["id"],
                "name": r.get("name", ""),
                "status": r.get("status", "open"),
            }
            for r in routes if r.get("status") != "open"
        ],
    }
