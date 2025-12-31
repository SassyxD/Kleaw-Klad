'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Layers,
  Plus,
  Minus,
  Compass,
  Locate,
  Maximize2,
  Sun,
  Moon,
  Satellite,
  Mountain,
  MapPin,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboard, BasemapType } from '@/context/DashboardContext'
import { useLanguage } from '@/context/LanguageContext'

const basemapOptions: { id: BasemapType; icon: any; labelKey: string }[] = [
  { id: 'light', icon: Sun, labelKey: 'basemap.light' },
  { id: 'dark', icon: Moon, labelKey: 'basemap.dark' },
  { id: 'satellite', icon: Satellite, labelKey: 'basemap.satellite' },
  { id: 'terrain', icon: Mountain, labelKey: 'basemap.terrain' },
  { id: 'streets', icon: MapPin, labelKey: 'basemap.streets' },
]

export default function MapControls() {
  const [showBasemapPanel, setShowBasemapPanel] = useState(false)
  const { basemapType, setBasemapType } = useDashboard()
  const { t } = useLanguage()
  const panelRef = useRef<HTMLDivElement>(null)

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowBasemapPanel(false)
      }
    }

    if (showBasemapPanel) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showBasemapPanel])

  return (
    <div className="flex flex-col space-y-2">
      {/* Zoom Controls */}
      <div className="flex flex-col bg-white rounded-xl shadow-card overflow-hidden">
        <button className="map-control-btn rounded-none border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
        <button className="map-control-btn rounded-none hover:bg-gray-50 transition-colors">
          <Minus className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Layer / Basemap Controls */}
      <div className="relative" ref={panelRef}>
        <button 
          onClick={() => setShowBasemapPanel(!showBasemapPanel)}
          className={cn(
            "map-control-btn transition-all",
            showBasemapPanel && "bg-primary-50 ring-2 ring-primary-500"
          )}
        >
          <Layers className={cn("w-5 h-5", showBasemapPanel ? "text-primary-600" : "text-gray-600")} />
        </button>

        {/* Basemap Selection Panel */}
        {showBasemapPanel && (
          <div className="absolute right-12 top-0 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-right-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">{t('basemap.title')}</span>
              <button 
                onClick={() => setShowBasemapPanel(false)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
            
            {/* Options */}
            <div className="p-2 space-y-1">
              {basemapOptions.map((option) => {
                const Icon = option.icon
                const isActive = basemapType === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      setBasemapType(option.id)
                      setShowBasemapPanel(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                      isActive
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive && "text-primary-500")} />
                    <span>{t(option.labelKey)}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
      
      <button className="map-control-btn hover:bg-gray-50 transition-colors">
        <Compass className="w-5 h-5 text-gray-600" />
      </button>
      
      <button className="map-control-btn hover:bg-gray-50 transition-colors">
        <Locate className="w-5 h-5 text-gray-600" />
      </button>
      
      <button className="map-control-btn hover:bg-gray-50 transition-colors">
        <Maximize2 className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  )
}
