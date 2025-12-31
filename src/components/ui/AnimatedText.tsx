'use client'

import React from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

interface AnimatedTextProps {
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export default function AnimatedText({ 
  children, 
  className = '',
  as: Component = 'span'
}: AnimatedTextProps) {
  const { isTransitioning } = useLanguage()

  return (
    <Component 
      className={cn(
        'transition-all duration-200 ease-out inline-block',
        isTransitioning ? 'opacity-0 transform -translate-y-1' : 'opacity-100 transform translate-y-0',
        className
      )}
    >
      {children}
    </Component>
  )
}

// Hook for animated number display
export function useAnimatedNumber(value: number, duration: number = 500): number {
  const [displayValue, setDisplayValue] = React.useState(value)
  const previousValueRef = React.useRef(value)

  React.useEffect(() => {
    if (previousValueRef.current === value) return

    const startValue = previousValueRef.current
    const diff = value - startValue
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3)
      
      setDisplayValue(Math.round(startValue + diff * eased))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        previousValueRef.current = value
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return displayValue
}

// Animated counter component
interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  formatter?: (value: number) => string
}

export function AnimatedCounter({ 
  value, 
  duration = 500, 
  className = '',
  formatter = (v) => v.toLocaleString()
}: AnimatedCounterProps) {
  const displayValue = useAnimatedNumber(value, duration)
  const { isTransitioning } = useLanguage()

  return (
    <span 
      className={cn(
        'transition-all duration-200 inline-block tabular-nums',
        isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100',
        className
      )}
    >
      {formatter(displayValue)}
    </span>
  )
}
