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
  ChevronDown,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationContext'
import NotificationPanel from '@/components/notifications/NotificationPanel'

interface HeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onToggleMobilePanel?: () => void
  showMobilePanel?: boolean
}

const navTabs = [
  { id: 'overview', labelKey: 'nav.overview', icon: Eye },
  { id: 'flood', labelKey: 'nav.flood', icon: Droplets },
  { id: 'power', labelKey: 'nav.power', icon: Zap },
  { id: 'drought', labelKey: 'nav.drought', icon: CloudSun },
]

export default function Header({ activeTab, onTabChange, onToggleMobilePanel, showMobilePanel }: HeaderProps) {
  const { language, toggleLanguage, t } = useLanguage()
  const { user, isAuthenticated, logout, setShowLoginModal } = useAuth()
  const { unreadCount, showNotificationPanel, setShowNotificationPanel } = useNotifications()

  return (
    <header className="bg-navy-900 text-white h-14 flex items-center justify-between px-3 md:px-4 flex-shrink-0 shadow-lg z-50">
      {/* Left - Logo & Brand */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Mobile Menu Button */}
        <button 
          onClick={onToggleMobilePanel}
          className="lg:hidden p-2 -ml-1 rounded-lg text-gray-300 hover:bg-navy-800 hover:text-white transition-colors"
        >
          {showMobilePanel ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
            <Droplets className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-semibold text-sm leading-tight">Klaew Klad</span>
            <span className="text-[10px] text-gray-400 leading-tight hidden md:block">Hat Yai Flood Digital Twin</span>
          </div>
        </div>

        {/* Navigation Tabs - Desktop Only */}
        <nav className="hidden lg:flex items-center space-x-1 ml-8">
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
                <span>{t(tab.labelKey)}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center space-x-1 md:space-x-3">
        {/* Language Selector */}
        <button 
          onClick={toggleLanguage}
          className="flex items-center space-x-1 px-2 md:px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:bg-navy-800 hover:text-white transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span className="font-medium hidden sm:inline">{language.toUpperCase()}</span>
          <ChevronDown className="w-3 h-3 hidden sm:block" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            className={cn(
              "relative p-2 rounded-lg transition-colors",
              showNotificationPanel 
                ? "bg-navy-800 text-white" 
                : "text-gray-300 hover:bg-navy-800 hover:text-white"
            )}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-danger-500 text-white rounded-full px-1 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* Notification Panel */}
          <NotificationPanel />
        </div>

        {/* User Section */}
        {isAuthenticated && user ? (
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* User Info - Desktop */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-navy-800">
              <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white leading-tight">{user.name}</span>
                <span className="text-[10px] text-gray-400 leading-tight capitalize">{user.role}</span>
              </div>
            </div>

            {/* User Icon - Mobile */}
            <div className="md:hidden p-2 rounded-lg bg-navy-800">
              <User className="w-5 h-5 text-white" />
            </div>
            
            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
              title={t('auth.logout')}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            {/* Login Button */}
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors shadow-md"
            >
              <span className="hidden sm:inline">{t('auth.loginButton')}</span>
              <span className="sm:hidden">{language === 'th' ? 'เข้าสู่ระบบ' : 'Login'}</span>
            </button>
          </>
        )}
      </div>
    </header>
  )
}
