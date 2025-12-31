'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

export default function MapLegend() {
  const { language, t, isTransitioning } = useLanguage()
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden min-w-[160px] max-w-[200px] transition-all duration-300">
      {/* Header - Always visible */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      >
        <h3 className={cn(
          "text-sm font-semibold text-navy-800 transition-all duration-200",
          isTransitioning ? "opacity-0" : "opacity-100"
        )}>
          {t('legend.title')}
        </h3>
        {isCollapsed ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        )}
      </button>
      
      {/* Collapsible Content */}
      <div className={cn(
        "transition-all duration-300 overflow-hidden",
        isCollapsed ? "max-h-0" : "max-h-[400px]"
      )}>
        <div className="px-3 pb-3 space-y-3">
          {/* Water Depth Legend */}
          <div>
            <p className="text-[10px] text-gray-500 mb-1.5 uppercase tracking-wide">
              {language === 'th' ? 'ระดับน้ำท่วม' : 'Flood Level'}
            </p>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#1565C0', opacity: 0.7 }} />
                <span className="text-[11px] text-gray-700">
                  {language === 'th' ? 'สูง (>1.5 ม.)' : 'High (>1.5m)'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#1E88E5', opacity: 0.7 }} />
                <span className="text-[11px] text-gray-700">
                  {language === 'th' ? 'ปานกลาง (0.5-1.5 ม.)' : 'Medium (0.5-1.5m)'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#42A5F5', opacity: 0.7 }} />
                <span className="text-[11px] text-gray-700">
                  {language === 'th' ? 'ต่ำ (<0.5 ม.)' : 'Low (<0.5m)'}
                </span>
              </div>
            </div>
          </div>

          {/* Evacuation Routes Legend */}
          <div>
            <p className="text-[10px] text-gray-500 mb-1.5 uppercase tracking-wide">
              {language === 'th' ? 'เส้นทางอพยพ' : 'Evacuation Routes'}
            </p>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-0.5 rounded bg-success-500" />
                <span className="text-[11px] text-gray-700">
                  {t('evacuation.normal')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-0.5 rounded bg-warning-500" />
                <span className="text-[11px] text-gray-700">
                  {language === 'th' ? 'เสี่ยง' : 'At Risk'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-0.5 rounded bg-danger-500" style={{ borderStyle: 'dashed' }} />
                <span className="text-[11px] text-gray-700">
                  {language === 'th' ? 'ปิด' : 'Closed'}
                </span>
              </div>
            </div>
          </div>

          {/* Facilities Legend */}
          <div>
            <p className="text-[10px] text-gray-500 mb-1.5 uppercase tracking-wide">
              {language === 'th' ? 'จุดสำคัญ' : 'Key Locations'}
            </p>
            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-danger-500" />
                <span className="text-[10px] text-gray-700">
                  {t('facilities.hospital')}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-warning-500" />
                <span className="text-[10px] text-gray-700">
                  {t('facilities.power')}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                <span className="text-[10px] text-gray-700">
                  {t('facilities.school')}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-success-500" />
                <span className="text-[10px] text-gray-700">
                  {t('facilities.shelter')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
