"""
API Router - Aggregates all endpoint routers
"""

from fastapi import APIRouter

from app.api.v1.endpoints import flood, facilities, evacuation, simulation, ai, dashboard

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(
    dashboard.router,
    prefix="/dashboard",
    tags=["Dashboard"],
)

api_router.include_router(
    flood.router,
    prefix="/flood",
    tags=["Flood Data"],
)

api_router.include_router(
    facilities.router,
    prefix="/facilities",
    tags=["Facilities"],
)

api_router.include_router(
    evacuation.router,
    prefix="/evacuation",
    tags=["Evacuation"],
)

api_router.include_router(
    simulation.router,
    prefix="/simulation",
    tags=["Simulation"],
)

api_router.include_router(
    ai.router,
    prefix="/ai",
    tags=["AI Models"],
)
