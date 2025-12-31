# Klaew Klad - Component Architecture & UI Specifications

## System Overview
A Digital Twin Flood Warning System inspired by GISTDA's platform, powered by Huawei MindSpore AI models.

---

## 🎯 User Flow Architecture

```
┌─────────────┐
│   Landing   │ (Login/Auth)
│    Page     │
└──────┬──────┘
       │
       ├─────────────┬─────────────┐
       │             │             │
┌──────▼──────┐  ┌──▼────────┐  ┌─▼────────┐
│  Page A:    │  │  Page B:  │  │  Admin   │
│  Executive  │  │ Operation │  │  Panel   │
│  Dashboard  │  │    Map    │  │          │
└─────────────┘  └───────────┘  └──────────┘
```

---

## 📊 Page A: Executive Dashboard (Summary View)

### Design Philosophy
- **Inspiration**: GISTDA Summary Dashboard (Clean, Data-Dense, Government-Grade)
- **Color Palette**: White background, Blue accents (#0066CC), Status-driven colors
- **Typography**: Inter/Noto Sans Thai for bilingual support

### Component Tree

```
ExecutiveDashboard
├── GlobalNavigationBar
│   ├── BrandLogo
│   ├── NavigationTabs
│   │   ├── OverviewTab (Active)
│   │   ├── FloodAnalysisTab
│   │   ├── EvacuationStatusTab
│   │   └── SensorHealthTab
│   └── ActionButton ("Go to Map Operation")
│
├── StatusCardsRow
│   ├── SystemStatusCard (Normal/Alert/Critical)
│   ├── PredictionCard (24h Rainfall Forecast)
│   └── ImpactCard (People at Risk)
│
├── MainContentGrid
│   ├── LeftColumn
│   │   ├── WaterLevelForecastChart
│   │   │   └── LineChart (Past 24h + Predicted 24h)
│   │   └── DistrictRiskAssessmentChart
│   │       └── DonutChart (Safe vs At Risk)
│   │
│   └── RightColumn
│       ├── RiskHeatmapPreview
│       │   └── StaticMapGL (Click → Page B)
│       └── AIInsightsPanel
│           └── RecommendationTicker
│
└── FooterMetrics
    └── LiveDataTimestamp
```

### Key Components Specification

#### 1. StatusCardsRow
```tsx
Component: StatusCard
Props:
  - status: 'normal' | 'alert' | 'critical'
  - title: string
  - value: string | number
  - icon: ReactNode
  - trend?: { value: number, direction: 'up' | 'down' }

Design:
  - Glass morphism card with backdrop-blur-lg
  - Dynamic border color based on status:
    • Normal: border-green-400
    • Alert: border-yellow-400
    • Critical: border-red-500 (with pulse animation)
  - Shadow: shadow-xl with colored glow
  - Padding: p-6
  - Rounded: rounded-2xl
```

#### 2. WaterLevelForecastChart
```tsx
Component: WaterLevelForecastChart
Library: Recharts / Victory Charts
Features:
  - Dual-axis line chart
  - Historical data (solid line, blue)
  - Predicted data (dashed line, orange)
  - Threshold line (critical level, red)
  - Tooltips with timestamp + value
  - Responsive aspect ratio 16:9
```

#### 3. AIInsightsPanel
```tsx
Component: AIInsightsPanel
Features:
  - Auto-scrolling ticker (CSS animation)
  - Icon: Sparkle/AI badge (Huawei branding opportunity)
  - Background: gradient from blue-50 to purple-50
  - Text: font-medium text-gray-800
  - Border: border-l-4 border-purple-500
```

---

## 🗺️ Page B: Operation Map (Real-time Analysis)

### Design Philosophy
- **Inspiration**: GISTDA Map Interface (Full-screen, Floating Panels, Dark/Satellite theme)
- **Map Engine**: MapLibre GL JS (Open-source, performant)
- **Layer Strategy**: SAR → CycleGAN → GNN Risk → Evacuation Routes

### Component Tree

```
OperationMapView
├── MapCanvas (MapLibre GL)
│   ├── BaseLayer (Grayscale Terrain)
│   ├── SARLayer (Sentinel-1 Raw)
│   ├── OpticalLayer (CycleGAN De-clouded) [Toggle]
│   ├── FloodExtentLayer (GeoJSON Polygons)
│   ├── RiskHeatmapLayer (GNN Output)
│   └── EvacuationRoutesLayer (Animated Polylines)
│
├── LeftFloatingSidebar
│   ├── TabNavigation
│   │   ├── MonitorTab
│   │   └── SimulationTab (Active)
│   │
│   ├── MonitorPanel
│   │   └── FloodedDistrictsList
│   │       └── DistrictCard × N
│   │
│   └── SimulationPanel
│       ├── TimeTravelSlider ⭐ (KEY COMPONENT)
│       ├── PredictionVisualization
│       └── ImpactSummary
│
├── RightFloatingToolbar
│   ├── ZoomControls
│   ├── LayerToggle
│   ├── MyLocationButton
│   └── AIDeCloudToggle (Eye Icon)
│
├── BottomInteractionPanel (Retractable)
│   └── EvacuationPlanner
│       ├── RouteInput (From/To)
│       ├── RouteRecommendation (AI-verified)
│       └── AlternativeRoutesList
│
└── TopNotificationBar
    └── LiveAlerts (Slide-in notifications)
```

### ⭐ KEY COMPONENT: Time-Travel Slider

#### Visual Design
```
┌─────────────────────────────────────────────────┐
│  Flood Forecast Timeline                        │
│  ━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  -3h    -2h  -1h  NOW  +1h  +2h  +3h            │
│                                                  │
│  🌊 Water Level: 2.3m → 3.1m (in 2 hours)       │
│  📍 Current View: +2 hours from now             │
└─────────────────────────────────────────────────┘
```

#### Technical Specification
```tsx
Component: TimeTravelSlider
State Management: Zustand store
API Integration: /api/map/prediction?timeOffset={value}

Props:
  - range: { min: -180, max: 180 } // minutes
  - step: 30 // 30-minute intervals
  - currentTime: number
  - onTimeChange: (offset: number) => void

Features:
  1. Real-time marker ("NOW") fixed at center
  2. Color-coded track:
     - Past (left): bg-gray-400
     - Future (right): bg-gradient-to-r from-blue-400 to-purple-500
  3. Thumb tooltip showing absolute timestamp
  4. Play/Pause animation button
  5. Speed control (1x, 2x, 4x)
  6. Bookmark critical moments (e.g., "Peak flood at +2h15m")
```

---

## 🎨 Design System

### Color Palette
```scss
// Status Colors
$safe: #10B981 (green-500)
$warning: #F59E0B (yellow-500)
$danger: #EF4444 (red-500)
$critical: #DC2626 (red-600)

// Brand Colors
$primary: #0066CC (Huawei Blue)
$secondary: #8B5CF6 (purple-500)
$accent: #06B6D4 (cyan-500)

// Map Layers
$sar-overlay: rgba(99, 102, 241, 0.6) // Indigo
$optical-overlay: rgba(34, 197, 94, 0.5) // Green
$flood-extent: rgba(239, 68, 68, 0.7) // Red
$evacuation-route-safe: #10B981
$evacuation-route-danger: #EF4444
```

### Typography
```css
/* Headings */
h1: font-size: 2.5rem, font-weight: 700, line-height: 1.2
h2: font-size: 2rem, font-weight: 600
h3: font-size: 1.5rem, font-weight: 600

/* Body */
body: font-size: 1rem, font-weight: 400, line-height: 1.5

/* Font Stack */
font-family: 'Inter', 'Noto Sans Thai', system-ui, sans-serif
```

### Spacing System (Tailwind)
```
Base unit: 4px (0.25rem)
Scale: 0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64
```

---

## 🧩 State Management (Zustand)

### Store Architecture

```typescript
// stores/map-store.ts
interface MapStore {
  // Time Travel
  timeOffset: number; // minutes from now (-180 to +180)
  isPlaying: boolean;
  playbackSpeed: 1 | 2 | 4;

  // Layers
  visibleLayers: Set<LayerType>;
  activeBaseMap: 'satellite' | 'terrain' | 'grayscale';

  // Map State
  viewport: {
    longitude: number;
    latitude: number;
    zoom: number;
    bearing: number;
    pitch: number;
  };

  // Actions
  setTimeOffset: (offset: number) => void;
  togglePlayback: () => void;
  setPlaybackSpeed: (speed: 1 | 2 | 4) => void;
  toggleLayer: (layer: LayerType) => void;
  updateViewport: (viewport: Partial<Viewport>) => void;
}

// stores/dashboard-store.ts
interface DashboardStore {
  // Metrics
  systemStatus: 'normal' | 'alert' | 'critical';
  predictedRainfall: number;
  peopleAtRisk: number;

  // Data
  waterLevelForecast: TimeSeriesData[];
  districtRisks: DistrictRisk[];
  aiRecommendations: Recommendation[];

  // Actions
  fetchDashboardData: () => Promise<void>;
  subscribeToRealtime: () => void;
}
```

---

## 🔌 API Integration Strategy

### Endpoints

```typescript
// Dashboard APIs
GET /api/dashboard/stats
Response: {
  systemStatus: 'normal' | 'alert' | 'critical',
  predictions: {
    rainfall24h: number,
    peakTime: string,
    confidence: number
  },
  impact: {
    peopleAtRisk: number,
    buildingsAffected: number,
    roadsBlocked: number
  }
}

GET /api/dashboard/forecast
Response: {
  waterLevels: Array<{
    timestamp: string,
    actual?: number,
    predicted: number,
    confidence: number
  }>,
  criticalThreshold: number
}

// Map APIs
GET /api/map/prediction?timeOffset=+120
Response: {
  type: 'FeatureCollection',
  features: Array<{
    type: 'Feature',
    geometry: { ... },
    properties: {
      depth: number,
      riskLevel: 'low' | 'medium' | 'high' | 'critical',
      affectedAssets: string[]
    }
  }>,
  metadata: {
    generatedAt: string,
    modelVersion: string,
    confidence: number
  }
}

GET /api/map/layers/sar?bbox={bounds}
Response: {
  tileUrl: string,
  metadata: { ... }
}

GET /api/map/layers/cycleGAN?bbox={bounds}
Response: {
  tileUrl: string,
  metadata: { ... }
}

POST /api/evacuation/route
Request: {
  from: { lat: number, lng: number },
  to: { lat: number, lng: number },
  timeOffset: number,
  constraints: {
    maxDepth: number,
    avoidHighways: boolean
  }
}
Response: {
  routes: Array<{
    geometry: LineString,
    distance: number,
    duration: number,
    safetyScore: number,
    warnings: string[]
  }>
}
```

---

## 📱 Responsive Design Strategy

### Breakpoints
```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Ultra-wide
}
```

### Layout Adaptations

#### Page A (Dashboard)
- **Desktop (>1024px)**: 2-column grid
- **Tablet (768-1024px)**: 2-column grid, smaller cards
- **Mobile (<768px)**: Single column, stacked cards

#### Page B (Map)
- **Desktop**: Floating sidebars + full map
- **Tablet**: Left sidebar collapsible, map dominates
- **Mobile**: Bottom sheet UI, full-screen map

---

## 🚀 Performance Optimization

### Code Splitting
```typescript
// Dynamic imports for heavy components
const OperationMap = dynamic(() => import('@/components/OperationMap'), {
  loading: () => <MapSkeleton />,
  ssr: false
});

const ChartBundle = dynamic(() => import('@/components/charts'), {
  loading: () => <ChartSkeleton />
});
```

### Map Optimization
- Vector tiles for base layers
- Raster tiles for AI outputs (SAR, CycleGAN)
- GeoJSON simplification for large polygons
- Debounced viewport updates
- Progressive rendering for time-slider changes

### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/satellite-preview.jpg"
  width={800}
  height={600}
  placeholder="blur"
  priority
  alt="Flood risk heatmap"
/>
```

---

## 🔐 Security Considerations

1. **Authentication**: JWT tokens with refresh mechanism
2. **API Rate Limiting**: 100 req/min for map tiles, 10 req/min for predictions
3. **CORS**: Whitelist only production domains
4. **Input Validation**: Zod schemas for all API inputs
5. **XSS Protection**: DOMPurify for AI-generated text recommendations

---

## 📊 Analytics & Monitoring

### Key Metrics to Track
1. **User Engagement**
   - Time spent on Dashboard vs Map
   - Time-slider usage frequency
   - Layer toggle interactions

2. **Performance**
   - Map load time (Target: <2s)
   - Time-to-interactive (Target: <3s)
   - API response times (Target: <500ms)

3. **AI Model Usage**
   - CycleGAN de-cloud requests
   - GNN risk propagation queries
   - Evacuation route calculations

### Implementation
```typescript
// lib/analytics.ts
export const trackEvent = (event: string, properties: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to Huawei Cloud Analytics or Google Analytics
  }
};
```

---

## 🎓 Accessibility (WCAG 2.1 AA)

1. **Color Contrast**: All text meets 4.5:1 ratio
2. **Keyboard Navigation**: Full map control via keyboard
3. **Screen Reader**: ARIA labels for all interactive elements
4. **Focus Management**: Visible focus indicators
5. **Reduced Motion**: Respect `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🌐 Internationalization (i18n)

