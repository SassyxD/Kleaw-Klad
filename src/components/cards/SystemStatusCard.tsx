'use client'

import React from 'react'
import { 
  Cpu, 
  Clock, 
  Zap,
  Target,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { useDashboard } from '@/context/DashboardContext'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

export default function SystemStatusCard() {
  const { systemStatus } = useDashboard()
  const { language, t } = useLanguage()

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-success-500" />
            <span className="text-sm font-medium text-success-600">{t('system.online')}</span>
          </div>
        )
      case 'processing':
        return (
          <div className="flex items-center space-x-1.5">
            <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
            <span className="text-sm font-medium text-primary-600">{t('system.processing')}</span>
          </div>
        )
      case 'offline':
        return (
          <div className="flex items-center space-x-1.5">
            <AlertCircle className="w-4 h-4 text-danger-500" />
            <span className="text-sm font-medium text-danger-600">{t('system.offline')}</span>
          </div>
        )
      default:
        return null
    }
  }

  const stats = [
    {
      label: t('system.lastUpdate'),
      value: systemStatus.lastUpdate,
      icon: Clock,
      color: 'text-gray-600'
    },
    {
      label: t('system.inference'),
      value: systemStatus.inferenceTime,
      icon: Zap,
      color: 'text-primary-600'
    },
    {
      label: t('system.accuracy'),
      value: `${systemStatus.segmentationAccuracy}% IoU`,
      icon: Target,
      color: 'text-success-600'
    }
  ]

  const { isTransitioning } = useLanguage()

  return (
    <div className="dashboard-card card-animate hover-lift">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <Cpu className="w-4 h-4 text-navy-600" />
          </div>
          <div>
            <h2 className={`text-base font-semibold text-navy-800 transition-all duration-200 ${isTransitioning ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'}`}>
              {t('system.title')}
            </h2>
          </div>
        </div>
        <div className="transition-all duration-300">{getStatusIndicator(systemStatus.modelStatus)}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-3 stagger-children">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div 
              key={index}
              className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:shadow-sm"
            >
              <div className="flex items-center space-x-2">
                <Icon className={cn("w-4 h-4 transition-transform duration-200 hover:scale-110", stat.color)} />
                <span className={`text-sm text-gray-600 transition-all duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>{stat.label}</span>
              </div>
              <span className={cn("text-sm font-semibold", stat.color)}>
                {stat.value}
              </span>
            </div>
          )
        })}
      </div>

      {/* AI Models Info */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500 mb-2">
          {language === 'th' ? 'โมเดล AI ที่ใช้งาน' : 'Active AI Models'}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
            MindSpore
          </span>
          <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs font-medium">
            CycleGAN SAR-to-Optical
          </span>
          <span className="px-2 py-1 bg-warning-100 text-warning-700 rounded text-xs font-medium">
            GNN Risk Propagation
          </span>
          <span className="px-2 py-1 bg-success-100 text-success-700 rounded text-xs font-medium">
            RL-Based Evacuation
          </span>
        </div>
      </div>

      {/* Refresh Button */}
      <button className="w-full mt-4 flex items-center justify-center space-x-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
        <RefreshCw className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-600 font-medium">
          {language === 'th' ? 'รีเฟรชข้อมูล' : 'Refresh Data'}
        </span>
      </button>
    </div>
  )
}
