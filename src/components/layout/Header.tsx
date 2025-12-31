'use client'

import React from 'react'
import { 
  Droplets, 
  Zap, 
  CloudSun, 
  Eye,
  Globe,
  Bell,
  User,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navTabs = [
  { id: 'overview', label: 'ภาพรวม', labelEn: 'Overview', icon: Eye },
  { id: 'flood', label: 'น้ำท่วม', labelEn: 'Flood', icon: Droplets },
  { id: 'power', label: 'ไฟฟ้า', labelEn: 'Power', icon: Zap },
  { id: 'drought', label: 'ภัยแล้ง', labelEn: 'Drought', icon: CloudSun },
]

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-navy-900 text-white h-14 flex items-center justify-between px-4 flex-shrink-0 shadow-lg z-50">
      {/* Left - Logo & Brand */}
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-tight">Klaew Klad</span>
            <span className="text-[10px] text-gray-400 leading-tight">Hat Yai Flood Digital Twin</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 ml-8">
          {navTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-300 hover:bg-navy-800 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center space-x-3">
        {/* Language Selector */}
        <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:bg-navy-800 hover:text-white transition-colors">
          <Globe className="w-4 h-4" />
          <span>TH</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-gray-300 hover:bg-navy-800 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full animate-pulse" />
        </button>

        {/* User Avatar */}
        <button className="p-2 rounded-lg text-gray-300 hover:bg-navy-800 hover:text-white transition-colors">
          <User className="w-5 h-5" />
        </button>

        {/* Login Button */}
        <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md">
          เข้าสู่ระบบ / Login
        </button>
      </div>
    </header>
  )
}
