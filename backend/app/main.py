"""
Klaew Klad Backend - FastAPI Application
Satellite-Driven Digital Twin for Dynamic Flood Impact Forecasting
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.api.v1.router import api_router
from app.core.database import init_db
from app.services.websocket_manager import manager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    # Startup
    logger.info("🚀 Starting Klaew Klad Backend...")
    await init_db()
    logger.info("✅ Database initialized")
    logger.info("🗺️ Hat Yai Digital Twin ready")
    
    yield
    
    # Shutdown
    logger.info("👋 Shutting down Klaew Klad Backend...")
    await manager.disconnect_all()


app = FastAPI(
    title="Klaew Klad API",
    description="""
    ## Satellite-Driven Digital Twin for Dynamic Flood Impact Forecasting
    
    ### Core AI Modules:
    - **SAR-to-Optical Translation** (CycleGAN): Cloud-penetrating vision
    - **GNN Risk Propagation**: Infrastructure knowledge graph
    - **RL Evacuation Agent**: Dynamic route optimization
    
    ### Study Area: Hat Yai, Thailand
    """,
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "klaew-klad-backend",
        "version": "1.0.0"
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Klaew Klad - Hat Yai Flood Digital Twin API",
        "docs": "/docs",
        "health": "/health"
    }


@app.websocket("/ws/{channel}")
async def websocket_endpoint(websocket: WebSocket, channel: str):
    """
    WebSocket endpoint for real-time updates.
    
    Channels:
    - flood: Real-time flood zone updates
    - simulation: Simulation progress updates
    - alerts: Critical alerts and warnings
    - dashboard: Dashboard summary updates
    """
    await manager.connect(websocket, channel)
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            # Echo back for ping/pong
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel)
