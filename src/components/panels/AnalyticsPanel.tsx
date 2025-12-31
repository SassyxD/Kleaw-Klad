'use client'

import React from 'react'
import { X, BarChart3 } from 'lucide-react'
import ScenarioSelector from '@/components/cards/ScenarioSelector'
import FloodAreaCard from '@/components/cards/FloodAreaCard'
import FacilitiesImpactCard from '@/components/cards/FacilitiesImpactCard'
import EvacuationRoutesCard from '@/components/cards/EvacuationRoutesCard'
import SystemStatusCard from '@/components/cards/SystemStatusCard'
import { useLanguage } from '@/context/LanguageContext'

interface AnalyticsPanelProps {
  activeTab: string
  onClose?: () => void
}

export default function AnalyticsPanel({ activeTab, onClose }: AnalyticsPanelProps) {
  const { t } = useLanguage()
  
  return (
    <div className="p-4 space-y-4">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between pb-2 border-b border-gray-200 -mx-4 px-4 mb-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-primary-500" />
          <h2 className="font-semibold text-gray-900">{t('cards.analytics') || 'Analytics'}</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scenario Selector */}
      <ScenarioSelector />

      {/* Flooded Area & Risk */}
      <FloodAreaCard />

      {/* Critical Facilities Impact */}
      <FacilitiesImpactCard />

      {/* Evacuation Routes */}
      <EvacuationRoutesCard />

      {/* AI System Status */}
      <SystemStatusCard />
      
      {/* Bottom Spacing for Mobile */}
      <div className="h-16 lg:hidden" />
    </div>
  )
}
