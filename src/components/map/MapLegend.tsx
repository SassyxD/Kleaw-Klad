'use client'

import React from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function MapLegend() {
  const { language, t } = useLanguage()
  
  return (
    <div className="bg-white rounded-xl shadow-card p-4 min-w-[180px]">
      <h3 className="text-sm font-semibold text-navy-800 mb-3">
        {t('legend.title')}
      </h3>
      
      {/* Water Depth Legend */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">
          {language === 'th' ? 'ระดับน้ำท่วม' : 'Flood Level'}
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#1565C0', opacity: 0.7 }} />
            <span className="text-xs text-gray-700">
              {language === 'th' ? 'สูง (>1.5 ม.)' : 'High (>1.5m)'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#1E88E5', opacity: 0.7 }} />
            <span className="text-xs text-gray-700">
              {language === 'th' ? 'ปานกลาง (0.5-1.5 ม.)' : 'Medium (0.5-1.5m)'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#42A5F5', opacity: 0.7 }} />
            <span className="text-xs text-gray-700">
              {language === 'th' ? 'ต่ำ (<0.5 ม.)' : 'Low (<0.5m)'}
            </span>
          </div>
        </div>
      </div>

      {/* Evacuation Routes Legend */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">
          {language === 'th' ? 'เส้นทางอพยพ' : 'Evacuation Routes'}
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-1 rounded" style={{ backgroundColor: '#10B981' }} />
            <span className="text-xs text-gray-700">
              {t('evacuation.normal')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-1 rounded" style={{ backgroundColor: '#F59E0B' }} />
            <span className="text-xs text-gray-700">
              {language === 'th' ? 'เสี่ยง' : 'At Risk'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-1 rounded" style={{ backgroundColor: '#EF4444', borderStyle: 'dashed' }} />
            <span className="text-xs text-gray-700">
              {language === 'th' ? 'ปิด' : 'Closed'}
            </span>
          </div>
        </div>
      </div>

      {/* Facilities Legend */}
      <div>
        <p className="text-xs text-gray-500 mb-2">
          {language === 'th' ? 'จุดสำคัญ' : 'Key Locations'}
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-danger-500" />
            <span className="text-xs text-gray-700">
              {t('facilities.hospital')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-warning-500" />
            <span className="text-xs text-gray-700">
              {t('facilities.power')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary-500" />
            <span className="text-xs text-gray-700">
              {t('facilities.school')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-success-500" />
            <span className="text-xs text-gray-700">
              {t('facilities.shelter')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
