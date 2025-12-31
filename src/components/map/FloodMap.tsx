'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polygon, Polyline, CircleMarker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useDashboard, BasemapType } from '@/context/DashboardContext'
import 'leaflet/dist/leaflet.css'

// Hat Yai center coordinates
const HAT_YAI_CENTER: [number, number] = [7.0086, 100.4747]
const DEFAULT_ZOOM = 12

// Basemap configurations
const basemapUrls: Record<BasemapType, { url: string; attribution: string }> = {
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>',
  },
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
}

// Mock flood zones
const floodZones = [
  {
    id: 'zone1',
    name: 'คลองแห',
    depth: 'high',
    coordinates: [
      [7.025, 100.445],
      [7.035, 100.455],
      [7.040, 100.470],
      [7.030, 100.480],
      [7.015, 100.475],
      [7.010, 100.460],
      [7.020, 100.445],
    ] as [number, number][]
  },
  {
    id: 'zone2',
    name: 'คอหงส์',
    depth: 'medium',
    coordinates: [
      [6.995, 100.490],
      [7.010, 100.495],
      [7.015, 100.510],
      [7.005, 100.520],
      [6.990, 100.515],
      [6.985, 100.500],
    ] as [number, number][]
  },
  {
    id: 'zone3',
    name: 'หาดใหญ่ใน',
    depth: 'high',
    coordinates: [
      [7.000, 100.465],
      [7.015, 100.470],
      [7.020, 100.485],
      [7.010, 100.495],
      [6.995, 100.490],
      [6.990, 100.475],
    ] as [number, number][]
  },
  {
    id: 'zone4',
    name: 'ควนลัง',
    depth: 'low',
    coordinates: [
      [7.040, 100.420],
      [7.055, 100.425],
      [7.060, 100.440],
      [7.050, 100.450],
      [7.035, 100.445],
      [7.030, 100.430],
    ] as [number, number][]
  }
]

// Mock evacuation routes
const evacuationRoutes = [
  {
    id: 'route1',
    name: 'เส้นทาง A - ทางหลวงเหนือ',
    status: 'open',
    coordinates: [
      [7.010, 100.475],
      [7.025, 100.465],
      [7.040, 100.450],
      [7.060, 100.430],
    ] as [number, number][]
  },
  {
    id: 'route2',
    name: 'เส้นทาง B - ทางเลี่ยงตะวันออก',
    status: 'at_risk',
    coordinates: [
      [7.005, 100.480],
      [7.010, 100.510],
      [7.025, 100.530],
      [7.045, 100.545],
    ] as [number, number][]
  },
  {
    id: 'route3',
    name: 'เส้นทาง C - ถนนกลาง',
    status: 'closed',
    coordinates: [
      [7.008, 100.475],
      [7.000, 100.490],
      [6.995, 100.510],
    ] as [number, number][]
  },
  {
    id: 'route4',
    name: 'เส้นทาง D - ทางใต้',
    status: 'open',
    coordinates: [
      [7.005, 100.470],
      [6.990, 100.455],
      [6.970, 100.440],
      [6.950, 100.420],
    ] as [number, number][]
  }
]

// Mock facilities
const facilities = [
  { id: 'f1', name: 'โรงพยาบาลหาดใหญ่', type: 'hospital', status: 'normal', coordinates: [7.0086, 100.4747] as [number, number] },
  { id: 'f2', name: 'โรงพยาบาลสงขลานครินทร์', type: 'hospital', status: 'at_risk', coordinates: [7.0050, 100.5020] as [number, number] },
  { id: 'f3', name: 'สถานีไฟฟ้าหลัก', type: 'power_station', status: 'normal', coordinates: [7.0150, 100.4580] as [number, number] },
  { id: 'f4', name: 'ศูนย์พักพิง A', type: 'shelter', status: 'normal', coordinates: [7.0300, 100.4400] as [number, number] },
  { id: 'f5', name: 'ศูนย์พักพิง B', type: 'shelter', status: 'normal', coordinates: [6.9850, 100.4900] as [number, number] },
  { id: 'f6', name: 'โรงเรียนหาดใหญ่วิทยาลัย', type: 'school', status: 'closed', coordinates: [7.0100, 100.4650] as [number, number] },
]

// Map Controller Component
function MapController() {
  const map = useMap()
  
  useEffect(() => {
    map.setView(HAT_YAI_CENTER, DEFAULT_ZOOM)
  }, [map])
  
  return null
}

