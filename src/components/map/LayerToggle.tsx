'use client'

import React from 'react'
import { 
  Droplets, 
  Route, 
  Building,
  Radio
} from 'lucide-react'
import { useDashboard } from '@/context/DashboardContext'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

const layerIcons: Record<string, any> = {
  flood: Droplets,
  evacuation: Route,
  facilities: Building,
  sensors: Radio,
}

const layerTranslationKeys: Record<string, string> = {
  flood: 'map.floodExtent',
  evacuation: 'map.evacuationRoutes',
  facilities: 'map.facilities',
  sensors: 'map.sensors',
}

export default function LayerToggle() {
  const { mapLayers, toggleLayer } = useDashboard()
  const { t, language } = useLanguage()

  return (
    <div className="flex flex-wrap gap-2">
      {mapLayers.map((layer) => {
        const Icon = layerIcons[layer.id] || Droplets
        const translationKey = layerTranslationKeys[layer.id]
        const label = translationKey ? t(translationKey) : (language === 'th' ? layer.nameTh : layer.name)
        
        return (
          <button
            key={layer.id}
            onClick={() => toggleLayer(layer.id)}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm",
              layer.visible
                ? "bg-primary-500 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
