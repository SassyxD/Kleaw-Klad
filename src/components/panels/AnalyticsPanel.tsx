'use client'

import React from 'react'
import ScenarioSelector from '@/components/cards/ScenarioSelector'
import FloodAreaCard from '@/components/cards/FloodAreaCard'
import FacilitiesImpactCard from '@/components/cards/FacilitiesImpactCard'
import EvacuationRoutesCard from '@/components/cards/EvacuationRoutesCard'
import SystemStatusCard from '@/components/cards/SystemStatusCard'

interface AnalyticsPanelProps {
  activeTab: string
}

export default function AnalyticsPanel({ activeTab }: AnalyticsPanelProps) {
  return (
    <div className="p-4 space-y-4">
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
    </div>
  )
}
