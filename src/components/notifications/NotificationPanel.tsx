'use client'

import React, { useRef, useEffect } from 'react'
import { 
  X, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle,
  Bell,
  Check,
  Trash2
} from 'lucide-react'
import { useNotifications } from '@/context/NotificationContext'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

const typeIcons = {
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
  success: CheckCircle,
}

const typeColors = {
  warning: 'text-amber-500 bg-amber-50',
  danger: 'text-red-500 bg-red-50',
  info: 'text-blue-500 bg-blue-50',
  success: 'text-green-500 bg-green-50',
}

function formatTimeAgo(date: Date, language: 'th' | 'en'): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) {
    return language === 'th' ? 'เมื่อสักครู่' : 'Just now'
  } else if (diffMins < 60) {
    return language === 'th' ? `${diffMins} นาทีที่แล้ว` : `${diffMins} min ago`
  } else if (diffHours < 24) {
    return language === 'th' ? `${diffHours} ชั่วโมงที่แล้ว` : `${diffHours} hr ago`
  } else {
    return language === 'th' ? `${diffDays} วันที่แล้ว` : `${diffDays} day ago`
  }
}

export default function NotificationPanel() {
  const { 
    notifications, 
    showNotificationPanel, 
    setShowNotificationPanel,
    markAsRead,
    markAllAsRead,
    removeNotification,
    unreadCount
  } = useNotifications()
  const { language, t } = useLanguage()
  const panelRef = useRef<HTMLDivElement>(null)

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowNotificationPanel(false)
      }
    }

    if (showNotificationPanel) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotificationPanel, setShowNotificationPanel])

  if (!showNotificationPanel) return null

  return (
    <div 
      ref={panelRef}
      className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">{t('notification.title')}</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={markAllAsRead}
            className="p-1.5 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
            title={t('notification.markAllRead')}
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowNotificationPanel(false)}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Bell className="w-12 h-12 mb-3 opacity-50" />
            <p>{t('notification.empty')}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((notification) => {
              const Icon = typeIcons[notification.type]
              return (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    "flex gap-3 p-4 cursor-pointer transition-colors hover:bg-gray-50",
                    !notification.read && "bg-blue-50/50"
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
                    typeColors[notification.type]
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-gray-900 text-sm leading-tight">
                        {language === 'th' ? notification.title : notification.titleEn}
                      </p>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {language === 'th' ? notification.message : notification.messageEn}
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {formatTimeAgo(notification.timestamp, language)}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeNotification(notification.id)
                    }}
                    className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <button className="w-full text-center text-sm text-primary-500 hover:text-primary-600 font-medium">
            {language === 'th' ? 'ดูทั้งหมด' : 'View all'}
          </button>
        </div>
      )}
    </div>
  )
}
