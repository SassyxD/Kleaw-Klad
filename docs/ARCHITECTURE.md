# Klaew Klad - System Architecture

## Overview

Klaew Klad is a microservices-based flood forecasting platform with three main components:

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                  (Next.js 15 + TypeScript)                   │
│                                                              │
│  ┌────────────────┐              ┌─────────────────┐        │
│  │ Operator Portal│              │  Client Portal  │        │
│  │  - Dashboard   │              │  - Flood Status │        │
│  │  - Risk Map    │              │  - Evacuation   │        │
│  │  - Controls    │              │  - Alerts       │        │
│  └────────────────┘              └─────────────────┘        │
└──────────────────┬───────────────────────┬──────────────────┘
                   │                       │
                   │   REST/WebSocket      │
                   │                       │
┌──────────────────▼───────────────────────▼──────────────────┐
│              Backend Platform (Bun + Elysia.js)             │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │   User   │  │  Flood   │  │  Alert   │   │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │   │
│  └──────────┘  └──────────┘  └────┬─────┘  └──────────┘   │
└─────────────────────────────────────┼────────────────────────┘
                                      │
                                      │ HTTP/gRPC
                                      │
┌─────────────────────────────────────▼────────────────────────┐
│              Backend AI (Python + FastAPI)                   │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  CycleGAN    │  │     GNN      │  │   RL Agent   │      │
│  │ SAR→Optical  │  │ Risk Cascade │  │  Evacuation  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Segmentation│  │  Time Series │  │    Mock      │      │
│  │  Water Mask  │  │  Forecasting │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

## Components

### 1. Frontend (Next.js 15)

**Technology:**
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS + shadcn/ui
- Mapbox GL JS / Leaflet
- Zustand (state management)
- React Query (data fetching)

**Pages:**
- `/` - Landing page
- `/login` - Unified login
- `/operator/*` - Operator dashboard
- `/client/*` - Public client interface

**Key Features:**
- Real-time flood visualization
- Interactive risk assessment maps
- Mobile-responsive design
- WebSocket support for live updates

### 2. Backend Platform (Bun + Elysia.js)

**Technology:**
- Bun runtime
- Elysia.js framework
- TypeScript
- JWT authentication
- PostgreSQL (future)

**Services:**
- **Auth Service**: User authentication and authorization
- **User Service**: Profile and role management
- **Flood Service**: Orchestrates AI predictions
- **Alert Service**: Push notifications and broadcasts

**API Endpoints:**
```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/user/profile

GET    /api/flood/current-status
GET    /api/flood/forecast
GET    /api/flood/risk-assessment

POST   /api/evacuation/routes
GET    /api/evacuation/shelters

POST   /api/alerts (operator only)
GET    /api/alerts
```

### 3. Backend AI (Python + FastAPI)

**Technology:**
- FastAPI
- Python 3.11+
- MindSpore (production)
- NumPy, Pandas, OpenCV
- Pydantic (validation)

**AI Modules:**

1. **SAR-to-Optical Translation (CycleGAN)**
   - Input: Sentinel-1 SAR imagery
   - Output: Synthetic optical-like images
   - Model: CycleGAN with ResNet generators

2. **Flood Segmentation**
   - Input: Satellite imagery
   - Output: Binary flood mask
   - Model: U-Net or DeepLabV3+

3. **Graph Neural Network**
   - Input: Infrastructure graph + flood mask
   - Output: Node risk scores
   - Model: Graph Convolutional Network

4. **RL Evacuation Planner**
   - Input: Current flood state, destinations
   - Output: Optimal evacuation routes
   - Model: PPO (Proximal Policy Optimization)

**API Endpoints:**
```
POST   /api/ai/sar-translate
POST   /api/ai/flood-segment
POST   /api/ai/risk-propagate
POST   /api/ai/evacuation-plan
GET    /api/ai/health
```

## Data Flow

### 1. Flood Monitoring Flow
```
Satellite Data → SAR Translation → Flood Segmentation →
Risk Propagation → Dashboard Visualization
```

### 2. Evacuation Planning Flow
```
User Request → Current Flood State → RL Agent →
Optimal Routes → Map Display
```

### 3. Alert Broadcasting Flow
```
Operator Trigger → Alert Service → WebSocket →
Client Devices (Push Notification)
```

## Authentication & Authorization

**Roles:**
- `client` - Public users
- `operator` - Emergency management staff
- `admin` - System administrators

**Flow:**
1. User logs in via `/api/auth/login`
2. Backend validates credentials
3. JWT token issued with role claim
4. Frontend stores token and redirects based on role
5. Protected routes check role before access

## Deployment

**Development:**
- Frontend: `localhost:3000`
- Backend Platform: `localhost:3001`
- Backend AI: `localhost:8000`

**Production:**
- Frontend: Vercel / Huawei Cloud
- Backend Platform: Docker + Kubernetes
- Backend AI: Ascend 910 instances (CANN optimized)
- Database: PostgreSQL (managed)
- Cache: Redis
- CDN: CloudFlare

## Scalability Considerations

1. **Horizontal Scaling**: Microservices can scale independently
2. **Caching**: Redis for frequently accessed predictions
3. **CDN**: Static assets and map tiles
4. **Load Balancing**: NGINX or cloud load balancers
5. **Database Optimization**: Read replicas for high-traffic queries

## Security

- JWT with short expiration (15 min access, 7 day refresh)
- HTTPS only
- Rate limiting on API endpoints
- Input validation with Pydantic/Zod
- CORS configuration
- Environment variables for secrets
- Regular security audits

## Future Enhancements

1. **Real-time Sensor Integration**: IoT water level sensors
2. **Mobile Apps**: Native iOS/Android
3. **Multi-language Support**: Thai, English
4. **Historical Analysis**: Trend analysis and reporting
5. **API Marketplace**: Third-party integrations
