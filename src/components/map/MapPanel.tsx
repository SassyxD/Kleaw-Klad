'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import MapControls from './MapControls'
import MapLegend from './MapLegend'
import LayerToggle from './LayerToggle'

// Dynamic import for Leaflet (client-side only)
const FloodMap = dynamic(() => import('./FloodMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-500 text-sm">กำลังโหลดแผนที่...</span>
      </div>
    </div>
  ),
})

export default function MapPanel() {
  return (
    <div className="relative w-full h-full">
      {/* Main Map */}
      <FloodMap />

      {/* Layer Toggle Pills */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-[1000]">
        <LayerToggle />
      </div>

      {/* Right Controls */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-[1000]">
        <MapControls />
      </div>

      {/* Legend - Hidden on small mobile */}
      <div className="hidden sm:block absolute bottom-28 md:bottom-24 right-2 md:right-4 z-[1000]">
        <MapLegend />
      </div>
    </div>
  )
}