### Supported Languages
- Thai (th-TH) - Primary
- English (en-US) - Secondary

### Implementation
```typescript
// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'th',
    locales: ['th', 'en'],
  },
};
```

---

## 🧪 Testing Strategy

### Unit Tests
- Component rendering (Jest + React Testing Library)
- Store logic (Zustand stores)
- Utility functions

### Integration Tests
- API route handlers
- Map layer rendering
- Time-slider synchronization

### E2E Tests (Playwright)
```typescript
test('Time-travel slider updates map layers', async ({ page }) => {
  await page.goto('/map');
  await page.locator('[data-testid="time-slider"]').fill('120');
  await expect(page.locator('.map-layer-forecast')).toBeVisible();
});
```

---

## 📦 Deployment Architecture

```
┌─────────────────────────────────────────────┐
│        Huawei Cloud CDN                     │
│  (Static Assets + Edge Caching)             │
└───────────────┬─────────────────────────────┘
                │
┌───────────────▼─────────────────────────────┐
│     Next.js 14 App (Vercel/Huawei Cloud)    │
│  - SSR for Dashboard                        │
│  - CSR for Map                              │
└───────────────┬─────────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
┌───────▼──────┐  ┌──────▼────────┐
│  Backend API │  │  MindSpore    │
│  (Elysia.js) │  │  Inference    │
│              │  │  (ModelArts)  │
└──────────────┘  └───────────────┘
```

