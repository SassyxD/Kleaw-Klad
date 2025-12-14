# Klaew Klad - Satellite-Driven Digital Twin for Dynamic Flood Impact Forecasting

> Strategic Evacuation System for Hat Yai, Thailand

##  Overview

Klaew Klad is an AI-powered flood forecasting and evacuation platform that combines satellite imagery, graph neural networks, and reinforcement learning to provide real-time flood risk assessment and strategic evacuation planning for Hat Yai city.

### Key Features

- **Cloud-Penetrating Vision**: SAR-to-optical image translation using CycleGAN
- **Risk Propagation**: Graph Neural Network-based infrastructure risk assessment
- **Smart Evacuation**: RL-based dynamic evacuation route optimization
- **Digital Twin**: Real-time urban flood simulation and visualization
- **Dual Interface**: Separate portals for emergency operators and citizens

##  Architecture

```
klaew-klad/
├── frontend/              # Next.js 15 web application
├── backend-platform/      # Bun + Elysia.js API server
├── backend-ai/           # Python FastAPI AI services
└── docs/                 # Documentation
```

##  Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL JS
- **State**: Zustand
- **Auth**: NextAuth.js

### Backend Platform
- **Runtime**: Bun
- **Framework**: Elysia.js
- **Language**: TypeScript
- **Auth**: JWT

### Backend AI
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **AI/ML**: MindSpore (production), scikit-learn (mock)
- **Computer Vision**: OpenCV, PIL

##  Installation

### Prerequisites
- Node.js 20+
- Bun 1.0+
- Python 3.11+
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/SassyxD/Kleaw_Klad
cd Kleaw-Klad
```

2. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

3. **Backend Platform Setup**
```bash
cd backend-platform
bun install
cp .env.example .env
bun run dev
```

4. **Backend AI Setup**
```bash
cd backend-ai
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

##  Development

- **Frontend**: http://localhost:3000
- **Backend Platform**: http://localhost:3001
- **Backend AI**: http://localhost:8000

##  User Roles

### Operator (Emergency Management)
- Real-time flood monitoring dashboard
- Infrastructure risk assessment
- Evacuation route planning
- Alert broadcasting

### Client (Citizens)
- Current flood status
- Evacuation routes
- Shelter locations
- Safety alerts

##  Mobile Support

The platform is fully responsive and optimized for mobile devices, ensuring accessibility for citizens during emergencies.

##  Authentication

Role-based access control with JWT:
- **Operators**: Full dashboard access with advanced controls
- **Clients**: Public information and personalized alerts

##  Contributing

Please follow conventional commits for all contributions:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Testing updates
- `chore:` Maintenance tasks

##  License

MIT License

##  Acknowledgments

Powered by Huawei MindSpore, ModelArts, and CANN for AI acceleration.
