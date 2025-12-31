'use client'

import React, { useState } from 'react'
import { 
  MapPin, 
  Calendar, 
  ChevronDown,
  Satellite,
  Radio
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/context/DashboardContext'
import { useLanguage } from '@/context/LanguageContext'

export default function ScenarioSelector() {
  const { selectedArea, setSelectedArea, timeRange, setTimeRange, systemStatus } = useDashboard()
  const { language, t } = useLanguage()
  const [isAreaOpen, setIsAreaOpen] = useState(false)

  const areaOptions = [
    { value: 'all', label: t('scenario.allCountry') },
    { value: 'hatyai', label: t('scenario.hatYai') },
    { value: 'utapao', label: t('scenario.uTapao') },
  ]

  const timeRanges = [
    { value: 'today', label: t('scenario.today') },
    { value: '3days', label: t('scenario.3days') },
    { value: '7days', label: t('scenario.7days') },
    { value: '30days', label: t('scenario.30days') },
  ]

  const selectedAreaOption = areaOptions.find(opt => opt.value === selectedArea)

  return (
    <div className="dashboard-card animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-navy-800">
          {t('scenario.title')}
        </h2>
      </div>

      {/* Area Dropdown */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-500 mb-1.5 flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1" />
          {t('scenario.area')}
        </label>
        <div className="relative">
          <button
            onClick={() => setIsAreaOpen(!isAreaOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 transition-colors"
          >
            <span className="text-navy-800 font-medium">{selectedAreaOption?.label}</span>
            <ChevronDown className={cn(
              "w-4 h-4 text-gray-400 transition-transform",
              isAreaOpen && "rotate-180"
            )} />
          </button>
          
          {isAreaOpen && (
            <div className="dropdown-content">
              {areaOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    setSelectedArea(option.value)
                    setIsAreaOpen(false)
                  }}
                  className={cn(
                    "dropdown-item",
                    selectedArea === option.value && "selected"
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Time Range Chips */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-500 mb-2 flex items-center">
          <Calendar className="w-3.5 h-3.5 mr-1" />
          {language === 'th' ? 'ช่วงเวลา' : 'Time Range'}
        </label>
        <div className="flex flex-wrap gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={cn("time-chip", timeRange === range.value && "active")}
            >
              {range.label}
            </button>
          ))}
          <button className="time-chip flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{language === 'th' ? 'กำหนดเอง' : 'Custom'}</span>
          </button>
        </div>
      </div>

      {/* Data Source Tag */}
      <div className="flex items-center pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Satellite className="w-3.5 h-3.5 text-primary-500 mr-1" />
            <Radio className="w-3.5 h-3.5 text-secondary-500" />
          </div>
          <span className="text-xs text-gray-500">
            {t('scenario.dataSource')} {systemStatus.dataSource.join(', ')}
          </span>
        </div>
        <div className="ml-auto flex items-center">
          <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse mr-1.5" />
          <span className="text-xs text-success-600 font-medium">Live</span>
        </div>
      </div>
    </div>
  )
}
