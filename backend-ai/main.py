from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import os
from dotenv import load_dotenv

# Import routes
from routes import sar_translation, flood_segmentation, risk_propagation, evacuation_planning

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Klaew Klad AI Service",
    description="AI-powered flood forecasting and evacuation planning using MindSpore",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("static/translated", exist_ok=True)
os.makedirs("static/masks", exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(sar_translation.router, prefix="/api/ai", tags=["SAR Translation"])
app.include_router(flood_segmentation.router, prefix="/api/ai", tags=["Flood Segmentation"])
app.include_router(risk_propagation.router, prefix="/api/ai", tags=["Risk Propagation"])
app.include_router(evacuation_planning.router, prefix="/api/ai", tags=["Evacuation Planning"])


@app.get("/")
async def root():
    return {
        "message": "Klaew Klad AI Service",
        "version": "1.0.0",
        "framework": "FastAPI + MindSpore (mock)",
        "status": "online",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "sar_translation": "operational",
            "flood_segmentation": "operational",
            "gnn_risk_propagation": "operational",
            "rl_evacuation": "operational",
        },
    }


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
    )
