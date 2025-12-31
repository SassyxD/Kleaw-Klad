"""
WebSocket Manager for Real-time Updates
Handles live flood simulation updates, alerts, and dashboard synchronization
"""

from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List, Set, Any, Optional
from datetime import datetime
import asyncio
import json
from loguru import logger


class ConnectionManager:
    """
    Manages WebSocket connections for real-time updates.
    Supports multiple channels for different data streams.
    """
    
    def __init__(self):
        # Active connections by channel
        self.active_connections: Dict[str, List[WebSocket]] = {
            "flood": [],
            "simulation": [],
            "alerts": [],
            "dashboard": [],
        }
        # All connections
        self.all_connections: Set[WebSocket] = set()
    
    async def connect(self, websocket: WebSocket, channel: str = "dashboard"):
        """Accept and register a new WebSocket connection"""
        await websocket.accept()
        self.all_connections.add(websocket)
        
        if channel not in self.active_connections:
            self.active_connections[channel] = []
        self.active_connections[channel].append(websocket)
        
        logger.info(f"WebSocket connected to channel: {channel}")
        
        # Send welcome message
        await websocket.send_json({
            "type": "connection",
            "status": "connected",
            "channel": channel,
            "timestamp": datetime.now().isoformat(),
        })
    
    def disconnect(self, websocket: WebSocket, channel: str = "dashboard"):
        """Remove a WebSocket connection"""
        self.all_connections.discard(websocket)
        
        if channel in self.active_connections:
            if websocket in self.active_connections[channel]:
                self.active_connections[channel].remove(websocket)
        
        logger.info(f"WebSocket disconnected from channel: {channel}")
    
    async def disconnect_all(self):
        """Disconnect all WebSocket connections"""
        for websocket in list(self.all_connections):
            try:
                await websocket.close()
            except Exception:
                pass
        
        self.all_connections.clear()
        for channel in self.active_connections:
            self.active_connections[channel].clear()
    
    async def send_personal_message(self, message: Dict[str, Any], websocket: WebSocket):
        """Send a message to a specific WebSocket"""
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Failed to send message: {e}")
    
    async def broadcast(self, message: Dict[str, Any], channel: str = "dashboard"):
        """Broadcast message to all connections in a channel"""
        if channel not in self.active_connections:
            return
        
        disconnected = []
        for connection in self.active_connections[channel]:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.warning(f"Failed to broadcast to connection: {e}")
                disconnected.append(connection)
        
        # Clean up disconnected sockets
        for connection in disconnected:
            self.disconnect(connection, channel)
    
    async def broadcast_all(self, message: Dict[str, Any]):
        """Broadcast to all connected clients regardless of channel"""
        disconnected = []
        for connection in self.all_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)
        
        for connection in disconnected:
            self.all_connections.discard(connection)


# Singleton instance
manager = ConnectionManager()


class FloodUpdateBroadcaster:
    """
    Broadcasts flood state updates to connected clients.
    Used during simulations and real-time monitoring.
    """
    
    def __init__(self, connection_manager: ConnectionManager):
        self.manager = connection_manager
        self.is_broadcasting = False
        self.broadcast_interval = 5.0  # seconds
    
    async def broadcast_flood_update(
        self,
        flood_zones: List[Dict[str, Any]],
        facilities: Optional[List[Dict[str, Any]]] = None,
        routes: Optional[List[Dict[str, Any]]] = None,
    ):
        """Broadcast current flood state"""
        message = {
            "type": "flood_update",
            "timestamp": datetime.now().isoformat(),
            "data": {
                "zones": [
                    {
                        "id": z["id"],
                        "depth": z.get("current_depth", 0),
                        "risk_score": z.get("risk_score", 0),
                        "depth_category": z.get("depth_category", "none"),
                    }
                    for z in flood_zones
                ],
            },
        }
        
        if facilities:
            message["data"]["facilities"] = [
                {
                    "id": f["id"],
                    "status": f.get("status", "normal"),
                    "risk_score": f.get("risk_score", 0),
                }
                for f in facilities if f.get("status") != "normal"
            ]
        
        if routes:
            message["data"]["routes"] = [
                {
                    "id": r["id"],
                    "status": r.get("status", "open"),
                    "water_depth": r.get("current_water_depth", 0),
                }
                for r in routes if r.get("status") != "open"
            ]
        
        await self.manager.broadcast(message, "flood")
        await self.manager.broadcast(message, "dashboard")
    
    async def broadcast_alert(
        self,
        alert_type: str,
        severity: str,
        message: str,
        data: Optional[Dict[str, Any]] = None,
    ):
        """Broadcast an alert to all alert subscribers"""
        alert = {
            "type": "alert",
            "timestamp": datetime.now().isoformat(),
            "alert": {
                "type": alert_type,
                "severity": severity,
                "message": message,
                "data": data or {},
            },
        }
        
        await self.manager.broadcast(alert, "alerts")
        await self.manager.broadcast(alert, "dashboard")
    
    async def broadcast_simulation_progress(
        self,
        scenario_id: str,
        progress: float,
        current_step: int,
        total_steps: int,
        current_data: Optional[Dict[str, Any]] = None,
    ):
        """Broadcast simulation progress updates"""
        message = {
            "type": "simulation_progress",
            "timestamp": datetime.now().isoformat(),
            "scenario_id": scenario_id,
            "progress": {
                "percent": progress,
                "current_step": current_step,
                "total_steps": total_steps,
            },
            "data": current_data or {},
        }
        
        await self.manager.broadcast(message, "simulation")
        await self.manager.broadcast(message, "dashboard")


# Create broadcaster instance
broadcaster = FloodUpdateBroadcaster(manager)


# WebSocket endpoint handler
async def websocket_endpoint(websocket: WebSocket, channel: str = "dashboard"):
    """
    WebSocket endpoint handler for real-time updates.
    
    Channels:
    - dashboard: All updates (flood, simulation, alerts)
    - flood: Flood zone updates only
    - simulation: Simulation progress updates
    - alerts: Alert notifications only
    """
    await manager.connect(websocket, channel)
    
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            
            try:
                message = json.loads(data)
                
                # Handle client messages
                if message.get("type") == "ping":
                    await manager.send_personal_message(
                        {"type": "pong", "timestamp": datetime.now().isoformat()},
                        websocket,
                    )
                elif message.get("type") == "subscribe":
                    new_channel = message.get("channel", "dashboard")
                    if new_channel in manager.active_connections:
                        manager.disconnect(websocket, channel)
                        await manager.connect(websocket, new_channel)
                        
            except json.JSONDecodeError:
                logger.warning(f"Invalid JSON received: {data}")
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket, channel)
