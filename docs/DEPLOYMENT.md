# Deployment Guide - Klaew Klad

## Development Deployment

### Prerequisites
- Node.js 20+
- Bun 1.0+
- Python 3.11+
- Git

### Quick Start

1. **Clone Repository**
```bash
git clone <repository-url>
cd Kleaw-Klad
```

2. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```
Access at: http://localhost:3000

3. **Backend Platform Setup**
```bash
cd backend-platform
bun install
cp .env.example .env
# Edit .env with your JWT secret
bun run dev
```
Access at: http://localhost:3001
Swagger Docs: http://localhost:3001/swagger

4. **Backend AI Setup**
```bash
cd backend-ai
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python main.py
```
Access at: http://localhost:8000
API Docs: http://localhost:8000/docs

---

## Production Deployment

### Option 1: Docker Compose (Recommended)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend-platform:3001/api
      - NEXT_PUBLIC_AI_API_URL=http://backend-ai:8000/api/ai
    depends_on:
      - backend-platform
      - backend-ai

  backend-platform:
    build: ./backend-platform
    ports:
      - "3001:3001"
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - AI_SERVICE_URL=http://backend-ai:8000/api/ai
    depends_on:
      - backend-ai

  backend-ai:
    build: ./backend-ai
    ports:
      - "8000:8000"
    volumes:
      - ./data:/app/data
```

Deploy:
```bash
docker-compose up -d
```

### Option 2: Huawei Cloud

#### Frontend (Vercel/CloudFlare Pages)
```bash
cd frontend
npm run build
# Deploy build output to Vercel or CloudFlare Pages
```

#### Backend Platform (CCE - Cloud Container Engine)
```bash
cd backend-platform
# Build Docker image
docker build -t klaew-klad-platform .
# Push to SWR (Software Repository for Container)
docker tag klaew-klad-platform swr.ap-southeast-3.myhuaweicloud.com/klaew-klad/platform:latest
docker push swr.ap-southeast-3.myhuaweicloud.com/klaew-klad/platform:latest
# Deploy to CCE via kubectl or console
```

#### Backend AI (ModelArts + Ascend 910)
```bash
cd backend-ai
# Package MindSpore models
# Deploy to ModelArts inference endpoint
# Configure CANN for Ascend acceleration
```

### Option 3: Kubernetes

1. **Build Images**
```bash
docker build -t klaew-klad/frontend:latest ./frontend
docker build -t klaew-klad/platform:latest ./backend-platform
docker build -t klaew-klad/ai:latest ./backend-ai
```

2. **Apply Manifests**
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployments.yaml
kubectl apply -f k8s/services.yaml
kubectl apply -f k8s/ingress.yaml
```

---

## Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://api.klaewklad.com/api
NEXT_PUBLIC_AI_API_URL=https://ai.klaewklad.com/api/ai
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token
NEXT_PUBLIC_WS_URL=wss://api.klaewklad.com
NEXTAUTH_SECRET=your_nextauth_secret_minimum_32_characters
NEXTAUTH_URL=https://klaewklad.com
```

### Backend Platform (.env)
```bash
PORT=3001
JWT_SECRET=production_secret_key_minimum_32_characters_use_strong_random
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
AI_SERVICE_URL=http://backend-ai:8000/api/ai
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/klaewklad
REDIS_URL=redis://host:6379
```

### Backend AI (.env)
```bash
PORT=8000
ENVIRONMENT=production
API_V1_PREFIX=/api/ai
UPLOAD_DIR=/data/uploads
STATIC_DIR=/data/static
MINDSPORE_DEVICE=Ascend
CANN_OPTIMIZATION=true
MODEL_PATH=/models
```

---

## Database Setup (Production)

### PostgreSQL Schema
```sql
CREATE DATABASE klaewklad;

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    severity VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    areas JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
```

---

## Monitoring & Logging

### Application Performance Monitoring (APM)
- Use Huawei APM or Datadog
- Track API response times
- Monitor AI model inference latency
- Alert on error rates

### Logging
```bash
# Frontend: Vercel logs or CloudWatch
# Backend: ELK Stack or Huawei LTS
# AI Service: ModelArts logs
```

### Health Checks
- Frontend: `/api/health`
- Backend Platform: `GET /health`
- Backend AI: `GET /health`

---

## Scaling Strategy

### Horizontal Scaling
- **Frontend**: CDN + multiple edge nodes
- **Backend Platform**: Load balancer + 3+ instances
- **Backend AI**: GPU/Ascend pod auto-scaling

### Caching
- **Redis**: Cache flood status, forecasts, risk assessments
- **CDN**: Cache static assets, translated images, flood masks

### Database
- Read replicas for high-traffic queries
- Connection pooling
- Query optimization

---

## Security Checklist

- [ ] JWT secrets rotated regularly
- [ ] HTTPS/TLS enabled (Let's Encrypt or ACM)
- [ ] CORS properly configured
- [ ] Rate limiting enabled (10 req/sec per IP)
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (CSP headers)
- [ ] Environment variables secured (Vault/Secrets Manager)
- [ ] API authentication for operator endpoints
- [ ] File upload validation (type, size limits)
- [ ] Regular security audits

---

## Backup & Disaster Recovery

### Database Backups
- Daily automated backups to Object Storage (OBS)
- Point-in-time recovery enabled
- Retention: 30 days

### AI Models
- Version control in OBS
- Rollback capability for models
- A/B testing for new models

### Disaster Recovery Plan
- Multi-region deployment (active-passive)
- RPO: 1 hour
- RTO: 4 hours

---

## Performance Targets

- **Frontend**: First Contentful Paint < 1.5s
- **API Response Time**: p95 < 200ms
- **AI Inference**: SAR translation < 35s per 50km²
- **Uptime**: 99.9% SLA

---

## Post-Deployment Verification

```bash
# Check all services
curl http://localhost:3000/
curl http://localhost:3001/health
curl http://localhost:8000/health

# Test authentication
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"operator@hatyai.gov","password":"password","role":"operator"}'

# Test flood API
curl http://localhost:3001/api/flood/current-status

# Test AI service
curl -X POST http://localhost:8000/api/ai/sar-translate \
  -F "image=@test.jpg"
```

---

## Support & Maintenance

- Monitor logs daily
- Review error rates weekly
- Update dependencies monthly
- Security patches: within 48 hours
- Model retraining: quarterly (or after major floods)
