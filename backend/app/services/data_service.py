"""
Data Service - Provides data access layer with mock data for demo
In production, this would query the database and external APIs
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
import numpy as np


class DataService:
    """
    Data access service for flood digital twin.
    Provides Hat Yai specific data for demonstration.
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self._init_mock_data()
    
    def _init_mock_data(self):
        """Initialize mock data for Hat Yai demonstration"""
        
        # Flood zones based on real Hat Yai geography
        self._flood_zones = [
            {
                "id": "zone_klong_hae",
                "name": "คลองแห",
                "name_en": "Klong Hae",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[100.445, 7.025], [100.455, 7.035], [100.470, 7.040], 
                                    [100.480, 7.030], [100.475, 7.015], [100.460, 7.010], [100.445, 7.020]]]
                },
                "centroid_lat": 7.025,
                "centroid_lon": 100.460,
                "area_sqkm": 2.8,
                "current_depth": 1.2,
                "depth_category": "medium",
                "risk_score": 72.5,
                "estimated_population": 8500,
                "affected_population": 3200,
            },
            {
                "id": "zone_khohong",
                "name": "คอหงส์",
                "name_en": "Khohong",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[100.490, 6.995], [100.495, 7.010], [100.510, 7.015], 
                                    [100.520, 7.005], [100.515, 6.990], [100.500, 6.985]]]
                },
                "centroid_lat": 7.000,
                "centroid_lon": 100.505,
                "area_sqkm": 3.2,
                "current_depth": 0.8,
                "depth_category": "medium",
                "risk_score": 58.0,
                "estimated_population": 12000,
                "affected_population": 2800,
            },
            {
                "id": "zone_hatyai_nai",
                "name": "หาดใหญ่ใน",
                "name_en": "Hat Yai Nai (CBD)",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[100.465, 7.000], [100.470, 7.015], [100.485, 7.020], 
                                    [100.495, 7.010], [100.490, 6.995], [100.475, 6.990]]]
                },
                "centroid_lat": 7.005,
                "centroid_lon": 100.480,
                "area_sqkm": 4.5,
                "current_depth": 1.8,
                "depth_category": "high",
                "risk_score": 89.0,
                "estimated_population": 25000,
                "affected_population": 12500,
            },
            {
                "id": "zone_khuan_lang",
                "name": "ควนลัง",
                "name_en": "Khuan Lang",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[100.420, 7.040], [100.425, 7.055], [100.440, 7.060], 
                                    [100.450, 7.050], [100.445, 7.035], [100.430, 7.030]]]
                },
                "centroid_lat": 7.045,
                "centroid_lon": 100.435,
                "area_sqkm": 3.8,
                "current_depth": 0.4,
                "depth_category": "low",
                "risk_score": 32.0,
                "estimated_population": 15000,
                "affected_population": 1200,
            },
            {
                "id": "zone_u_tapao",
                "name": "บริเวณคลองอู่ตะเภา",
                "name_en": "U-Tapao Canal Area",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[100.455, 7.010], [100.465, 7.025], [100.475, 7.020], 
                                    [100.485, 7.005], [100.475, 6.995], [100.460, 7.000]]]
                },
                "centroid_lat": 7.010,
                "centroid_lon": 100.468,
                "area_sqkm": 2.1,
                "current_depth": 2.2,
                "depth_category": "high",
                "risk_score": 95.0,
                "estimated_population": 6000,
                "affected_population": 5400,
            },
        ]
        
        # Facilities
        self._facilities = [
            {
                "id": "hospital_hatyai",
                "name": "โรงพยาบาลหาดใหญ่",
                "name_en": "Hat Yai Hospital",
                "latitude": 7.0086,
                "longitude": 100.4747,
                "facility_type": "hospital",
                "category": "critical",
                "status": "normal",
                "risk_score": 45.0,
                "is_operational": True,
                "capacity": 800,
                "current_occupancy": 650,
                "elevation_m": 12.5,
            },
            {
                "id": "hospital_songklanagarind",
                "name": "โรงพยาบาลสงขลานครินทร์",
                "name_en": "Songklanagarind Hospital",
                "latitude": 7.0050,
                "longitude": 100.5020,
                "facility_type": "hospital",
                "category": "critical",
                "status": "at_risk",
                "risk_score": 68.0,
                "is_operational": True,
                "capacity": 1200,
                "current_occupancy": 980,
                "elevation_m": 8.2,
            },
            {
                "id": "power_main",
                "name": "สถานีไฟฟ้าหลัก",
                "name_en": "Main Power Station",
                "latitude": 7.0150,
                "longitude": 100.4580,
                "facility_type": "power_station",
                "category": "critical",
                "status": "normal",
                "risk_score": 25.0,
                "is_operational": True,
                "elevation_m": 15.0,
            },
            {
                "id": "shelter_a",
                "name": "ศูนย์พักพิง A (สนามกีฬา)",
                "name_en": "Shelter A (Sports Complex)",
                "latitude": 7.0300,
                "longitude": 100.4400,
                "facility_type": "shelter",
                "category": "essential",
                "status": "normal",
                "risk_score": 15.0,
                "is_operational": True,
                "capacity": 2000,
                "current_occupancy": 450,
                "elevation_m": 18.5,
            },
            {
                "id": "shelter_b",
                "name": "ศูนย์พักพิง B (วัดหาดใหญ่)",
                "name_en": "Shelter B (Wat Hat Yai)",
                "latitude": 6.9850,
                "longitude": 100.4900,
                "facility_type": "shelter",
                "category": "essential",
                "status": "normal",
                "risk_score": 30.0,
                "is_operational": True,
                "capacity": 1500,
                "current_occupancy": 280,
                "elevation_m": 14.0,
            },
            {
                "id": "shelter_c",
                "name": "ศูนย์พักพิง C (โรงเรียนหาดใหญ่วิทยาลัย)",
                "name_en": "Shelter C (Hat Yai Wittayalai School)",
                "latitude": 7.0100,
                "longitude": 100.4650,
                "facility_type": "shelter",
                "category": "essential",
                "status": "at_risk",
                "risk_score": 55.0,
                "is_operational": True,
                "capacity": 1000,
                "current_occupancy": 720,
                "elevation_m": 10.5,
            },
            {
                "id": "school_hatyai",
                "name": "โรงเรียนหาดใหญ่วิทยาลัย",
                "name_en": "Hat Yai Wittayalai School",
                "latitude": 7.0100,
                "longitude": 100.4650,
                "facility_type": "school",
                "category": "standard",
                "status": "closed",
                "risk_score": 75.0,
                "is_operational": False,
                "elevation_m": 10.5,
            },
            {
                "id": "school_psu",
                "name": "มหาวิทยาลัยสงขลานครินทร์",
                "name_en": "Prince of Songkla University",
                "latitude": 7.0055,
                "longitude": 100.5015,
                "facility_type": "school",
                "category": "standard",
                "status": "at_risk",
                "risk_score": 60.0,
                "is_operational": True,
                "elevation_m": 9.0,
            },
        ]
        
        # Evacuation routes
        self._routes = [
            {
                "id": "route_north_highway",
                "name": "เส้นทาง A - ทางหลวงเหนือ",
                "name_en": "Route A - Northern Highway",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[100.475, 7.010], [100.465, 7.025], [100.450, 7.040], [100.430, 7.060]]
                },
                "length_km": 8.5,
                "estimated_time_minutes": 25,
                "road_type": "highway",
                "status": "open",
                "risk_score": 15.0,
                "current_water_depth": 0.1,
                "is_passable": True,
                "vehicle_capacity_per_hour": 2000,
            },
            {
                "id": "route_east_bypass",
                "name": "เส้นทาง B - ทางเลี่ยงตะวันออก",
                "name_en": "Route B - Eastern Bypass",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[100.480, 7.005], [100.510, 7.010], [100.530, 7.025], [100.545, 7.045]]
                },
                "length_km": 12.0,
                "estimated_time_minutes": 35,
                "road_type": "main_road",
                "status": "at_risk",
                "risk_score": 55.0,
                "current_water_depth": 0.35,
                "is_passable": True,
                "vehicle_capacity_per_hour": 1500,
            },
            {
                "id": "route_central",
                "name": "เส้นทาง C - ถนนกลาง",
                "name_en": "Route C - Central Road",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[100.475, 7.008], [100.490, 7.000], [100.510, 6.995]]
                },
                "length_km": 5.0,
                "estimated_time_minutes": 20,
                "road_type": "main_road",
                "status": "closed",
                "risk_score": 92.0,
                "current_water_depth": 0.8,
                "is_passable": False,
                "vehicle_capacity_per_hour": 1000,
            },
            {
                "id": "route_south",
                "name": "เส้นทาง D - ทางใต้",
                "name_en": "Route D - Southern Route",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[100.470, 7.005], [100.455, 6.990], [100.440, 6.970], [100.420, 6.950]]
                },
                "length_km": 10.0,
                "estimated_time_minutes": 30,
                "road_type": "highway",
                "status": "open",
                "risk_score": 20.0,
                "current_water_depth": 0.05,
                "is_passable": True,
                "vehicle_capacity_per_hour": 1800,
            },
        ]
        
        # Water level monitoring stations
        self._water_levels = [
            {
                "station_id": "u_tapao_north",
                "name": "คลองอู่ตะเภา (เหนือ)",
                "name_en": "U-Tapao Canal (North)",
                "latitude": 7.0350,
                "longitude": 100.4600,
                "current_level": 2.35,
                "warning_level": 2.50,
                "critical_level": 3.00,
                "status": "normal",
            },
            {
                "station_id": "u_tapao_central",
                "name": "คลองอู่ตะเภา (กลาง)",
                "name_en": "U-Tapao Canal (Central)",
                "latitude": 7.0086,
                "longitude": 100.4700,
                "current_level": 2.78,
                "warning_level": 2.50,
                "critical_level": 3.00,
                "status": "warning",
            },
            {
                "station_id": "u_tapao_south",
                "name": "คลองอู่ตะเภา (ใต้)",
                "name_en": "U-Tapao Canal (South)",
                "latitude": 6.9800,
                "longitude": 100.4850,
                "current_level": 2.45,
                "warning_level": 2.50,
                "critical_level": 3.00,
                "status": "normal",
            },
            {
                "station_id": "songkhla_inlet",
                "name": "ปากทางเข้าทะเลสาบสงขลา",
                "name_en": "Songkhla Lake Inlet",
                "latitude": 6.9500,
                "longitude": 100.5000,
                "current_level": 1.85,
                "warning_level": 2.00,
                "critical_level": 2.50,
                "status": "normal",
            },
        ]
    
    # ==================== Flood Zone Methods ====================
    
    async def get_flood_zones(self) -> List[Dict[str, Any]]:
        """Get all flood zones with current status"""
        return self._flood_zones.copy()
    
    async def get_flood_zone(self, zone_id: str) -> Optional[Dict[str, Any]]:
        """Get specific flood zone by ID"""
        for zone in self._flood_zones:
            if zone["id"] == zone_id:
                return zone.copy()
        return None
    
    async def create_flood_zone(self, zone_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new flood zone"""
        self._flood_zones.append(zone_data)
        return zone_data
    
    async def update_flood_zone(self, zone_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a flood zone"""
        for i, zone in enumerate(self._flood_zones):
            if zone["id"] == zone_id:
                self._flood_zones[i].update(update_data)
                # Update depth category based on depth
                depth = self._flood_zones[i].get("current_depth", 0)
                if depth > 1.5:
                    self._flood_zones[i]["depth_category"] = "high"
                elif depth > 0.5:
                    self._flood_zones[i]["depth_category"] = "medium"
                elif depth > 0:
                    self._flood_zones[i]["depth_category"] = "low"
                else:
                    self._flood_zones[i]["depth_category"] = "none"
                return self._flood_zones[i].copy()
        return None
    
    async def get_zone_flood_history(self, zone_id: str, days: int) -> List[Dict[str, Any]]:
        """Get historical flood events for a zone"""
        # Generate mock history
        events = []
        base_time = datetime.now()
        
        for i in range(min(days // 7, 5)):  # Up to 5 historical events
            events.append({
                "event_id": f"event_{zone_id}_{i}",
                "start_time": (base_time - timedelta(days=i*7 + 1)).isoformat(),
                "end_time": (base_time - timedelta(days=i*7)).isoformat(),
                "peak_depth": 0.5 + np.random.uniform(0, 1.5),
                "rainfall_mm": 50 + np.random.uniform(0, 100),
                "duration_hours": 6 + np.random.uniform(0, 18),
            })
        
        return events
    
    # ==================== Facility Methods ====================
    
    async def get_facilities(self) -> List[Dict[str, Any]]:
        """Get all facilities"""
        return self._facilities.copy()
    
    async def get_facility(self, facility_id: str) -> Optional[Dict[str, Any]]:
        """Get specific facility by ID"""
        for facility in self._facilities:
            if facility["id"] == facility_id:
                return facility.copy()
        return None
    
    async def get_facility_accessibility(self, facility_id: str) -> Optional[Dict[str, Any]]:
        """Get accessibility information for a facility"""
        facility = await self.get_facility(facility_id)
        if not facility:
            return None
        
        # Find passable routes
        passable_routes = [r for r in self._routes if r.get("is_passable", True)]
        
        return {
            "facility_id": facility_id,
            "facility_name": facility.get("name", ""),
            "is_accessible": len(passable_routes) > 0,
            "accessible_routes": len(passable_routes),
            "total_routes": len(self._routes),
            "routes": [
                {
                    "id": r["id"],
                    "name": r.get("name", ""),
                    "status": r.get("status", "open"),
                    "estimated_time": r.get("estimated_time_minutes", 0),
                }
                for r in passable_routes
            ],
        }
    
    # ==================== Route Methods ====================
    
    async def get_evacuation_routes(self) -> List[Dict[str, Any]]:
        """Get all evacuation routes"""
        return self._routes.copy()
    
    async def get_evacuation_route(self, route_id: str) -> Optional[Dict[str, Any]]:
        """Get specific route by ID"""
        for route in self._routes:
            if route["id"] == route_id:
                return route.copy()
        return None
    
    # ==================== Water Level Methods ====================
    
    async def get_water_levels(self) -> List[Dict[str, Any]]:
        """Get current water levels from monitoring stations"""
        # Add some variation for realism
        levels = []
        for station in self._water_levels:
            level = station.copy()
            level["current_level"] = station["current_level"] + np.random.uniform(-0.05, 0.05)
            level["timestamp"] = datetime.now().isoformat()
            levels.append(level)
        return levels
    
    async def get_rainfall_data(self, hours: int) -> List[Dict[str, Any]]:
        """Get rainfall data for past hours"""
        readings = []
        base_time = datetime.now()
        
        for i in range(hours):
            t = base_time - timedelta(hours=hours - i - 1)
            readings.append({
                "timestamp": t.isoformat(),
                "hour": i,
                "amount_mm": max(0, 5 + np.random.uniform(-3, 15)),
                "intensity": "moderate" if np.random.random() > 0.5 else "heavy",
            })
        
        return readings
    
    # ==================== Simulation Methods ====================
    
    async def get_simulation_scenarios(self, status: Optional[str] = None, limit: int = 20) -> List[Dict[str, Any]]:
        """Get simulation scenarios"""
        # Return empty list for now - would query database
        return []
    
    async def get_simulation_scenario(self, scenario_id: str) -> Optional[Dict[str, Any]]:
        """Get specific simulation scenario"""
        return None
    
    async def create_simulation_scenario(self, scenario_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a simulation scenario"""
        return scenario_data
    
    async def get_simulation_timesteps(
        self, scenario_id: str, start_step: int, end_step: Optional[int]
    ) -> List[Dict[str, Any]]:
        """Get simulation timesteps"""
        return []
    
    async def delete_simulation_scenario(self, scenario_id: str) -> bool:
        """Delete a simulation scenario"""
        return True
    
    # ==================== AI Metrics ====================
    
    async def get_ai_metrics(self) -> Dict[str, Any]:
        """Get AI model metrics"""
        return {
            "cyclegan_avg_ms": 35.0,
            "cyclegan_count": 150,
            "cyclegan_confidence": 0.88,
            "gnn_avg_ms": 15.0,
            "gnn_count": 500,
            "rl_avg_ms": 25.0,
            "rl_count": 75,
        }
