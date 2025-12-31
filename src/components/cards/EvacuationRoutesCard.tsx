'use client'

import React from 'react'
import { 
  Route, 
  Navigation,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Brain
} from 'lucide-react'
import { useDashboard } from '@/context/DashboardContext'
import { useLanguage } from '@/context/LanguageContext'
import { cn, getStatusColor } from '@/lib/utils'

export default function EvacuationRoutesCard() {
  const { evacuationRoutes } = useDashboard()
  const { language, t } = useLanguage()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircle2 className="w-4 h-4 text-success-500" />
      case 'at_risk':
        return <AlertTriangle className="w-4 h-4 text-warning-500" />
      case 'closed':
        return <XCircle className="w-4 h-4 text-danger-500" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return t('evacuation.normal')
      case 'at_risk':
        return t('evacuation.atRisk')
      case 'closed':
        return t('evacuation.closed')
      default:
        return status
    }
  }

  const { isTransitioning } = useLanguage()

  return (
    <div className="dashboard-card card-animate hover-lift">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <Route className="w-4 h-4 text-secondary-600" />
          </div>
          <div>
            <h2 className={`text-base font-semibold text-navy-800 transition-all duration-200 ${isTransitioning ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'}`}>
              {t('evacuation.title')}
            </h2>
          </div>
        </div>
      </div>

      {/* Routes List */}
      <div className="space-y-3 stagger-children">
        {evacuationRoutes.map((route, index) => {
          const statusColors = getStatusColor(route.status)
          return (
            <div 
              key={route.id}
              className={cn(
                "p-3 rounded-lg border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
                route.status === 'closed' ? 'bg-danger-50 border-danger-200' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="transition-transform duration-200">{getStatusIcon(route.status)}</span>
                    <span className={`text-sm font-medium text-navy-800 transition-all duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>{language === 'th' ? route.nameTh : route.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Navigation className="w-3 h-3" />
                      <span>{route.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{route.estimatedTime}</span>
                    </div>
                  </div>
                </div>

                <div className={cn(
                  "status-chip",
                  statusColors.bg,
                  statusColors.text
                )}>
                  {getStatusLabel(route.status)}
                </div>
              </div>

              {/* Congestion Bar */}
              {route.status !== 'closed' && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">{language === 'th' ? 'การจราจร' : 'Traffic'}</span>
                    <span className={cn(
                      "font-medium",
                      route.congestionLevel > 70 ? 'text-danger-600' :
                      route.congestionLevel > 40 ? 'text-warning-600' : 'text-success-600'
                    )}>
                      {route.congestionLevel}%
                    </span>
                  </div>
                  <div className="progress-bar h-1.5">
                    <div 
                      className={cn(
                        "progress-bar-fill",
                        route.congestionLevel > 70 ? 'bg-danger-500' :
                        route.congestionLevel > 40 ? 'bg-warning-500' : 'bg-success-500'
                      )}
                      style={{ width: `${route.congestionLevel}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* AI Policy Note */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Brain className="w-3.5 h-3.5 text-primary-500" />
          <span>{t('evacuation.source')}</span>
        </div>
      </div>
    </div>
  )
}
