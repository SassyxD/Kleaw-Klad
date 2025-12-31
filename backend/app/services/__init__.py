"""Backend services for flood monitoring and simulation"""

from app.services.websocket_manager import manager, broadcaster
from app.services.data_service import data_service
from app.services.simulation_service import SimulationService

# Singleton instances
simulation_service = SimulationService()

__all__ = [
    "manager",
    "broadcaster", 
    "data_service",
    "simulation_service",
]
