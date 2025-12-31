'use client'

import React from 'react'
import { 
  Droplets, 
  TrendingUp, 
  TrendingDown,
  Minus
} from 'lucide-react'
import { useDashboard } from '@/context/DashboardContext'
import { useLanguage } from '@/context/LanguageContext'
import { formatNumber, getRiskColor, getTrendIcon, getTrendColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function FloodAreaCard() {
  const { totalFloodedArea, affectedSubDistricts } = useDashboard()
  const { language, t, isTransitioning } = useLanguage()

  const maxArea = Math.max(...affectedSubDistricts.map(d => d.affectedArea))

  const getTrendIconComponent = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-3 h-3" />
      case 'decreasing':
        return <TrendingDown className="w-3 h-3" />
      default:
        return <Minus className="w-3 h-3" />
    }
  }

  return (
    <div className="dashboard-card card-animate hover-lift">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <Droplets className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <h2 className={cn(
              "text-base font-semibold text-navy-800 transition-all duration-200",
              isTransitioning ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"
            )}>
              {t('flood.title')}
            </h2>
          </div>
        </div>
      </div>

      {/* Total Area Highlight */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 mb-5 transition-all duration-300 hover:shadow-md">
        <div className="flex items-baseline space-x-2">
          <span className={cn(
            "text-3xl font-bold text-primary-700 transition-all duration-300 tabular-nums",
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}>
            {formatNumber(totalFloodedArea)}
          </span>
          <span className={cn(
            "text-lg text-primary-600 font-medium transition-all duration-200",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}>
            {t('flood.unit')}
          </span>
        </div>
        <div className="flex items-center mt-2 text-sm">
          <span className="text-danger-600 font-medium flex items-center animate-pulse">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12.5%
          </span>
          <span className={cn(
            "text-gray-500 ml-2 transition-all duration-200",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}>
            {language === 'th' ? 'จากเมื่อวาน' : 'from yesterday'}
          </span>
        </div>
      </div>

      {/* Top 5 Sub-districts Bar Chart */}
      <div className="space-y-3 stagger-children">
        <div className={cn(
          "flex items-center justify-between text-xs text-gray-500 mb-2 transition-all duration-200",
          isTransitioning ? "opacity-0" : "opacity-100"
        )}>
          <span>{t('flood.topAffected')}</span>
        </div>

        {affectedSubDistricts.slice(0, 5).map((district, index) => (
          <div 
            key={district.id} 
            className="space-y-1.5 transition-all duration-200 hover:bg-gray-50 rounded-lg p-1.5 -mx-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 bg-gray-100 rounded text-xs flex items-center justify-center font-medium text-gray-600 transition-colors duration-200">
                  {index + 1}
                </span>
                <span className={cn(
                  "text-sm font-medium text-navy-800 transition-all duration-200",
                  isTransitioning ? "opacity-0 -translate-x-2" : "opacity-100 translate-x-0"
                )}>
                  {language === 'th' ? district.nameTh : district.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`${getTrendColor(district.trend)} transition-transform duration-200`}>
                  {getTrendIconComponent(district.trend)}
                </span>
                <span className="text-sm font-semibold text-navy-700 tabular-nums">
                  {formatNumber(district.affectedArea)}
                </span>
              </div>
            </div>
            
            {/* Progress Bar with Animation */}
            <div className="progress-bar">
              <div 
                className={`progress-bar-fill ${getRiskColor(district.riskLevel)} progress-animate`}
                style={{ 
                  width: `${(district.affectedArea / maxArea) * 100}%`,
                  transitionDelay: `${index * 0.05}s`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className={cn(
        "flex items-center justify-center space-x-4 mt-5 pt-4 border-t border-gray-100 transition-all duration-200",
        isTransitioning ? "opacity-0" : "opacity-100"
      )}>
        <div className="flex items-center space-x-1.5 transition-transform duration-200 hover:scale-105">
          <div className="w-3 h-3 rounded-sm bg-danger-500" />
          <span className="text-xs text-gray-600">{language === 'th' ? 'วิกฤต' : 'Critical'}</span>
        </div>
        <div className="flex items-center space-x-1.5 transition-transform duration-200 hover:scale-105">
          <div className="w-3 h-3 rounded-sm bg-warning-500" />
          <span className="text-xs text-gray-600">{language === 'th' ? 'สูง' : 'High'}</span>
        </div>
        <div className="flex items-center space-x-1.5 transition-transform duration-200 hover:scale-105">
          <div className="w-3 h-3 rounded-sm bg-warning-300" />
          <span className="text-xs text-gray-600">{language === 'th' ? 'ปานกลาง' : 'Medium'}</span>
        </div>
        <div className="flex items-center space-x-1.5 transition-transform duration-200 hover:scale-105">
          <div className="w-3 h-3 rounded-sm bg-success-500" />
          <span className="text-xs text-gray-600">{language === 'th' ? 'ต่ำ' : 'Low'}</span>
        </div>
      </div>
    </div>
  )
}
