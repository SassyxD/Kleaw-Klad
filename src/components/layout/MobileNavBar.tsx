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
  const { t, language, isTransitioning } = useLanguage()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[1000] safe-area-bottom slide-in-up">
      <div className="flex items-center justify-around h-16">
        {/* Dashboard Toggle */}
        <button
          onClick={onTogglePanel}
          className="flex flex-col items-center justify-center px-3 py-2 btn-press transition-all duration-200 active:scale-95"
        >
          <LayoutDashboard className="w-5 h-5 text-gray-500 transition-transform duration-200 hover:scale-110" />
          <span className={cn(
            "text-[10px] mt-1 text-gray-500 transition-all duration-200",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}>
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
              className="flex flex-col items-center justify-center px-3 py-2 btn-press transition-all duration-200 active:scale-95 relative"
            >
              {/* Active Indicator */}
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-500 rounded-full transition-all duration-300" />
              )}
              <Icon className={cn(
                "w-5 h-5 transition-all duration-300",
                isActive ? "text-primary-500 scale-110" : "text-gray-500"
              )} />
              <span className={cn(
                "text-[10px] mt-1 transition-all duration-200",
                isActive ? "text-primary-600 font-medium" : "text-gray-500",
                isTransitioning ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"
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
