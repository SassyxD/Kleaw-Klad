# 🚀 Quick Start Guide - Klaew Klad

Get the Klaew Klad flood forecasting system running in under 5 minutes!

## Prerequisites

Make sure you have these installed:
- ✅ Node.js 20+ ([download](https://nodejs.org/))
- ✅ Bun 1.0+ ([install](https://bun.sh/))
- ✅ Python 3.11+ ([download](https://python.org/))
- ✅ Git ([download](https://git-scm.com/))

## Installation Steps

### 1️⃣ Clone Repository
```bash
git clone <your-repo-url>
cd Kleaw-Klad
```

### 2️⃣ Start Frontend (Terminal 1)
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```
✅ Frontend running at **http://localhost:3000**

### 3️⃣ Start Backend Platform (Terminal 2)
```bash
cd backend-platform
bun install
cp .env.example .env
bun run dev
```
✅ API running at **http://localhost:3001**  
✅ Swagger docs at **http://localhost:3001/swagger**

### 4️⃣ Start AI Service (Terminal 3)
```bash
cd backend-ai
python -m venv venv

# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
python main.py
```
✅ AI API running at **http://localhost:8000**  
✅ API docs at **http://localhost:8000/docs**

## 🎮 Try It Out!

### 1. Visit the Homepage
Open **http://localhost:3000** in your browser

### 2. Login as Operator
- Click **"Operator Dashboard"** or **"Login"**
- Email: `operator@hatyai.gov`
- Password: `password`
- Role: **Operator**

### 3. Explore Operator Dashboard
- View live flood map
- Check risk assessment
- See affected areas
- Review active alerts

### 4. Try Client Portal
- Logout and login as Client
- Email: `client@demo.com`
- Password: `password`
- Role: **Client**

### 5. Test API
Open **http://localhost:3001/swagger** to try:
- `GET /api/flood/current-status` - Current flood data
- `GET /api/flood/risk-assessment` - GNN risk scores
- `GET /api/evacuation/shelters` - Active shelters

### 6. Test AI Service
Open **http://localhost:8000/docs** to try:
- Upload a test image to SAR translation
- Run flood segmentation
- Test risk propagation
- Generate evacuation plan

## 🐳 Docker Quick Start (Alternative)

If you have Docker installed:

```bash
# Build and start all services
docker-compose up

# Access services:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# AI: http://localhost:8000
```

## 📱 Mobile Testing

The app is fully responsive! Test on mobile:
1. Find your computer's local IP (e.g., 192.168.1.100)
2. Update frontend `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://192.168.1.100:3001/api
   ```
3. Access from phone: `http://192.168.1.100:3000`

## 🔍 Verify Installation

Check all services are running:

```bash
# Frontend
curl http://localhost:3000

# Backend Platform
curl http://localhost:3001/health

# AI Service
curl http://localhost:8000/health
```

All should return `200 OK` responses.

## 🎯 Demo Credentials

### Operator (Full Access)
- **Email**: operator@hatyai.gov
- **Password**: password
- **Features**: Dashboard, alerts, risk assessment, evacuation planning

### Client (Public)
- **Email**: client@demo.com
- **Password**: password
- **Features**: Flood status, shelters, evacuation routes, alerts

### Admin (Super User)
- **Email**: admin@hatyai.gov
- **Password**: password
- **Features**: All operator features + user management

## ⚠️ Common Issues

### Port Already in Use
```bash
# Frontend (3000)
# Backend (3001)
# AI (8000)

# Change ports in respective .env files
```

### Bun Not Found
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Or with npm
npm install -g bun
```

### Python Virtual Environment Issues
```bash
# Windows users: Make sure to run as Administrator if activation fails
# Mac/Linux: Check venv permissions

# Alternative: Use conda
conda create -n klaewklad python=3.11
conda activate klaewklad
```

### Module Not Found Errors
```bash
# Ensure you're in the correct directory
# Re-run install commands

# Frontend
cd frontend && npm install

# Backend Platform
cd backend-platform && bun install

# AI Service
cd backend-ai && pip install -r requirements.txt
```

## 🎨 What to Try

1. **Operator Dashboard**
   - View real-time flood statistics
   - Check infrastructure risk scores
   - See which roads are blocked
   - View active shelter status

2. **Client Portal**
   - Find nearest shelter
   - Check current flood level
   - View safe evacuation routes
   - Read safety tips

3. **API Testing**
   - Create custom alerts
   - Query flood forecasts
   - Calculate evacuation routes
   - Test AI endpoints

## 📚 Next Steps

- Read [Architecture Documentation](docs/ARCHITECTURE.md)
- Explore [API Documentation](docs/API.md)
- Check [Deployment Guide](docs/DEPLOYMENT.md)
- Review [Contributing Guidelines](docs/CONTRIBUTING.md)

## 💡 Tips

- Use **Swagger UI** at `/swagger` and `/docs` for interactive API testing
- Mock data refreshes every time you restart the backend
- Frontend auto-reloads when you edit files
- Check browser console for any errors

## 🆘 Get Help

- Check logs in each terminal
- Review error messages carefully
- Search documentation
- File an issue on GitHub

## 🎉 You're Ready!

The Klaew Klad flood forecasting system is now running locally. Explore the features, test the APIs, and see how AI can help save lives during floods!

---

**Built with ❤️ for Huawei MindSpore AI Innovation Competition**
