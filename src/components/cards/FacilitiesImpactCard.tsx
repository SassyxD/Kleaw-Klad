'use client'

import React from 'react'
import { 
  Building2, 
  Hospital, 
  Zap, 
  GraduationCap,
  Home,
  Brain
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useDashboard } from '@/context/DashboardContext'
import { useLanguage } from '@/context/LanguageContext'

const facilityCategories = [
  { name: 'โรงพยาบาล', nameEn: 'Hospitals', type: 'hospital', count: 3, affected: 1, color: '#EF4444', icon: Hospital },
  { name: 'สถานีไฟฟ้า', nameEn: 'Power Stations', type: 'power_station', count: 5, affected: 1, color: '#F59E0B', icon: Zap },
  { name: 'โรงเรียน', nameEn: 'Schools', type: 'school', count: 12, affected: 4, color: '#3B82F6', icon: GraduationCap },
  { name: 'ศูนย์พักพิง', nameEn: 'Shelters', type: 'shelter', count: 8, affected: 0, color: '#10B981', icon: Home },
]

const chartData = facilityCategories.map(cat => ({
  name: cat.name,
  value: cat.affected,
  total: cat.count,
  color: cat.color,
}))

export default function FacilitiesImpactCard() {
  const { language, t } = useLanguage()
  const totalFacilities = facilityCategories.reduce((acc, cat) => acc + cat.count, 0)
  const totalAffected = facilityCategories.reduce((acc, cat) => acc + cat.affected, 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="custom-tooltip">
          <p className="font-medium">{language === 'th' ? data.name : data.nameEn}</p>
          <p className="text-xs">{language === 'th' ? 'ได้รับผลกระทบ' : 'Affected'}: {data.value}/{data.total}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="dashboard-card animate-in" style={{ animationDelay: '0.2s' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-warning-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-navy-800">
              {t('facilities.title')}
            </h2>
          </div>
        </div>
      </div>

      {/* Chart and Stats */}
      <div className="flex items-start gap-4">
        {/* Donut Chart */}
        <div className="w-32 h-32 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-navy-800">{totalAffected}</span>
            <span className="text-xs text-gray-500">/{totalFacilities}</span>
          </div>
        </div>

        {/* Facility List */}
        <div className="flex-1 space-y-2">
          {facilityCategories.map((cat) => {
            const Icon = cat.icon
            const percentage = cat.count > 0 ? ((cat.affected / cat.count) * 100).toFixed(0) : 0
            return (
              <div key={cat.type} className="flex items-center justify-between py-1.5">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                  </div>
                  <span className="text-sm text-navy-700">{language === 'th' ? cat.name : cat.nameEn}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold" style={{ color: cat.color }}>
                    {cat.affected}
                  </span>
                  <span className="text-xs text-gray-400">/ {cat.count}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* AI Analysis Note */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Brain className="w-3.5 h-3.5 text-secondary-500" />
          <span>{t('facilities.analysis')}</span>
        </div>
      </div>
    </div>
  )
}
