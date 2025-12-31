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

interface TimeSliderProps {
  value: number
  onChange: (value: number) => void
}

const timeSteps = [
  { value: 0, label: 'ปัจจุบัน' },
  { value: 1, label: '+30 นาที' },
  { value: 2, label: '+1 ชม.' },
  { value: 3, label: '+2 ชม.' },
  { value: 4, label: '+3 ชม.' },
  { value: 5, label: '+6 ชม.' },
]

export default function TimeSlider({ value, onChange }: TimeSliderProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)

  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        onChange((value + 1) % timeSteps.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isPlaying, value, onChange])

  return (
    <div className="bg-white rounded-xl shadow-card p-4">
      <div className="flex items-center space-x-4">
        {/* Time Label */}
        <div className="flex items-center space-x-2 min-w-[120px]">
          <Clock className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-medium text-navy-800">พยากรณ์:</span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => onChange(0)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SkipBack className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isPlaying ? "bg-primary-500 text-white" : "hover:bg-gray-100"
            )}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 text-gray-600" />
            )}
          </button>
          <button 
            onClick={() => onChange(timeSteps.length - 1)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SkipForward className="w-4 h-4 text-gray-600" />
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
                    "w-3 h-3 rounded-full border-2 transition-all duration-200",
                    index <= value 
                      ? "bg-primary-500 border-primary-500" 
                      : "bg-white border-gray-300"
                  )}
                />
                <span className={cn(
                  "text-xs mt-1.5 whitespace-nowrap transition-colors",
                  index === value ? "text-primary-600 font-medium" : "text-gray-500"
                )}>
                  {step.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast Info */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>📡 ข้อมูลดาวเทียม: 31 ธ.ค. 2568 10:30 UTC</span>
        <span>🤖 พยากรณ์โดย AI Ensemble Model</span>
      </div>
    </div>
  )
}