// Get flood zone color based on depth
function getFloodColor(depth: string): string {
  switch (depth) {
    case 'high':
      return '#1565C0'
    case 'medium':
      return '#1E88E5'
    case 'low':
      return '#42A5F5'
    default:
      return '#64B5F6'
  }
}

// Get route color based on status
function getRouteColor(status: string): string {
  switch (status) {
    case 'open':
      return '#10B981'
    case 'at_risk':
      return '#F59E0B'
    case 'closed':
      return '#EF4444'
    default:
      return '#6B7280'
  }
}

// Get facility marker color
function getFacilityColor(type: string, status: string): string {
  if (status === 'closed' || status === 'affected') return '#EF4444'
  if (status === 'at_risk') return '#F59E0B'
  
  switch (type) {
    case 'hospital':
      return '#EF4444'
    case 'power_station':
      return '#F59E0B'
    case 'school':
      return '#3B82F6'
    case 'shelter':
      return '#10B981'
    default:
      return '#6B7280'
  }
}

export default function FloodMap() {
  const { mapLayers, basemapType } = useDashboard()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  const showFlood = mapLayers.find(l => l.id === 'flood')?.visible ?? true
  const showEvacuation = mapLayers.find(l => l.id === 'evacuation')?.visible ?? true
  const showFacilities = mapLayers.find(l => l.id === 'facilities')?.visible ?? true
  
  const currentBasemap = basemapUrls[basemapType]

  return (
    <MapContainer
      center={HAT_YAI_CENTER}
      zoom={DEFAULT_ZOOM}
      className="w-full h-full"
      zoomControl={false}
      attributionControl={false}
    >
      <MapController />
      
      {/* Base Tile Layer - Dynamic basemap */}
      <TileLayer
        key={basemapType}
        url={currentBasemap.url}
        attribution={currentBasemap.attribution}
      />

      {/* Flood Zones Layer */}
      {showFlood && floodZones.map((zone) => (
        <Polygon
          key={zone.id}
          positions={zone.coordinates}
          pathOptions={{
            fillColor: getFloodColor(zone.depth),
            fillOpacity: 0.5,
            color: getFloodColor(zone.depth),
            weight: 2,
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{zone.name}</p>
              <p className="text-gray-600">
                ระดับน้ำ: {zone.depth === 'high' ? 'สูง' : zone.depth === 'medium' ? 'ปานกลาง' : 'ต่ำ'}
              </p>
            </div>
          </Popup>
        </Polygon>
      ))}

      {/* Evacuation Routes Layer */}
      {showEvacuation && evacuationRoutes.map((route) => (
        <Polyline
          key={route.id}
          positions={route.coordinates}
          pathOptions={{
            color: getRouteColor(route.status),
            weight: 4,
            opacity: 0.8,
            dashArray: route.status === 'closed' ? '10, 10' : undefined,
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{route.name}</p>
              <p className={`font-medium ${
                route.status === 'open' ? 'text-green-600' :
                route.status === 'at_risk' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                สถานะ: {route.status === 'open' ? 'ปกติ' : 
                        route.status === 'at_risk' ? 'เสี่ยงน้ำท่วม' : 'ปิดชั่วคราว'}
              </p>
            </div>
          </Popup>
        </Polyline>
      ))}

      {/* Facilities Layer */}
      {showFacilities && facilities.map((facility) => (
        <CircleMarker
          key={facility.id}
          center={facility.coordinates}
          radius={8}
          pathOptions={{
            fillColor: getFacilityColor(facility.type, facility.status),
            fillOpacity: 0.9,
            color: '#FFFFFF',
            weight: 2,
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{facility.name}</p>
              <p className="text-gray-600">
                ประเภท: {
                  facility.type === 'hospital' ? 'โรงพยาบาล' :
                  facility.type === 'power_station' ? 'สถานีไฟฟ้า' :
                  facility.type === 'school' ? 'โรงเรียน' :
                  facility.type === 'shelter' ? 'ศูนย์พักพิง' : facility.type
                }
              </p>
              <p className={`font-medium ${
                facility.status === 'normal' ? 'text-green-600' :
                facility.status === 'at_risk' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                สถานะ: {
                  facility.status === 'normal' ? 'ปกติ' :
                  facility.status === 'at_risk' ? 'เสี่ยง' : 'ปิด'
                }
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
