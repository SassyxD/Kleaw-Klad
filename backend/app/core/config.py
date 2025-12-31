"""
Application Configuration
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # API Settings
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Klaew Klad"
    DEBUG: bool = True
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://klaew-klad.vercel.app",
    ]
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./klaew_klad.db"
    
    # Hat Yai Geographic Bounds
    HAT_YAI_CENTER_LAT: float = 7.0086
    HAT_YAI_CENTER_LON: float = 100.4747
    HAT_YAI_BOUNDS: dict = {
        "north": 7.10,
        "south": 6.90,
        "east": 100.60,
        "west": 100.35
    }
    
    # Sentinel API (for satellite data)
    SENTINEL_USER: str = ""
    SENTINEL_PASSWORD: str = ""
    
    # AI Model Paths
    CYCLEGAN_MODEL_PATH: str = "./models/cyclegan"
    GNN_MODEL_PATH: str = "./models/gnn"
    RL_MODEL_PATH: str = "./models/rl_agent"
    
    # Simulation Settings
    SIMULATION_TIME_STEP_MINUTES: int = 15
    MAX_SIMULATION_HOURS: int = 48
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
