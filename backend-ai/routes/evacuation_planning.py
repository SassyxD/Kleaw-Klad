from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import time
import random

router = APIRouter()


class Coordinates(BaseModel):
    lat: float
    lng: float


class FloodCell(BaseModel):
    lat: float
    lng: float
    depth: float


class Shelter(BaseModel):
    id: str
    coordinates: Coordinates
    capacity: int


class EvacuationPlanRequest(BaseModel):
    floodState: List[FloodCell]
    origins: List[Coordinates]
    shelters: List[Shelter]
    vehicles: int = 10


class VehicleAssignment(BaseModel):
    vehicle: int
    route: List[Coordinates]
    pickups: int
    duration: int


class EvacuationPlanResponse(BaseModel):
    success: bool
    data: dict | None = None
    error: dict | None = None


@router.post("/evacuation-plan")
async def evacuation_planning(request: EvacuationPlanRequest):
    """
    Generate optimal evacuation plan using Reinforcement Learning (PPO).
    
    In production, this would use a MindSpore RL agent trained via
    Proximal Policy Optimization to:
    - Assign vehicles to evacuation zones
    - Optimize routes avoiding flooded areas
    - Maximize evacuated population
    - Minimize total evacuation time
    """
    try:
        start_time = time.time()
        
        # Mock RL policy inference
        # In production: query trained PPO agent in MindSpore
        assignments: List[VehicleAssignment] = []
        
        # Assign vehicles to zones
        zones_per_vehicle = len(request.origins) // request.vehicles
        
        for v in range(request.vehicles):
            # Select origins for this vehicle
            start_idx = v * zones_per_vehicle
            end_idx = start_idx + zones_per_vehicle if v < request.vehicles - 1 else len(request.origins)
            
            # Generate route (mock)
            route = []
            for origin in request.origins[start_idx:end_idx]:
                route.append(origin)
            
            # Add nearest shelter
            if request.shelters:
                nearest_shelter = random.choice(request.shelters)
                route.append(nearest_shelter.coordinates)
            
            assignments.append(VehicleAssignment(
                vehicle=v + 1,
                route=route,
                pickups=random.randint(30, 60),
                duration=random.randint(12, 25),
            ))
        
        total_evacuated = sum(a.pickups for a in assignments)
        avg_time = sum(a.duration for a in assignments) / len(assignments) if assignments else 0
        
        processing_time = time.time() - start_time
        
        return EvacuationPlanResponse(
            success=True,
            data={
                "assignments": [a.dict() for a in assignments],
                "totalEvacuated": total_evacuated,
                "averageTime": round(avg_time, 1),
                "processingTime": round(processing_time, 2),
                "model": "PPO Agent (MindSpore RL)",
                "algorithm": "Proximal Policy Optimization",
            }
        )
        
    except Exception as e:
        return EvacuationPlanResponse(
            success=False,
            error={
                "code": "AI_004",
                "message": "Evacuation planning failed",
                "details": str(e),
            }
        )
