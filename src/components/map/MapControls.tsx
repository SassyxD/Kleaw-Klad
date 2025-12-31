'use client'

import React from 'react'
import { 
  Layers,
  Plus,
  Minus,
  Compass,
  Locate,
  Maximize2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MapControls() {
  return (
    <div className="flex flex-col space-y-2">
      {/* Zoom Controls */}
      <div className="flex flex-col bg-white rounded-xl shadow-card overflow-hidden">
        <button className="map-control-btn rounded-none border-b border-gray-100">
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
        <button className="map-control-btn rounded-none">
          <Minus className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Additional Controls */}
      <button className="map-control-btn">
        <Layers className="w-5 h-5 text-gray-600" />
      </button>
      
      <button className="map-control-btn">
        <Compass className="w-5 h-5 text-gray-600" />
      </button>
      
      <button className="map-control-btn">
        <Locate className="w-5 h-5 text-gray-600" />
      </button>
      
      <button className="map-control-btn">
        <Maximize2 className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  )
}
