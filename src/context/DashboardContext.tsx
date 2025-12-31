'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

// Types
export interface FloodArea {
  id: string
  name: string
  nameTh: string
  affectedArea: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  trend: 'increasing' | 'stable' | 'decreasing'
  coordinates: [number, number]
}

export interface Facility {
  id: string
  name: string
  nameTh: string
  type: 'hospital' | 'power_station' | 'school' | 'shelter' | 'government'
  status: 'normal' | 'at_risk' | 'affected' | 'closed'
  coordinates: [number, number]
}

export interface EvacuationRoute {
  id: string
  name: string
  nameTh: string
  status: 'open' | 'at_risk' | 'closed'
  congestionLevel: number
  estimatedTime: string
  distance: string
}

export interface SystemStatus {
  lastUpdate: string
  inferenceTime: string
  segmentationAccuracy: number
  modelStatus: 'online' | 'processing' | 'offline'
  dataSource: string[]
}

export interface MapLayer {
  id: string
  name: string
  nameTh: string
  visible: boolean
  icon: string
}

export type BasemapType = 'light' | 'dark' | 'satellite' | 'terrain' | 'streets'

interface DashboardContextType {
  // Data
  totalFloodedArea: number
  affectedSubDistricts: FloodArea[]
  facilities: Facility[]
  evacuationRoutes: EvacuationRoute[]
  systemStatus: SystemStatus
  
  // Map state
  mapLayers: MapLayer[]
  toggleLayer: (layerId: string) => void
  selectedArea: string
  setSelectedArea: (area: string) => void
  timeRange: string
  setTimeRange: (range: string) => void
  basemapType: BasemapType
  setBasemapType: (type: BasemapType) => void
  
  // UI state
  isLoading: boolean
  currentForecastTime: number
  setCurrentForecastTime: (time: number) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

// Mock data
const mockFloodAreas: FloodArea[] = [
  { id: '1', name: 'Khlong Hae', nameTh: 'คลองแห', affectedArea: 542168, riskLevel: 'critical', trend: 'increasing', coordinates: [7.0167, 100.4667] },
  { id: '2', name: 'Kho Hong', nameTh: 'คอหงส์', affectedArea: 438921, riskLevel: 'high', trend: 'stable', coordinates: [7.0000, 100.5000] },
  { id: '3', name: 'Hat Yai', nameTh: 'หาดใหญ่', affectedArea: 387654, riskLevel: 'high', trend: 'increasing', coordinates: [7.0086, 100.4747] },
  { id: '4', name: 'Khuan Lang', nameTh: 'ควนลัง', affectedArea: 312987, riskLevel: 'medium', trend: 'decreasing', coordinates: [7.0333, 100.4333] },
  { id: '5', name: 'Bang Klam', nameTh: 'บางกล่ำ', affectedArea: 264942, riskLevel: 'medium', trend: 'stable', coordinates: [7.0500, 100.4000] },
]

const mockFacilities: Facility[] = [
  { id: '1', name: 'Hat Yai Hospital', nameTh: 'โรงพยาบาลหาดใหญ่', type: 'hospital', status: 'normal', coordinates: [7.0086, 100.4747] },
  { id: '2', name: 'Songkhla Hospital', nameTh: 'โรงพยาบาลสงขลา', type: 'hospital', status: 'at_risk', coordinates: [7.2000, 100.5833] },
  { id: '3', name: 'Main Power Station', nameTh: 'สถานีไฟฟ้าหลัก', type: 'power_station', status: 'normal', coordinates: [7.0150, 100.4800] },
  { id: '4', name: 'District School 1', nameTh: 'โรงเรียนประจำอำเภอ 1', type: 'school', status: 'closed', coordinates: [7.0200, 100.4600] },
  { id: '5', name: 'Emergency Shelter A', nameTh: 'ศูนย์พักพิง A', type: 'shelter', status: 'normal', coordinates: [7.0300, 100.4900] },
  { id: '6', name: 'Emergency Shelter B', nameTh: 'ศูนย์พักพิง B', type: 'shelter', status: 'normal', coordinates: [6.9900, 100.4500] },
]

const mockRoutes: EvacuationRoute[] = [
  { id: '1', name: 'Route A - North Highway', nameTh: 'เส้นทาง A - ทางหลวงเหนือ', status: 'open', congestionLevel: 25, estimatedTime: '15 นาที', distance: '8.5 กม.' },
  { id: '2', name: 'Route B - East Bypass', nameTh: 'เส้นทาง B - ทางเลี่ยงตะวันออก', status: 'at_risk', congestionLevel: 65, estimatedTime: '25 นาที', distance: '12.3 กม.' },
  { id: '3', name: 'Route C - Central Road', nameTh: 'เส้นทาง C - ถนนกลาง', status: 'closed', congestionLevel: 100, estimatedTime: 'ปิดชั่วคราว', distance: '5.2 กม.' },
  { id: '4', name: 'Route D - South Access', nameTh: 'เส้นทาง D - ทางใต้', status: 'open', congestionLevel: 40, estimatedTime: '20 นาที', distance: '10.1 กม.' },
  { id: '5', name: 'Route E - West Connector', nameTh: 'เส้นทาง E - เชื่อมตะวันตก', status: 'at_risk', congestionLevel: 55, estimatedTime: '30 นาที', distance: '15.7 กม.' },
]

const mockSystemStatus: SystemStatus = {
  lastUpdate: '5 นาทีที่แล้ว',
  inferenceTime: '35 วินาที / 50 กม²',
  segmentationAccuracy: 92.5,
  modelStatus: 'online',
  dataSource: ['Sentinel-1', 'Sentinel-2', 'IoT Sensor'],
}

const initialMapLayers: MapLayer[] = [
  { id: 'flood', name: 'Flood Extent', nameTh: 'ชั้นข้อมูลน้ำท่วม', visible: true, icon: 'droplets' },
  { id: 'evacuation', name: 'Evacuation Routes', nameTh: 'เส้นทางอพยพแนะนำ', visible: true, icon: 'route' },
  { id: 'facilities', name: 'Critical Facilities', nameTh: 'จุดสำคัญ', visible: true, icon: 'building' },
  { id: 'sensors', name: 'IoT Sensors', nameTh: 'เซ็นเซอร์ IoT', visible: false, icon: 'radio' },
]

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [mapLayers, setMapLayers] = useState<MapLayer[]>(initialMapLayers)
  const [selectedArea, setSelectedArea] = useState('hatyai')
  const [timeRange, setTimeRange] = useState('today')
  const [currentForecastTime, setCurrentForecastTime] = useState(0)
  const [isLoading] = useState(false)
  const [basemapType, setBasemapType] = useState<BasemapType>('light')

  const toggleLayer = (layerId: string) => {
    setMapLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    )
  }

  const value: DashboardContextType = {
    totalFloodedArea: 2146672,
    affectedSubDistricts: mockFloodAreas,
    facilities: mockFacilities,
    evacuationRoutes: mockRoutes,
    systemStatus: mockSystemStatus,
    mapLayers,
    toggleLayer,
    selectedArea,
    setSelectedArea,
    timeRange,
    setTimeRange,
    basemapType,
    setBasemapType,
    isLoading,
    currentForecastTime,
    setCurrentForecastTime,
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
