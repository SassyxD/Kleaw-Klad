# API Documentation

## Backend Platform API (Bun + Elysia.js)

Base URL: `http://localhost:3001/api`

### Authentication

#### POST /auth/login
Login with credentials.

**Request:**
```json
{
  "email": "operator@hatyai.gov",
  "password": "secure_password",
  "role": "operator" // or "client"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "refreshToken": "refresh...",
    "user": {
      "id": "uuid",
      "email": "operator@hatyai.gov",
      "role": "operator",
      "name": "John Doe"
    }
  }
}
```

#### POST /auth/refresh
Refresh access token.

**Headers:**
```
Authorization: Bearer <refreshToken>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_access_token"
  }
}
```

### Flood Status

#### GET /flood/current-status
Get current flood situation.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2025-12-15T10:30:00Z",
    "severity": "high",
    "affectedAreas": [
      {
        "id": "area_1",
        "name": "U-Tapao Canal Zone",
        "waterLevel": 2.5,
        "status": "flooding",
        "population": 15000
      }
    ],
    "statistics": {
      "totalAffected": 45000,
      "roadsClosed": 23,
      "sheltersActive": 8
    }
  }
}
```

#### GET /flood/forecast
Get flood forecast for next 24-72 hours.

**Query Parameters:**
- `hours`: Forecast horizon (default: 24)

**Response:**
```json
{
  "success": true,
  "data": {
    "forecasts": [
      {
        "timestamp": "2025-12-15T12:00:00Z",
        "severity": "medium",
        "waterLevel": 2.1,
        "confidence": 0.87
      }
    ]
  }
}
```

#### GET /flood/risk-assessment
Get infrastructure risk assessment from GNN.

**Response:**
```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "hospital_1",
        "name": "Hat Yai Hospital",
        "type": "hospital",
        "riskScore": 0.75,
        "status": "at-risk",
        "timeToIsolation": 90,
        "coordinates": [7.0089, 100.4747]
      }
    ],
    "edges": [
      {
        "from": "node_1",
        "to": "node_2",
        "status": "passable",
        "waterDepth": 0.3
      }
    ]
  }
}
```

### Evacuation

#### POST /evacuation/routes
Calculate optimal evacuation routes.

**Request:**
```json
{
  "origin": {
    "lat": 7.0089,
    "lng": 100.4747
  },
  "destinations": [
    {
      "id": "shelter_1",
      "lat": 7.0234,
      "lng": 100.4901
    }
  ],
  "priority": "fastest" // or "safest"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "routes": [
      {
        "id": "route_1",
        "destination": "shelter_1",
        "distance": 3.2,
        "duration": 12,
        "safetyScore": 0.89,
        "waypoints": [
          [7.0089, 100.4747],
          [7.0102, 100.4768]
        ]
      }
    ]
  }
}
```

#### GET /evacuation/shelters
Get list of active shelters.

**Response:**
```json
{
  "success": true,
  "data": {
    "shelters": [
      {
        "id": "shelter_1",
        "name": "Prince of Songkla University Gym",
        "capacity": 500,
        "currentOccupancy": 234,
        "status": "open",
        "coordinates": [7.0234, 100.4901],
        "facilities": ["medical", "food", "power"]
      }
    ]
  }
}
```

### Alerts (Operator Only)

#### POST /alerts
Broadcast alert to clients.

**Request:**
```json
{
  "severity": "critical",
  "title": "Flash Flood Warning",
  "message": "U-Tapao Canal overflowing. Evacuate Zone A immediately.",
  "areas": ["zone_a", "zone_b"],
  "expiry": "2025-12-15T18:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "alertId": "alert_123",
    "sentTo": 15000,
    "timestamp": "2025-12-15T10:35:00Z"
  }
}
```

#### GET /alerts
Get active alerts.

**Response:**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "alert_123",
        "severity": "critical",
        "title": "Flash Flood Warning",
        "message": "...",
        "timestamp": "2025-12-15T10:35:00Z",
        "expiry": "2025-12-15T18:00:00Z"
      }
    ]
  }
}
```

---

## Backend AI API (Python + FastAPI)

Base URL: `http://localhost:8000/api/ai`

### SAR Translation

#### POST /sar-translate
Translate SAR imagery to optical-like image.

**Request (multipart/form-data):**
```
image: <SAR_image.tif>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "/static/translated/uuid.png",
    "ssim": 0.88,
    "processingTime": 1.2
  }
}
```

### Flood Segmentation

#### POST /flood-segment
Segment flood areas from satellite imagery.

**Request:**
```json
{
  "imageUrl": "https://...",
  "threshold": 0.5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "maskUrl": "/static/masks/uuid.png",
    "floodArea": 12.5,
    "iou": 0.925,
    "affectedBuildings": 340
  }
}
```

### Risk Propagation

#### POST /risk-propagate
Calculate infrastructure risk using GNN.

**Request:**
```json
{
  "floodMask": [...],
  "graph": {
    "nodes": [...],
    "edges": [...]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "riskScores": {
      "hospital_1": 0.75,
      "power_1": 0.45
    },
    "cascadeEvents": [
      {
        "node": "road_5",
        "time": 45,
        "impact": "isolates hospital_1"
      }
    ]
  }
}
```

### Evacuation Planning

#### POST /evacuation-plan
Generate optimal evacuation plan using RL.

**Request:**
```json
{
  "floodState": {...},
  "origins": [...],
  "shelters": [...],
  "vehicles": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "vehicle": 1,
        "route": [...],
        "pickups": 45,
        "duration": 18
      }
    ],
    "totalEvacuated": 450,
    "averageTime": 15.3
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "FLOOD_001",
    "message": "Unable to process flood data",
    "details": "..."
  }
}
```

**Common Error Codes:**
- `AUTH_001` - Invalid credentials
- `AUTH_002` - Token expired
- `AUTH_003` - Insufficient permissions
- `FLOOD_001` - Data processing error
- `AI_001` - Model inference failed
- `RATE_001` - Rate limit exceeded
