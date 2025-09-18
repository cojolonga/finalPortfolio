'use client'

import { useState } from 'react'
import Image from 'next/image'

interface StepMedia {
  type: 'file' | 'url'
  src?: string
  href?: string
}

interface Step {
  n: number
  title?: string
  note?: string
  media: StepMedia | string
}

interface TimelineProps {
  steps: Step[]
}

export default function Timeline({ steps }: TimelineProps) {
  const [activeStep, setActiveStep] = useState(0)

  if (!steps || steps.length === 0) return null

  const currentStep = steps[activeStep]
  const currentMedia = typeof currentStep.media === 'string' 
    ? { type: 'file' as const, src: currentStep.media }
    : currentStep.media

  const renderMedia = () => {
    if (currentMedia.type === 'url' && currentMedia.href) {
      // Handle YouTube URLs
      if (currentMedia.href.includes('youtu')) {
        const videoId = currentMedia.href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
        if (videoId) {
          return (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full rounded-lg"
              allowFullScreen
              title={currentStep.title || `Step ${currentStep.n}`}
            />
          )
        }
      }
      
      // Handle other video URLs
      if (currentMedia.href.includes('.mp4') || currentMedia.href.includes('.webm')) {
        return (
          <video
            src={currentMedia.href}
            controls
            className="w-full h-full rounded-lg object-cover"
          />
        )
      }
      
      // Handle image URLs
      return (
        <img
          src={currentMedia.href}
          alt={currentStep.title || `Step ${currentStep.n}`}
          className="w-full h-full rounded-lg object-cover"
        />
      )
    }
    
    // Handle local files
    const src = currentMedia.src || (typeof currentStep.media === 'string' ? currentStep.media : '')
    
    if (src.includes('.mp4') || src.includes('.webm')) {
      return (
        <video
          src={src}
          controls
          className="w-full h-full rounded-lg object-cover"
        />
      )
    }
    
    return (
      <Image
        src={src}
        alt={currentStep.title || `Step ${currentStep.n}`}
        fill
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
      />
    )
  }

  return (
    <div className="w-full">
      {/* Media Display */}
      <div className="aspect-video bg-inferno-gray rounded-lg overflow-hidden mb-8 relative">
        {renderMedia()}
      </div>

      {/* Timeline Navigation */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.n} className="flex items-center">
              <button
                onClick={() => setActiveStep(index)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold transition-all ${
                  index === activeStep
                    ? 'bg-inferno-accent border-inferno-accent text-white'
                    : 'border-inferno-gray-light text-inferno-fg hover:border-inferno-accent'
                }`}
              >
                {step.n}
              </button>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  index < activeStep ? 'bg-inferno-accent' : 'bg-inferno-gray-light'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Info */}
      <div className="text-center">
        <h3 className="text-xl font-cinzel font-semibold mb-2">
          {currentStep.title || `Step ${currentStep.n}`}
        </h3>
        {currentStep.note && (
          <p className="text-inferno-fg/70 max-w-2xl mx-auto">
            {currentStep.note}
          </p>
        )}
      </div>
    </div>
  )
}
