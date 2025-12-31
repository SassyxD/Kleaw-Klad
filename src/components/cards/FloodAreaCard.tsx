'use client'

import React from 'react'
import { 
  Droplets, 
  TrendingUp, 
  TrendingDown,
  Minus
} from 'lucide-react'
import { useDashboard } from '@/context/DashboardContext'
import { formatNumber, getRiskColor, getTrendIcon, getTrendColor } from '@/lib/utils'

export default function FloodAreaCard() {
  const { totalFloodedArea, affectedSubDistricts } = useDashboard()

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
    <div className="dashboard-card animate-in" style={{ animationDelay: '0.1s' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
            <Droplets className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-navy-800">
              พื้นที่น้ำท่วมทั้งหมด
            </h2>
            <span className="text-xs text-gray-500">Total Flooded Area</span>
          </div>
        </div>
      </div>

      {/* Total Area Highlight */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 mb-5">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-primary-700">
            {formatNumber(totalFloodedArea)}
          </span>
          <span className="text-lg text-primary-600 font-medium">ไร่</span>
        </div>
        <div className="flex items-center mt-2 text-sm">
          <span className="text-danger-600 font-medium flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12.5%
          </span>
          <span className="text-gray-500 ml-2">จากเมื่อวาน</span>
        </div>
      </div>

      {/* Top 5 Sub-districts Bar Chart */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>พื้นที่ย่อยที่ได้รับผลกระทบสูงสุด</span>
          <span>Top 5 Affected Areas</span>
        </div>

        {affectedSubDistricts.slice(0, 5).map((district, index) => (
          <div key={district.id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 bg-gray-100 rounded text-xs flex items-center justify-center font-medium text-gray-600">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-navy-800">{district.nameTh}</span>
                <span className="text-xs text-gray-400">({district.name})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`${getTrendColor(district.trend)}`}>
                  {getTrendIconComponent(district.trend)}
                </span>
                <span className="text-sm font-semibold text-navy-700">
                  {formatNumber(district.affectedArea)}
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="progress-bar">
              <div 
                className={`progress-bar-fill ${getRiskColor(district.riskLevel)}`}
                style={{ width: `${(district.affectedArea / maxArea) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded-sm bg-danger-500" />
          <span className="text-xs text-gray-600">วิกฤต</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded-sm bg-warning-500" />
          <span className="text-xs text-gray-600">สูง</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded-sm bg-warning-300" />
          <span className="text-xs text-gray-600">ปานกลาง</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded-sm bg-success-500" />
          <span className="text-xs text-gray-600">ต่ำ</span>
        </div>
      </div>
    </div>
  )
}
