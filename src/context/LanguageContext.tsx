'use client'

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

type Language = 'th' | 'en'

interface Translations {
  [key: string]: {
    th: string
    en: string
  }
}

// Comprehensive translations
const translations: Translations = {
  // Header Navigation
  'nav.overview': { th: 'ภาพรวม', en: 'Overview' },
  'nav.flood': { th: 'น้ำท่วม', en: 'Flood' },
  'nav.power': { th: 'ไฟฟ้า', en: 'Power' },
  'nav.drought': { th: 'ภัยแล้ง', en: 'Drought' },
  
  // Auth
  'auth.login': { th: 'เข้าสู่ระบบ', en: 'Login' },
  'auth.logout': { th: 'ออกจากระบบ', en: 'Logout' },
  'auth.loginButton': { th: 'เข้าสู่ระบบ / Login', en: 'Login / เข้าสู่ระบบ' },
  'auth.welcome': { th: 'ยินดีต้อนรับ', en: 'Welcome' },
  'auth.loginSuccess': { th: 'เข้าสู่ระบบสำเร็จ', en: 'Login successful' },
  'auth.logoutSuccess': { th: 'ออกจากระบบแล้ว', en: 'Logged out successfully' },
  
  // Scenario Card
  'scenario.title': { th: 'สถานการณ์จำลองน้ำท่วม', en: 'Flood Scenario Simulation' },
  'scenario.area': { th: 'พื้นที่', en: 'Area' },
  'scenario.allCountry': { th: 'ทั้งประเทศ', en: 'Nationwide' },
  'scenario.hatYai': { th: 'หาดใหญ่', en: 'Hat Yai' },
  'scenario.uTapao': { th: 'ลุ่มน้ำอู่ตะเภา', en: 'U-Tapao Basin' },
  'scenario.today': { th: 'วันนี้', en: 'Today' },
  'scenario.3days': { th: '3 วัน', en: '3 Days' },
  'scenario.7days': { th: '7 วัน', en: '7 Days' },
  'scenario.30days': { th: '30 วัน', en: '30 Days' },
  'scenario.dataSource': { th: 'ข้อมูลจาก', en: 'Data from' },
  
  // Flood Area Card
  'flood.title': { th: 'พื้นที่น้ำท่วมทั้งหมด', en: 'Total Flooded Area' },
  'flood.unit': { th: 'ไร่', en: 'Rai' },
  'flood.topAffected': { th: 'พื้นที่ที่ได้รับผลกระทบสูงสุด', en: 'Most Affected Areas' },
  'flood.historical': { th: 'เทียบกับปีก่อน', en: 'vs Previous Year' },
  'flood.current': { th: 'ปัจจุบัน', en: 'Current' },
  
  // Facilities Card
  'facilities.title': { th: 'โครงสร้างพื้นฐานที่ได้รับผลกระทบ', en: 'Affected Infrastructure' },
  'facilities.hospital': { th: 'โรงพยาบาล', en: 'Hospitals' },
  'facilities.power': { th: 'สถานีไฟฟ้า', en: 'Power Stations' },
  'facilities.school': { th: 'โรงเรียน', en: 'Schools' },
  'facilities.shelter': { th: 'ศูนย์พักพิง', en: 'Shelters' },
  'facilities.analysis': { th: 'วิเคราะห์ด้วย MindSpore GNN (Hydraulic-Aware Graph)', en: 'Analyzed with MindSpore GNN (Hydraulic-Aware Graph)' },
  
  // Evacuation Card
  'evacuation.title': { th: 'สถานะการอพยพและเส้นทาง', en: 'Evacuation Status & Routes' },
  'evacuation.normal': { th: 'ปกติ', en: 'Normal' },
  'evacuation.atRisk': { th: 'เสี่ยงน้ำท่วม', en: 'Flood Risk' },
  'evacuation.closed': { th: 'ปิดชั่วคราว', en: 'Temporarily Closed' },
  'evacuation.source': { th: 'เส้นทางจาก RL Policy (PPO)', en: 'Routes from RL Policy (PPO)' },
  
  // System Status Card
  'system.title': { th: 'สถานะระบบ AI', en: 'AI System Status' },
  'system.lastUpdate': { th: 'อัปเดตล่าสุด', en: 'Last Updated' },
  'system.inference': { th: 'เวลา Inference', en: 'Inference Time' },
  'system.accuracy': { th: 'ความแม่นยำ Segmentation', en: 'Segmentation Accuracy' },
  'system.online': { th: 'ออนไลน์', en: 'Online' },
  'system.processing': { th: 'กำลังประมวลผล', en: 'Processing' },
  'system.offline': { th: 'ออฟไลน์', en: 'Offline' },
  
  // Map
  'map.loading': { th: 'กำลังโหลดแผนที่...', en: 'Loading map...' },
  'map.floodExtent': { th: 'ชั้นข้อมูลน้ำท่วม', en: 'Flood Extent' },
  'map.evacuationRoutes': { th: 'เส้นทางอพยพแนะนำ', en: 'Evacuation Routes' },
  'map.facilities': { th: 'จุดสำคัญ', en: 'Critical Facilities' },
  'map.sensors': { th: 'เซ็นเซอร์ IoT', en: 'IoT Sensors' },
  'map.waterDepth': { th: 'ระดับน้ำ', en: 'Water Depth' },
  'map.high': { th: 'สูง', en: 'High' },
  'map.medium': { th: 'ปานกลาง', en: 'Medium' },
  'map.low': { th: 'ต่ำ', en: 'Low' },
  
  // Time Slider
  'time.current': { th: 'ปัจจุบัน', en: 'Current' },
  'time.forecast': { th: 'พยากรณ์', en: 'Forecast' },
  'time.minutes': { th: 'นาที', en: 'min' },
  'time.hours': { th: 'ชม.', en: 'hr' },
  
  // Basemap
  'basemap.title': { th: 'แผนที่ฐาน', en: 'Base Map' },
  'basemap.light': { th: 'สว่าง', en: 'Light' },
  'basemap.dark': { th: 'มืด', en: 'Dark' },
  'basemap.satellite': { th: 'ดาวเทียม', en: 'Satellite' },
  'basemap.terrain': { th: 'ภูมิประเทศ', en: 'Terrain' },
  'basemap.streets': { th: 'ถนน', en: 'Streets' },
  
  // Legend
  'legend.title': { th: 'คำอธิบายสัญลักษณ์', en: 'Legend' },
  'legend.deepWater': { th: 'น้ำลึก (>1 ม.)', en: 'Deep Water (>1m)' },
  'legend.mediumWater': { th: 'น้ำปานกลาง (0.5-1 ม.)', en: 'Medium Water (0.5-1m)' },
  'legend.shallowWater': { th: 'น้ำตื้น (<0.5 ม.)', en: 'Shallow Water (<0.5m)' },
  'legend.hospital': { th: 'โรงพยาบาล', en: 'Hospital' },
  'legend.shelter': { th: 'ศูนย์พักพิง', en: 'Shelter' },
  'legend.routeSafe': { th: 'เส้นทางปลอดภัย', en: 'Safe Route' },
  'legend.routeRisk': { th: 'เส้นทางเสี่ยง', en: 'Risk Route' },
  
  // Notifications
  'notification.title': { th: 'การแจ้งเตือน', en: 'Notifications' },
  'notification.markAllRead': { th: 'อ่านทั้งหมด', en: 'Mark all as read' },
  'notification.empty': { th: 'ไม่มีการแจ้งเตือน', en: 'No notifications' },
  'notification.new': { th: 'ใหม่', en: 'New' },
  
  // Analytics Panel
  'cards.analytics': { th: 'การวิเคราะห์', en: 'Analytics' },
  
  // Common
  'common.close': { th: 'ปิด', en: 'Close' },
  'common.cancel': { th: 'ยกเลิก', en: 'Cancel' },
  'common.confirm': { th: 'ยืนยัน', en: 'Confirm' },
  'common.save': { th: 'บันทึก', en: 'Save' },
  'common.search': { th: 'ค้นหา', en: 'Search' },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('th')

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'th' ? 'en' : 'th')
  }, [])

  const t = useCallback((key: string): string => {
    const translation = translations[key]
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
    return translation[language]
  }, [language])

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
