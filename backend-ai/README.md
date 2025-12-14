# Klaew Klad AI Service

Python FastAPI backend for AI-powered flood forecasting and evacuation planning.

## Features

- SAR-to-Optical Translation (CycleGAN)
- Flood Segmentation (U-Net)
- Risk Propagation (Graph Neural Network)
- Evacuation Planning (Reinforcement Learning - PPO)
- MindSpore Integration (mock for development)

## Getting Started

### Prerequisites

- Python 3.11+
- pip or conda

### Installation

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

### Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Development

```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --port 8000
```

The AI service will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### SAR Translation
- `POST /api/ai/sar-translate` - Translate SAR to optical-like image

### Flood Segmentation
- `POST /api/ai/flood-segment` - Segment flood areas

### Risk Propagation
- `POST /api/ai/risk-propagate` - Calculate infrastructure risk (GNN)

### Evacuation Planning
- `POST /api/ai/evacuation-plan` - Generate evacuation plan (RL)

## Production Deployment

For production, replace mock implementations with:

1. **MindSpore Models**: Train and deploy real CycleGAN, U-Net, GCN, and PPO models
2. **CANN Optimization**: Leverage Ascend 910 acceleration
3. **ModelArts Integration**: Use Huawei ModelArts for training
4. **Caching**: Implement Redis for frequently accessed predictions
5. **Batch Processing**: Queue system for bulk image processing

## Model Architecture

### CycleGAN (SAR Translation)
- Generator: ResNet-based
- Input: Sentinel-1 SAR
- Output: Synthetic optical imagery
- Target SSIM: >0.85

### U-Net (Flood Segmentation)
- Encoder-Decoder architecture
- Input: Satellite imagery (RGB)
- Output: Binary flood mask
- Target IoU: >0.90

### GCN (Risk Propagation)
- Graph Convolutional Network
- Input: Infrastructure graph + flood mask
- Output: Node risk scores + cascade events
- Layers: 3-layer GCN

### PPO (Evacuation Planning)
- Proximal Policy Optimization
- State: Flood map + vehicle positions
- Action: Route selection
- Reward: Evacuated population / time
