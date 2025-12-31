'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import AnalyticsPanel from '@/components/panels/AnalyticsPanel'
import MapPanel from '@/components/map/MapPanel'
import TimeSlider from '@/components/map/TimeSlider'
import LoginModal from '@/components/auth/LoginModal'
import MobileNavBar from '@/components/layout/MobileNavBar'
import { DashboardProvider } from '@/context/DashboardContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { AuthProvider } from '@/context/AuthContext'
import { NotificationProvider } from '@/context/NotificationContext'

export default function Home() {
  const [activeTab, setActiveTab] = useState('flood')
  const [currentTime, setCurrentTime] = useState(0)
  const [showMobilePanel, setShowMobilePanel] = useState(false)

  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <DashboardProvider>
            <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
              {/* Top Header */}
              <Header 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
                onToggleMobilePanel={() => setShowMobilePanel(!showMobilePanel)}
                showMobilePanel={showMobilePanel}
              />

              {/* Main Content */}
              <div className="flex flex-1 overflow-hidden relative">
                {/* Left Analytics Panel - Hidden on mobile, shown as overlay */}
                <div className={`
                  absolute lg:relative inset-0 lg:inset-auto z-[900] lg:z-auto
                  w-full lg:w-[420px] flex-shrink-0 overflow-y-auto bg-gray-50 border-r border-gray-200
                  transform transition-transform duration-300 ease-in-out
                  ${showMobilePanel ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                  <AnalyticsPanel activeTab={activeTab} onClose={() => setShowMobilePanel(false)} />
                </div>

                {/* Mobile Panel Backdrop */}
                {showMobilePanel && (
                  <div 
                    className="absolute inset-0 bg-black/50 z-[850] lg:hidden"
                    onClick={() => setShowMobilePanel(false)}
                  />
                )}

                {/* Right Map Panel */}
                <div className="flex-1 relative">
                  <MapPanel />
                  
                  {/* Time Slider Overlay */}
                  <div className="absolute bottom-20 md:bottom-6 left-2 right-2 md:left-6 md:right-56 lg:right-60 z-[800]">
                    <TimeSlider 
                      value={currentTime} 
                      onChange={setCurrentTime} 
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Bottom Navigation */}
              <MobileNavBar 
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onTogglePanel={() => setShowMobilePanel(!showMobilePanel)}
              />

              {/* Login Modal */}
              <LoginModal />
            </div>
          </DashboardProvider>
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
