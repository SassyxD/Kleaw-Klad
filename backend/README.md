# Klaew Klad Backend

**Satellite-Driven Digital Twin for Dynamic Flood Impact Forecasting**  
*Huawei ICT Competition 2025-2026 Innovation Track*

## 🌊 Overview

This is the backend API for Klaew Klad, a comprehensive flood monitoring and forecasting system for Hat Yai, Thailand. The system combines satellite imagery analysis with AI-powered risk prediction and evacuation planning.

## 🚀 Key Features

### AI Modules

1. **SAR-to-Optical Translation (CycleGAN)**
   - Converts Sentinel-1 SAR imagery to optical-like images
   - Enables flood detection through cloud cover
   - Cloud-penetrating vision for 24/7 monitoring

2. **GNN Risk Propagation Engine**
   - Infrastructure knowledge graph modeling
   - Flood risk propagation analysis
   - Facility vulnerability assessment

3. **RL Evacuation Agent (PPO)**
   - Dynamic evacuation route optimization
   - Real-time route replanning
   - Population-aware path selection

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/v1/dashboard/summary` | Dashboard overview |
| `/api/v1/flood/zones` | Flood zone data |
| `/api/v1/facilities` | Infrastructure facilities |
| `/api/v1/evacuation/routes` | Evacuation routes |
| `/api/v1/simulation/` | Flood simulation |
| `/api/v1/ai/` | Direct AI model access |

### WebSocket Channels

- `flood`: Real-time flood zone updates
- `simulation`: Simulation progress
- `alerts`: Critical alerts
- `dashboard`: Dashboard updates

## 📦 Installation

### Prerequisites

- Python 3.11+
- pip or conda

### Setup

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker

```bash
docker build -t klaew-klad-backend .
docker run -p 8000:8000 klaew-klad-backend
```

## 🗺️ Study Area

**Hat Yai, Thailand**
- Coordinates: 7.0086°N, 100.4747°E
- Basin: U-Tapao Canal
- Population: ~160,000 (urban area)

### Flood Zones

1. **Klong Hae** - Northwestern residential area
2. **Khohong** - Eastern suburb
3. **Hat Yai Nai CBD** - City center (highest risk)
4. **Khuan Lang** - Northern area
5. **U-Tapao Canal Area** - Primary drainage channel

## 🔧 API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📊 Quick Simulation Example

```python
import httpx

response = httpx.post(
    "http://localhost:8000/api/v1/simulation/quick",
    json={
        "rainfall_mm_per_hour": 80,
        "duration_hours": 12,
        "tide_factor": 1.2
    }
)

result = response.json()
print(f"Severity: {result['summary']['flood_severity']}")
print(f"Affected population: {result['total_affected_population']}")
```

## 🏗️ Architecture

```
backend/
├── app/
│   ├── ai/                 # AI modules
│   │   ├── cyclegan.py     # SAR-to-Optical translation
│   │   ├── gnn_risk.py     # GNN risk propagation
│   │   └── rl_evacuation.py # RL evacuation agent
│   ├── api/v1/             # API endpoints
│   │   └── endpoints/
│   ├── core/               # Configuration
│   ├── models/             # SQLAlchemy models
│   ├── schemas/            # Pydantic schemas
│   └── services/           # Business logic
└── requirements.txt
```

## 🤖 AI Model Details

### CycleGAN SAR-to-Optical

- **Input**: Sentinel-1 SAR (VV, VH polarization)
- **Output**: Pseudo-optical RGB imagery
- **Purpose**: Flood extent detection through clouds

### GNN Risk Propagation

- **Architecture**: GCN + GAT hybrid
- **Nodes**: Flood zones, facilities, road segments
- **Edges**: Drainage connections, road links, elevation gradients

### PPO Evacuation Agent

- **State**: Road network, water levels, population
- **Actions**: Route selection and sequencing
- **Reward**: Minimize evacuation time, maximize safety

## 👥 Team Intervene

*KMITL - Huawei ICT Competition 2025-2026*

## 📄 License

MIT License - See LICENSE file
