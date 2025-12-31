'use client'

import React from 'react'
import { 
  Droplets, 
  Zap, 
  CloudSun, 
  Eye,
  LayoutDashboard
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'

interface MobileNavBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onTogglePanel: () => void
}

const navTabs = [
  { id: 'overview', labelKey: 'nav.overview', icon: Eye },
  { id: 'flood', labelKey: 'nav.flood', icon: Droplets },
  { id: 'power', labelKey: 'nav.power', icon: Zap },
  { id: 'drought', labelKey: 'nav.drought', icon: CloudSun },
]

export default function MobileNavBar({ activeTab, onTabChange, onTogglePanel }: MobileNavBarProps) {
  const { t, language } = useLanguage()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[1000] safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {/* Dashboard Toggle */}
        <button
          onClick={onTogglePanel}
          className="flex flex-col items-center justify-center px-3 py-2"
        >
          <LayoutDashboard className="w-5 h-5 text-gray-500" />
          <span className="text-[10px] mt-1 text-gray-500">
            {language === 'th' ? 'แผงควบคุม' : 'Dashboard'}
          </span>
        </button>

        {/* Nav Tabs */}
        {navTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center px-3 py-2"
            >
              <Icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-primary-500" : "text-gray-500"
              )} />
              <span className={cn(
                "text-[10px] mt-1 transition-colors",
                isActive ? "text-primary-600 font-medium" : "text-gray-500"
              )}>
                {t(tab.labelKey)}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
