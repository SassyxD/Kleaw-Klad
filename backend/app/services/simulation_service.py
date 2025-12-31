"""
Flood Simulation Service
Runs flood simulations based on rainfall and geographic parameters
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import numpy as np
import asyncio
from loguru import logger

from app.services.websocket_manager import broadcaster
from app.ai import get_risk_engine, get_evacuation_agent
from app.ai.gnn_risk import InfrastructureKnowledgeGraph


class SimulationService:
    """
    Flood simulation engine for Hat Yai.
    Combines hydraulic modeling with AI-based risk propagation.
    """
    
    def __init__(self):
        # Hat Yai geographic parameters
        self.catchment_area_sqkm = 520  # U-Tapao basin area
        self.base_elevation = 4.0  # meters above sea level
        self.drainage_capacity = 150  # mm/hour
        
        # Simulation parameters
        self.time_step_minutes = 15
        self.max_water_depth = 3.0  # meters
    
    def quick_simulate(
        self,
        rainfall_mm: float,
        duration_hours: float,
    ) -> Dict[str, Any]:
        """
        Run quick simulation without database storage.
        Returns predicted flood impacts.
        """
        # Simple runoff model
        total_rainfall = rainfall_mm * duration_hours
        excess_water = max(0, total_rainfall - self.drainage_capacity * duration_hours)
        
        # Estimate flood extent based on excess water
        flood_factor = min(1.0, excess_water / 200)  # Normalized to historical max
        
        # Calculate impacts
        zones_affected = []
        base_zones = [
            {"id": "zone_u_tapao", "name": "U-Tapao Canal Area", "base_depth": 0.5, "vulnerability": 1.0},
            {"id": "zone_hatyai_nai", "name": "Hat Yai CBD", "base_depth": 0.3, "vulnerability": 0.8},
            {"id": "zone_klong_hae", "name": "Klong Hae", "base_depth": 0.2, "vulnerability": 0.7},
            {"id": "zone_khohong", "name": "Khohong", "base_depth": 0.15, "vulnerability": 0.6},
            {"id": "zone_khuan_lang", "name": "Khuan Lang", "base_depth": 0.1, "vulnerability": 0.5},
        ]
        
        total_affected_population = 0
        for zone in base_zones:
            predicted_depth = zone["base_depth"] + (flood_factor * 2.0 * zone["vulnerability"])
            predicted_depth = min(predicted_depth, self.max_water_depth)
            
            if predicted_depth > 0.3:
                risk_score = min(100, 30 + predicted_depth * 30)
                pop_factor = min(1.0, predicted_depth / 1.5)
                
                zone_pop = {
                    "zone_u_tapao": 6000,
                    "zone_hatyai_nai": 25000,
                    "zone_klong_hae": 8500,
                    "zone_khohong": 12000,
                    "zone_khuan_lang": 15000,
                }.get(zone["id"], 5000)
                
                affected_pop = int(zone_pop * pop_factor)
                total_affected_population += affected_pop
                
                zones_affected.append({
                    "zone_id": zone["id"],
                    "zone_name": zone["name"],
                    "predicted_depth": round(predicted_depth, 2),
                    "depth_category": "high" if predicted_depth > 1.5 else "medium" if predicted_depth > 0.5 else "low",
                    "risk_score": round(risk_score, 1),
                    "affected_population": affected_pop,
                })
        
        # Estimate peak time
        peak_hour = min(duration_hours * 0.7, 12)  # Peak typically at 70% through event
        
        # Calculate facility impacts
        facilities_at_risk = []
        if flood_factor > 0.3:
            facilities_at_risk.append({"id": "hospital_songklanagarind", "risk": "at_risk"})
        if flood_factor > 0.5:
            facilities_at_risk.append({"id": "school_hatyai", "risk": "affected"})
            facilities_at_risk.append({"id": "shelter_c", "risk": "at_risk"})
        if flood_factor > 0.7:
            facilities_at_risk.append({"id": "hospital_hatyai", "risk": "at_risk"})
        
        # Routes at risk
        routes_affected = []
        if flood_factor > 0.2:
            routes_affected.append({"id": "route_central", "status": "closed"})
        if flood_factor > 0.4:
            routes_affected.append({"id": "route_east_bypass", "status": "at_risk"})
        
        return {
            "summary": {
                "total_rainfall_mm": total_rainfall,
                "excess_water_mm": round(excess_water, 1),
                "flood_severity": "severe" if flood_factor > 0.7 else "moderate" if flood_factor > 0.4 else "minor",
                "peak_time_hours": round(peak_hour, 1),
                "estimated_duration_hours": round(duration_hours * 1.5, 1),
            },
            "zones_affected": zones_affected,
            "total_affected_population": total_affected_population,
            "facilities_at_risk": facilities_at_risk,
            "routes_affected": routes_affected,
            "recommendations": self._generate_recommendations(flood_factor, zones_affected),
        }
    
    def _generate_recommendations(
        self,
        flood_factor: float,
        zones_affected: List[Dict[str, Any]],
    ) -> List[Dict[str, str]]:
        """Generate actionable recommendations based on simulation"""
        recommendations = []
        
        if flood_factor > 0.7:
            recommendations.append({
                "priority": "critical",
                "action": "Immediate evacuation",
                "message": "Evacuate U-Tapao Canal area and Hat Yai CBD immediately",
            })
            recommendations.append({
                "priority": "high",
                "action": "Close roads",
                "message": "Close Route C (Central Road) and monitor Route B",
            })
        elif flood_factor > 0.4:
            recommendations.append({
                "priority": "high",
                "action": "Prepare evacuation",
                "message": "Prepare evacuation for low-lying areas near U-Tapao Canal",
            })
            recommendations.append({
                "priority": "medium",
                "action": "Monitor roads",
                "message": "Monitor water levels on Route B and Route C",
            })
        elif flood_factor > 0.2:
            recommendations.append({
                "priority": "medium",
                "action": "Alert residents",
                "message": "Issue flood warning for areas near U-Tapao Canal",
            })
        
        # Always recommend shelter preparation
        if zones_affected:
            recommendations.append({
                "priority": "standard",
                "action": "Activate shelters",
                "message": "Ensure Shelter A and Shelter B are ready to receive evacuees",
            })
        
        return recommendations
    
    async def run_simulation(
        self,
        scenario_id: str,
        parameters: Dict[str, Any],
    ):
        """
        Run full simulation with database storage and WebSocket updates.
        This is called as a background task.
        """
        logger.info(f"Starting simulation {scenario_id}")
        
        rainfall_mm = parameters.get("rainfall_mm_per_hour", 50)
        duration_hours = parameters.get("duration_hours", 12)
        tide_factor = parameters.get("tide_factor", 1.0)
        
        # Calculate total timesteps
        total_steps = int(duration_hours * 60 / self.time_step_minutes)
        
        try:
            # Initialize knowledge graph for GNN
            kg = InfrastructureKnowledgeGraph()
            
            # Add zones
            zones_data = [
                ("zone_u_tapao", (7.010, 100.468), 4.0, 6000),
                ("zone_hatyai_nai", (7.005, 100.480), 6.0, 25000),
                ("zone_klong_hae", (7.025, 100.460), 8.0, 8500),
                ("zone_khohong", (7.000, 100.505), 10.0, 12000),
                ("zone_khuan_lang", (7.045, 100.435), 15.0, 15000),
            ]
            
            for zone_id, centroid, elevation, population in zones_data:
                kg.add_flood_zone(zone_id, centroid, elevation, population)
            
            # Add facilities
            facilities_data = [
                ("hospital_hatyai", "hospital", (7.0086, 100.4747), 12.5),
                ("hospital_songklanagarind", "hospital", (7.0050, 100.5020), 8.2),
                ("shelter_a", "shelter", (7.0300, 100.4400), 18.5),
                ("shelter_b", "shelter", (6.9850, 100.4900), 14.0),
                ("power_main", "power_station", (7.0150, 100.4580), 15.0),
            ]
            
            for fac_id, fac_type, location, elevation in facilities_data:
                kg.add_facility(fac_id, fac_type, location, elevation)
            
            # Add connections
            zone_ids = [z[0] for z in zones_data]
            for i in range(len(zone_ids) - 1):
                kg.add_road_connection(zone_ids[i], zone_ids[i + 1], 2.5)
                kg.add_drainage_connection(zone_ids[i], zone_ids[i + 1], 100)
            
            # Get risk engine
            risk_engine = get_risk_engine()
            risk_engine.set_knowledge_graph(kg)
            
            # Run simulation steps
            for step in range(total_steps):
                # Calculate current rainfall intensity (varies over time)
                time_factor = np.sin(np.pi * step / total_steps)  # Peak in middle
                current_rainfall = rainfall_mm * (0.5 + 0.5 * time_factor)
                
                # Calculate flood depths for each zone
                flood_depths = {}
                for zone_id, _, elevation, _ in zones_data:
                    # Simple accumulation model
                    base_depth = (current_rainfall / 50) * (step / total_steps) * 2
                    elevation_factor = (15 - elevation) / 15  # Lower elevation = more flooding
                    flood_depths[zone_id] = min(
                        self.max_water_depth,
                        base_depth * elevation_factor * tide_factor
                    )
                
                # Run GNN risk propagation
                risk_result = risk_engine.propagate_risk(flood_depths, hours_ahead=1)
                
                # Calculate progress
                progress = (step + 1) / total_steps * 100
                
                # Broadcast update
                await broadcaster.broadcast_simulation_progress(
                    scenario_id=scenario_id,
                    progress=progress,
                    current_step=step + 1,
                    total_steps=total_steps,
                    current_data={
                        "flood_depths": flood_depths,
                        "risk_scores": risk_result["zone_risk_scores"],
                        "warnings": risk_result["critical_warnings"][:3],
                    },
                )
                
                # Simulate processing time
                await asyncio.sleep(0.1)  # 100ms per step for demo
            
            logger.info(f"Simulation {scenario_id} completed")
            
            # Final broadcast
            await broadcaster.broadcast_alert(
                alert_type="simulation_complete",
                severity="info",
                message=f"Simulation {scenario_id} completed successfully",
                data={"scenario_id": scenario_id},
            )
            
        except Exception as e:
            logger.error(f"Simulation {scenario_id} failed: {e}")
            await broadcaster.broadcast_alert(
                alert_type="simulation_error",
                severity="error",
                message=f"Simulation {scenario_id} failed: {str(e)}",
                data={"scenario_id": scenario_id},
            )
