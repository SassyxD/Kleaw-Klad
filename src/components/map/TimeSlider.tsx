'use client'

import React from 'react'
import { 
  Clock,
  Play,
  Pause,
  SkipBack,
  SkipForward
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'

interface TimeSliderProps {
  value: number
  onChange: (value: number) => void
}

const timeStepsTh = [
  { value: 0, label: 'ปัจจุบัน', short: 'ปัจจุบัน' },
  { value: 1, label: '+30 นาที', short: '+30น.' },
  { value: 2, label: '+1 ชม.', short: '+1ชม.' },
  { value: 3, label: '+2 ชม.', short: '+2ชม.' },
  { value: 4, label: '+3 ชม.', short: '+3ชม.' },
  { value: 5, label: '+6 ชม.', short: '+6ชม.' },
]

const timeStepsEn = [
  { value: 0, label: 'Current', short: 'Now' },
  { value: 1, label: '+30 min', short: '+30m' },
  { value: 2, label: '+1 hr', short: '+1h' },
  { value: 3, label: '+2 hr', short: '+2h' },
  { value: 4, label: '+3 hr', short: '+3h' },
  { value: 5, label: '+6 hr', short: '+6h' },
]

export default function TimeSlider({ value, onChange }: TimeSliderProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const { language, t } = useLanguage()
  const timeSteps = language === 'th' ? timeStepsTh : timeStepsEn

  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        onChange((value + 1) % timeSteps.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isPlaying, value, onChange, timeSteps.length])

  return (
    <div className="bg-white rounded-xl shadow-card p-2 md:p-4">
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Time Label - Hidden on small mobile */}
        <div className="hidden sm:flex items-center space-x-2 min-w-[100px] md:min-w-[120px]">
          <Clock className="w-4 h-4 text-primary-500" />
          <span className="text-xs md:text-sm font-medium text-navy-800">
            {t('time.forecast')}:
          </span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-0.5 md:space-x-1">
          <button 
            onClick={() => onChange(0)}
            className="p-1 md:p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              "p-1.5 md:p-2 rounded-lg transition-colors",
              isPlaying ? "bg-primary-500 text-white" : "hover:bg-gray-100"
            )}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 md:w-4 md:h-4" />
            ) : (
              <Play className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
            )}
          </button>
          <button 
            onClick={() => onChange(timeSteps.length - 1)}
            className="p-1 md:p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
          </button>
        </div>

        {/* Timeline */}
        <div className="flex-1 relative">
          <div className="flex items-center justify-between relative">
            {/* Track */}
            <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full" />
            <div 
              className="absolute left-0 h-1 bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${(value / (timeSteps.length - 1)) * 100}%` }}
            />
            
            {/* Steps */}
            {timeSteps.map((step, index) => (
              <button
                key={step.value}
                onClick={() => onChange(index)}
                className="relative z-10 flex flex-col items-center"
              >
                <div 
                  className={cn(
                    "w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border-2 transition-all duration-200",
                    index <= value 
                      ? "bg-primary-500 border-primary-500" 
                      : "bg-white border-gray-300"
                  )}
                />
                <span className={cn(
                  "text-[9px] md:text-xs mt-1 md:mt-1.5 whitespace-nowrap transition-colors",
                  index === value ? "text-primary-600 font-medium" : "text-gray-500"
                )}>
                  <span className="hidden md:inline">{step.label}</span>
                  <span className="md:hidden">{step.short}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast Info - Hidden on mobile */}
      <div className="hidden md:flex mt-3 pt-3 border-t border-gray-100 items-center justify-between text-xs text-gray-500">
        <span>
          {language === 'th' 
            ? '📡 ข้อมูลดาวเทียม: 31 ธ.ค. 2568 10:30 UTC' 
            : '📡 Satellite Data: Dec 31, 2025 10:30 UTC'}
        </span>
        <span>
          {language === 'th' 
            ? '🤖 พยากรณ์โดย AI Ensemble Model' 
            : '🤖 Forecast by AI Ensemble Model'}
        </span>
      </div>
    </div>
  )
}
