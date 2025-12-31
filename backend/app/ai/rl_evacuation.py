"""
Reinforcement Learning Agent for Evacuation Planning
PPO-based agent that learns optimal evacuation routes under dynamic flood conditions
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.distributions import Categorical
from typing import Dict, List, Tuple, Optional, Any
import numpy as np
from collections import deque
from loguru import logger
from datetime import datetime
import heapq


class ActorCritic(nn.Module):
    """
    Actor-Critic network for PPO evacuation agent
    Actor: Outputs action probabilities (which route/shelter to recommend)
    Critic: Estimates state value
    """
    
    def __init__(
        self,
        state_dim: int = 64,
        hidden_dim: int = 128,
        num_actions: int = 20,
    ):
        super().__init__()
        
        # Shared feature extractor
        self.shared = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
        )
        
        # Actor head (policy)
        self.actor = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.ReLU(),
            nn.Linear(hidden_dim // 2, num_actions),
        )
        
        # Critic head (value function)
        self.critic = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.ReLU(),
            nn.Linear(hidden_dim // 2, 1),
        )
    
    def forward(self, state: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        features = self.shared(state)
        action_logits = self.actor(features)
        value = self.critic(features)
        return action_logits, value
    
    def get_action(self, state: torch.Tensor) -> Tuple[int, torch.Tensor, torch.Tensor]:
        action_logits, value = self(state)
        probs = F.softmax(action_logits, dim=-1)
        dist = Categorical(probs)
        action = dist.sample()
        log_prob = dist.log_prob(action)
        return action.item(), log_prob, value


class EvacuationEnvironment:
    """
    Simulation environment for evacuation planning
    State: Flood conditions, facility statuses, population distribution
    Actions: Route recommendations, shelter assignments
    Rewards: Based on evacuation success, travel time, casualties avoided
    """
    
    def __init__(
        self,
        zones: List[Dict[str, Any]],
        shelters: List[Dict[str, Any]],
        routes: List[Dict[str, Any]],
    ):
        self.zones = {z["id"]: z for z in zones}
        self.shelters = {s["id"]: s for s in shelters}
        self.routes = routes
        
        self.current_flood_state: Dict[str, float] = {}
        self.evacuated_population: Dict[str, int] = {}
        self.shelter_occupancy: Dict[str, int] = {}
        
        self.reset()
    
    def reset(self) -> np.ndarray:
        """Reset environment to initial state"""
        self.current_flood_state = {zone_id: 0.0 for zone_id in self.zones}
        self.evacuated_population = {zone_id: 0 for zone_id in self.zones}
        self.shelter_occupancy = {s_id: 0 for s_id in self.shelters}
        self.time_step = 0
        
        return self._get_state()
    
    def _get_state(self) -> np.ndarray:
        """Get current state representation"""
        state = []
        
        # Zone flood depths
        for zone_id in sorted(self.zones.keys()):
            state.append(self.current_flood_state.get(zone_id, 0.0))
        
        # Zone populations remaining
        for zone_id in sorted(self.zones.keys()):
            remaining = self.zones[zone_id].get("population", 0) - self.evacuated_population.get(zone_id, 0)
            state.append(remaining / 10000)  # Normalize
        
        # Shelter capacities remaining
        for shelter_id in sorted(self.shelters.keys()):
            capacity = self.shelters[shelter_id].get("capacity", 0)
            occupancy = self.shelter_occupancy.get(shelter_id, 0)
            state.append((capacity - occupancy) / 1000)  # Normalize
        
        # Pad to fixed size
        state = np.array(state, dtype=np.float32)
        if len(state) < 64:
            state = np.pad(state, (0, 64 - len(state)))
        
        return state[:64]
    
    def step(self, action: int) -> Tuple[np.ndarray, float, bool, Dict[str, Any]]:
        """
        Execute action and return new state, reward, done, info
        Action encodes: (zone_to_evacuate, target_shelter)
        """
        # Decode action
        num_zones = len(self.zones)
        zone_idx = action // len(self.shelters)
        shelter_idx = action % len(self.shelters)
        
        zone_ids = sorted(self.zones.keys())
        shelter_ids = sorted(self.shelters.keys())
        
        zone_id = zone_ids[zone_idx % len(zone_ids)]
        shelter_id = shelter_ids[shelter_idx % len(shelter_ids)]
        
        # Calculate reward components
        reward = 0.0
        info = {"evacuated": 0, "casualties_avoided": 0}
        
        # Check if zone needs evacuation
        zone = self.zones[zone_id]
        flood_depth = self.current_flood_state.get(zone_id, 0.0)
        remaining_pop = zone.get("population", 0) - self.evacuated_population.get(zone_id, 0)
        
        if flood_depth > 0.3 and remaining_pop > 0:
            # Check shelter capacity
            shelter = self.shelters[shelter_id]
            capacity = shelter.get("capacity", 0)
            occupancy = self.shelter_occupancy.get(shelter_id, 0)
            available = capacity - occupancy
            
            # Evacuate as many as possible
            to_evacuate = min(remaining_pop, available, 500)  # Max 500 per step
            
            if to_evacuate > 0:
                self.evacuated_population[zone_id] = self.evacuated_population.get(zone_id, 0) + to_evacuate
                self.shelter_occupancy[shelter_id] = occupancy + to_evacuate
                
                # Positive reward for successful evacuation
                reward += to_evacuate * 0.01
                
                # Bonus for evacuating high-risk zones
                if flood_depth > 1.0:
                    reward += to_evacuate * 0.02
                    info["casualties_avoided"] = int(to_evacuate * 0.1 * flood_depth)
                
                info["evacuated"] = to_evacuate
            else:
                # Penalty for choosing full shelter
                reward -= 0.1
        else:
            # Penalty for unnecessary evacuation
            reward -= 0.05
        
        # Time penalty
        reward -= 0.01
        
        # Update time and check termination
        self.time_step += 1
        done = self.time_step >= 100 or self._all_evacuated()
        
        return self._get_state(), reward, done, info
    
    def _all_evacuated(self) -> bool:
        """Check if all at-risk populations are evacuated"""
        for zone_id, zone in self.zones.items():
            flood_depth = self.current_flood_state.get(zone_id, 0.0)
            if flood_depth > 0.5:
                remaining = zone.get("population", 0) - self.evacuated_population.get(zone_id, 0)
                if remaining > 0:
                    return False
        return True
    
    def update_flood_state(self, flood_depths: Dict[str, float]):
        """Update current flood conditions"""
        self.current_flood_state.update(flood_depths)


class EvacuationAgent:
    """
    RL-based evacuation planning agent
    Uses PPO to learn optimal evacuation strategies
    """
    
    def __init__(
        self,
        state_dim: int = 64,
        num_zones: int = 10,
        num_shelters: int = 5,
        model_path: Optional[str] = None,
        device: str = "auto",
    ):
        self.device = self._get_device(device)
        self.num_actions = num_zones * num_shelters
        
        self.model = ActorCritic(
            state_dim=state_dim,
            hidden_dim=128,
            num_actions=self.num_actions,
        ).to(self.device)
        
        if model_path:
            self.load_model(model_path)
        
        self.model.eval()
        self.num_zones = num_zones
        self.num_shelters = num_shelters
        
        logger.info(f"Evacuation RL Agent initialized on {self.device}")
    
    def _get_device(self, device: str) -> torch.device:
        if device == "auto":
            if torch.cuda.is_available():
                return torch.device("cuda")
            return torch.device("cpu")
        return torch.device(device)
    
    def load_model(self, path: str):
        """Load pre-trained model weights"""
        try:
            state_dict = torch.load(path, map_location=self.device)
            self.model.load_state_dict(state_dict)
            logger.info(f"Loaded RL model from {path}")
        except Exception as e:
            logger.warning(f"Could not load model from {path}: {e}")
    
    @torch.no_grad()
    def get_evacuation_plan(
        self,
        flood_state: Dict[str, float],
        zones: List[Dict[str, Any]],
        shelters: List[Dict[str, Any]],
        routes: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Generate evacuation plan based on current flood state
        
        Returns:
            Dictionary containing recommended routes, shelter assignments, priorities
        """
        import time
        start_time = time.time()
        
        # Create environment
        env = EvacuationEnvironment(zones, shelters, routes)
        env.update_flood_state(flood_state)
        
        # Get initial state
        state = env._get_state()
        state_tensor = torch.tensor(state, dtype=torch.float32).unsqueeze(0).to(self.device)
        
        # Get action probabilities
        action_logits, value = self.model(state_tensor)
        action_probs = F.softmax(action_logits, dim=-1).squeeze().cpu().numpy()
        
        # Generate plan from action probabilities
        zone_ids = sorted([z["id"] for z in zones])
        shelter_ids = sorted([s["id"] for s in shelters])
        
        # Create priority rankings
        zone_priorities = []
        for i, zone_id in enumerate(zone_ids):
            zone = next((z for z in zones if z["id"] == zone_id), {})
            flood_depth = flood_state.get(zone_id, 0.0)
            population = zone.get("population", 0)
            
            # Priority based on flood depth and population
            priority_score = flood_depth * 10 + (population / 1000)
            zone_priorities.append((zone_id, priority_score, flood_depth))
        
        # Sort by priority (descending)
        zone_priorities.sort(key=lambda x: -x[1])
        
        # Assign shelters based on action probabilities
        shelter_assignments = {}
        recommended_routes = []
        shelter_capacity_remaining = {s["id"]: s.get("capacity", 1000) for s in shelters}
        
        for zone_id, priority_score, flood_depth in zone_priorities:
            if flood_depth < 0.3:
                continue
            
            # Find best available shelter
            best_shelter = None
            best_prob = -1
            
            zone_idx = zone_ids.index(zone_id)
            for j, shelter_id in enumerate(shelter_ids):
                if shelter_capacity_remaining[shelter_id] > 0:
                    action_idx = zone_idx * len(shelter_ids) + j
                    if action_idx < len(action_probs):
                        prob = action_probs[action_idx]
                        if prob > best_prob:
                            best_prob = prob
                            best_shelter = shelter_id
            
            if best_shelter:
                shelter_assignments[zone_id] = best_shelter
                
                # Find route
                route = self._find_best_route(zone_id, best_shelter, routes, flood_state)
                if route:
                    recommended_routes.append({
                        "from_zone": zone_id,
                        "to_shelter": best_shelter,
                        "route_ids": route["route_ids"],
                        "distance_km": route["distance"],
                        "eta_minutes": route["eta"],
                        "risk_score": route["risk"],
                    })
                
                # Update shelter capacity
                zone = next((z for z in zones if z["id"] == zone_id), {})
                shelter_capacity_remaining[best_shelter] -= zone.get("population", 0)
        
        # Identify roads to close
        roads_to_close = self._identify_roads_to_close(flood_state, routes)
        
        # Calculate total evacuees
        total_evacuees = sum(
            next((z.get("population", 0) for z in zones if z["id"] == zone_id), 0)
            for zone_id in shelter_assignments.keys()
        )
        
        inference_time = (time.time() - start_time) * 1000
        logger.debug(f"Evacuation plan generated in {inference_time:.2f}ms")
        
        return {
            "recommended_routes": recommended_routes,
            "shelter_assignments": shelter_assignments,
            "priority_order": [z[0] for z in zone_priorities if z[2] >= 0.3],
            "estimated_completion_hours": len(zone_priorities) * 0.5,
            "roads_to_close": roads_to_close,
            "total_evacuees": total_evacuees,
        }
    
    def _find_best_route(
        self,
        from_zone: str,
        to_shelter: str,
        routes: List[Dict[str, Any]],
        flood_state: Dict[str, float],
    ) -> Optional[Dict[str, Any]]:
        """Find best evacuation route using flood-aware pathfinding"""
        # Simplified route finding
        matching_routes = [
            r for r in routes
            if r.get("origin_zone_id") == from_zone or r.get("status") == "open"
        ]
        
        if not matching_routes:
            # Return a default route
            return {
                "route_ids": [routes[0]["id"]] if routes else [],
                "distance": 5.0,
                "eta": 15,
                "risk": 20.0,
            }
        
        # Score routes based on flood conditions
        best_route = min(
            matching_routes,
            key=lambda r: r.get("current_water_depth", 0) * 10 + r.get("length_km", 5)
        )
        
        return {
            "route_ids": [best_route["id"]],
            "distance": best_route.get("length_km", 5),
            "eta": best_route.get("estimated_time_minutes", 15),
            "risk": best_route.get("risk_score", 20),
        }
    
    def _identify_roads_to_close(
        self,
        flood_state: Dict[str, float],
        routes: List[Dict[str, Any]],
    ) -> List[str]:
        """Identify roads that should be closed due to flooding"""
        roads_to_close = []
        
        for route in routes:
            water_depth = route.get("current_water_depth", 0)
            if water_depth > 0.3:  # Close if water > 30cm
                roads_to_close.append(route["id"])
        
        return roads_to_close


# Singleton instance
_evacuation_agent_instance: Optional[EvacuationAgent] = None


def get_evacuation_agent() -> EvacuationAgent:
    """Get or create the evacuation agent singleton"""
    global _evacuation_agent_instance
    if _evacuation_agent_instance is None:
        from app.core.config import settings
        _evacuation_agent_instance = EvacuationAgent(
            model_path=settings.RL_MODEL_PATH if settings.RL_MODEL_PATH else None
        )
    return _evacuation_agent_instance
