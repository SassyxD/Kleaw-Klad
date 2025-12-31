'use client'

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

type NotificationType = 'warning' | 'danger' | 'info' | 'success'

interface Notification {
  id: string
  type: NotificationType
  title: string
  titleEn: string
  message: string
  messageEn: string
  timestamp: Date
  read: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  showNotificationPanel: boolean
  setShowNotificationPanel: (show: boolean) => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Initial mock notifications
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'danger',
    title: 'แจ้งเตือนน้ำท่วมฉุกเฉิน',
    titleEn: 'Emergency Flood Alert',
    message: 'ระดับน้ำในพื้นที่คลองแหเพิ่มสูงขึ้น 30 ซม. ในช่วง 1 ชั่วโมงที่ผ่านมา',
    messageEn: 'Water level in Khlong Hae area increased by 30cm in the past hour',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'เส้นทางอพยพเปลี่ยนสถานะ',
    titleEn: 'Evacuation Route Status Changed',
    message: 'เส้นทาง C - ถนนกลาง เปลี่ยนสถานะเป็น "ปิดชั่วคราว"',
    messageEn: 'Route C - Central Road changed status to "Temporarily Closed"',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'อัปเดตข้อมูลดาวเทียม',
    titleEn: 'Satellite Data Updated',
    message: 'ได้รับข้อมูลใหม่จาก Sentinel-1 และ Sentinel-2 เรียบร้อยแล้ว',
    messageEn: 'Received new data from Sentinel-1 and Sentinel-2 successfully',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
  },
  {
    id: '4',
    type: 'success',
    title: 'โมเดล AI อัปเดตสำเร็จ',
    titleEn: 'AI Model Updated Successfully',
    message: 'โมเดล GNN Risk Propagation ได้รับการอัปเดตด้วยข้อมูลล่าสุด',
    messageEn: 'GNN Risk Propagation model updated with latest data',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    read: true,
  },
  {
    id: '5',
    type: 'warning',
    title: 'โรงพยาบาลเสี่ยงได้รับผลกระทบ',
    titleEn: 'Hospital at Risk',
    message: 'โรงพยาบาลสงขลานครินทร์อยู่ในพื้นที่เสี่ยงน้ำท่วม',
    messageEn: 'Songkhlanakarin Hospital is in flood risk area',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    read: true,
  },
]

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [showNotificationPanel, setShowNotificationPanel] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }
    setNotifications(prev => [newNotification, ...prev])
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    showNotificationPanel,
    setShowNotificationPanel,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