### Environment Variables
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.kleawklad.th
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxxx
NEXT_PUBLIC_HUAWEI_CLOUD_ENDPOINT=https://modelarts.ap-southeast-1.myhuaweicloud.com

# Private
DATABASE_URL=postgresql://...
JWT_SECRET=...
HUAWEI_API_KEY=...
```

---

## 🏆 Competition Scoring Alignment

### Innovation (35 points)
✅ CycleGAN SAR-to-optical translation (unique)
✅ GNN-based infrastructure risk propagation (novel)
✅ RL-driven dynamic evacuation routing (cutting-edge)
✅ Digital twin for disaster management (emerging field)

### Technical Implementation (30 points)
✅ Full MindSpore/CANN integration
✅ Production-ready Next.js 14 architecture
✅ Real-time data processing pipeline
✅ Scalable microservice design

### Completeness (20 points)
✅ End-to-end system (data → inference → UI)
✅ Both dashboard and operational views
✅ API documentation and testing
✅ Deployment-ready configuration

### Presentation (15 points)
✅ High-fidelity UI matching GISTDA quality
✅ Interactive demo (time-slider, evacuation planner)
✅ Clear value proposition for judges
✅ Video demonstrations of key features

---

## 📚 Next Steps

1. ✅ Review this architecture document
2. 🔄 Set up Next.js 14 project structure
3. 🔄 Implement Time-Travel Slider component
4. 🔄 Build Dashboard (Page A)
5. 🔄 Build Operation Map (Page B)
6. 🔄 Integrate with backend APIs
7. 🔄 Add AI model inference endpoints
8. 🔄 Performance optimization
9. 🔄 Create demo video
10. 🔄 Deploy to Huawei Cloud

---

**Document Version**: 1.0
**Last Updated**: 2025-12-31
**Author**: Lead UI/UX Designer & Frontend Architect
