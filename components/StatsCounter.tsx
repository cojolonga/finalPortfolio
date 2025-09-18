'use client'

import { useEffect, useState, useRef } from 'react'

interface StatItem {
  value: number
  suffix: string
  label: string
}

const stats: StatItem[] = [
  { value: 53, suffix: '+', label: 'PROJECTS' },
  { value: 100, suffix: '%', label: 'QUALITY' },
  { value: 5, suffix: '★', label: 'RATING' }
]

export default function StatsCounter() {
  const [counts, setCounts] = useState(stats.map(() => 0))
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [isVisible])

  useEffect(() => {
    if (isVisible) {
      stats.forEach((stat, index) => {
        const duration = 2000 // 2 seconds
        const steps = 60
        const stepValue = stat.value / steps
        let currentStep = 0

        const interval = setInterval(() => {
          currentStep++
          setCounts(prev => {
            const newCounts = [...prev]
            newCounts[index] = Math.min(Math.floor(stepValue * currentStep), stat.value)
            return newCounts
          })

          if (currentStep >= steps) {
            clearInterval(interval)
          }
        }, duration / steps)

        return () => clearInterval(interval)
      })
    }
  }, [isVisible])

  return (
    <div 
      ref={ref}
      className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16"
      style={{ marginBottom: '0px' }}
    >
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-4xl md:text-5xl font-bold text-criforge-accent mb-2">
            {counts[index]}{stat.suffix}
          </div>
          <div className="text-sm md:text-base text-criforge-text-secondary uppercase tracking-wider">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
