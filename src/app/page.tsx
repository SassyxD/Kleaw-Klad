'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import AnalyticsPanel from '@/components/panels/AnalyticsPanel'
import MapPanel from '@/components/map/MapPanel'
import TimeSlider from '@/components/map/TimeSlider'
import LoginModal from '@/components/auth/LoginModal'
import { DashboardProvider } from '@/context/DashboardContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { AuthProvider } from '@/context/AuthContext'
import { NotificationProvider } from '@/context/NotificationContext'

export default function Home() {
  const [activeTab, setActiveTab] = useState('flood')
  const [currentTime, setCurrentTime] = useState(0)

  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <DashboardProvider>
            <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
              {/* Top Header */}
              <Header activeTab={activeTab} onTabChange={setActiveTab} />

              {/* Main Content */}
              <div className="flex flex-1 overflow-hidden">
                {/* Left Analytics Panel */}
                <div className="w-[420px] flex-shrink-0 overflow-y-auto bg-gray-50 border-r border-gray-200">
                  <AnalyticsPanel activeTab={activeTab} />
                </div>

                {/* Right Map Panel */}
                <div className="flex-1 relative">
                  <MapPanel />
                  
                  {/* Time Slider Overlay */}
                  <div className="absolute bottom-6 left-6 right-20 z-[1000]">
                    <TimeSlider 
                      value={currentTime} 
                      onChange={setCurrentTime} 
                    />
                  </div>
                </div>
              </div>

              {/* Login Modal */}
              <LoginModal />
            </div>
          </DashboardProvider>
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
