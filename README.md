# Klaew Klad - Flood Command Center Dashboard

**Satellite-Driven Digital Twin for Dynamic Flood Impact Forecasting & Strategic Evacuation**  
*Hat Yai Case Study*

![Dashboard Preview](./docs/preview.png)

## 🌊 Overview

Klaew Klad is an AI-powered flood monitoring and evacuation management system designed for the Hat Yai region in Thailand. The dashboard provides real-time flood situation awareness, infrastructure impact analysis, and AI-recommended evacuation routes.

### Key Features

- **Real-time Flood Monitoring**: Visualize current and forecasted flood extents
- **Infrastructure Impact Analysis**: Monitor hospitals, power stations, schools, and shelters
- **AI-Powered Evacuation Routes**: RL-based route optimization using PPO algorithm
- **Multi-source Data Integration**: Sentinel-1/2 SAR imagery, IoT sensors, and ground data
- **Time-based Forecasting**: View flood progression from current to +6 hours

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React-Leaflet** - Interactive maps
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Framer Motion** - Animations
- **Radix UI** - Accessible UI primitives

### AI/ML Backend (Conceptual)
- **MindSpore** - Deep learning framework
- **CycleGAN** - SAR-to-Optical image translation
- **GNN** - Hydraulic-aware graph neural network for risk propagation
- **PPO (RL)** - Reinforcement learning for evacuation route optimization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/klaew-klad.git
cd klaew-klad

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
klaew-klad/
├── src/
│   ├── app/
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main dashboard page
│   ├── components/
│   │   ├── cards/            # Analytics cards
│   │   │   ├── ScenarioSelector.tsx
│   │   │   ├── FloodAreaCard.tsx
│   │   │   ├── FacilitiesImpactCard.tsx
│   │   │   ├── EvacuationRoutesCard.tsx
│   │   │   └── SystemStatusCard.tsx
│   │   ├── layout/
│   │   │   └── Header.tsx    # Top navigation header
│   │   ├── map/
│   │   │   ├── MapPanel.tsx  # Map container
│   │   │   ├── FloodMap.tsx  # Leaflet map component
│   │   │   ├── MapControls.tsx
│   │   │   ├── LayerToggle.tsx
│   │   │   ├── MapLegend.tsx
│   │   │   └── TimeSlider.tsx
│   │   └── panels/
│   │       └── AnalyticsPanel.tsx
│   ├── context/
│   │   └── DashboardContext.tsx  # Global state management
│   └── lib/
│       └── utils.ts          # Utility functions
├── public/                   # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#2F80ED` | Buttons, active states |
| Secondary Teal | `#319795` | Accents, highlights |
| Navy | `#152438` | Header, text |
| Danger Red | `#EF4444` | Alerts, critical status |
| Warning Yellow | `#F59E0B` | Warnings, at-risk status |
| Success Green | `#10B981` | Normal status, positive indicators |

### Typography

- **Primary Font**: Noto Sans Thai / Noto Sans
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

## 📊 Data Sources

- **Satellite Imagery**: Sentinel-1 (SAR), Sentinel-2 (Optical)
- **IoT Sensors**: Water level sensors, weather stations
- **Government Data**: Infrastructure databases, road networks
- **AI Models**: Real-time flood segmentation and forecasting

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png
NEXT_PUBLIC_API_URL=https://api.klaewklad.example.com
```

## 📱 Responsive Design

The dashboard is optimized for:
- **Desktop**: Full dashboard experience (1280px+)
- **Tablet**: Collapsible sidebar (768px - 1279px)
- **Mobile**: Stacked layout with bottom navigation (< 768px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GISTDA** - Design inspiration from Thai disaster dashboard
- **OpenStreetMap** - Map data
- **Copernicus Programme** - Sentinel satellite data

---

**Klaew Klad** - แคล้วคลาด - *"To narrowly escape danger"*  
Built with ❤️ for disaster resilience in Thailand
