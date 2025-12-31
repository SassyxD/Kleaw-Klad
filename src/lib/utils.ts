import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number, locale: string = 'th-TH'): string {
  return new Intl.NumberFormat(locale).format(num)
}

export function formatArea(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)} ล้านไร่`
  }
  if (num >= 1000) {
    return `${formatNumber(num)} ไร่`
  }
  return `${num} ไร่`
}

export function getRiskColor(level: string): string {
  switch (level) {
    case 'critical':
      return 'bg-danger-500'
    case 'high':
      return 'bg-warning-500'
    case 'medium':
      return 'bg-warning-300'
    case 'low':
      return 'bg-success-500'
    default:
      return 'bg-gray-400'
  }
}

export function getRiskTextColor(level: string): string {
  switch (level) {
    case 'critical':
      return 'text-danger-600'
    case 'high':
      return 'text-warning-600'
    case 'medium':
      return 'text-warning-500'
    case 'low':
      return 'text-success-600'
    default:
      return 'text-gray-500'
  }
}

export function getStatusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case 'open':
    case 'normal':
      return { bg: 'bg-success-100', text: 'text-success-700' }
    case 'at_risk':
      return { bg: 'bg-warning-100', text: 'text-warning-700' }
    case 'closed':
    case 'affected':
      return { bg: 'bg-danger-100', text: 'text-danger-700' }
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700' }
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'open':
      return 'ปกติ'
    case 'normal':
      return 'ปกติ'
    case 'at_risk':
      return 'เสี่ยงน้ำท่วม'
    case 'closed':
      return 'ปิดชั่วคราว'
    case 'affected':
      return 'ได้รับผลกระทบ'
    default:
      return status
  }
}

export function getTrendIcon(trend: string): string {
  switch (trend) {
    case 'increasing':
      return '↑'
    case 'decreasing':
      return '↓'
    case 'stable':
      return '→'
    default:
      return ''
  }
}

export function getTrendColor(trend: string): string {
  switch (trend) {
    case 'increasing':
      return 'text-danger-500'
    case 'decreasing':
      return 'text-success-500'
    case 'stable':
      return 'text-gray-500'
    default:
      return 'text-gray-500'
  }
}
