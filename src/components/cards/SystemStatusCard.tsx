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
import { cn } from '@/lib/utils'

export default function SystemStatusCard() {
  const { systemStatus } = useDashboard()

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-success-500" />
            <span className="text-sm font-medium text-success-600">Online</span>
          </div>
        )
      case 'processing':
        return (
          <div className="flex items-center space-x-1.5">
            <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
            <span className="text-sm font-medium text-primary-600">Processing</span>
          </div>
        )
      case 'offline':
        return (
          <div className="flex items-center space-x-1.5">
            <AlertCircle className="w-4 h-4 text-danger-500" />
            <span className="text-sm font-medium text-danger-600">Offline</span>
          </div>
        )
      default:
        return null
    }
  }

  const stats = [
    {
      label: 'อัปเดตล่าสุด',
      labelEn: 'Last Update',
      value: systemStatus.lastUpdate,
      icon: Clock,
      color: 'text-gray-600'
    },
    {
      label: 'เวลา Inference',
      labelEn: 'Inference Time',
      value: systemStatus.inferenceTime,
      icon: Zap,
      color: 'text-primary-600'
    },
    {
      label: 'ความแม่นยำ Segmentation',
      labelEn: 'Segmentation Accuracy',
      value: `${systemStatus.segmentationAccuracy}% IoU`,
      icon: Target,
      color: 'text-success-600'
    }
  ]

  return (
    <div className="dashboard-card animate-in" style={{ animationDelay: '0.4s' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center">
            <Cpu className="w-4 h-4 text-navy-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-navy-800">
              สถานะระบบ AI
            </h2>
            <span className="text-xs text-gray-500">AI System Status</span>
          </div>
        </div>
        {getStatusIndicator(systemStatus.modelStatus)}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div 
              key={index}
              className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <Icon className={cn("w-4 h-4", stat.color)} />
                <span className="text-sm text-gray-600">{stat.label}</span>
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
        <div className="text-xs text-gray-500 mb-2">โมเดล AI ที่ใช้งาน</div>
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
        <span className="text-sm text-gray-600 font-medium">รีเฟรชข้อมูล</span>
      </button>
    </div>
  )
}
