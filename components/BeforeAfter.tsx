'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface BeforeAfterProps {
  before: string
  after: string
  alt?: string
}

export default function BeforeAfter({ before, after, alt = 'Before and after comparison' }: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [aspectRatio, setAspectRatio] = useState('16/9')
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    // Load the after image to get its dimensions
    const img = new window.Image()
    img.onload = () => {
      const ratio = img.width / img.height
      setAspectRatio(`${ratio}`)
    }
    img.src = after
  }, [after])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    document.addEventListener('mouseup', handleGlobalMouseUp)
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  return (
    <div 
      className="relative w-full bg-black rounded-lg overflow-hidden max-h-[70vh] before-after-slider select-none"
      style={{ aspectRatio }}
    >
      {/* Blurred background - After */}
      <div className="absolute inset-0">
        <Image
          src={after}
          alt={`${alt} - after background`}
          fill
          className="object-cover blur-md opacity-30"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Blurred background - Before (clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={before}
          alt={`${alt} - before background`}
          fill
          className="object-cover blur-md opacity-30"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* After image (main) */}
      <div className="absolute inset-0">
        <Image
          src={after}
          alt={`${alt} - after`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {/* Before image (main, clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={before}
          alt={`${alt} - before`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {/* Vertical slider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/30 pointer-events-none z-5"
        style={{ left: `${sliderPosition}%` }}
      ></div>

      {/* Minimal floating slider handle */}
      <div
        className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-8 h-8 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-md flex items-center justify-center hover:bg-white/80 transition-colors">
          <div className="w-1 h-1 bg-white/80 rounded-full"></div>
        </div>
      </div>
      
      {/* Interactive overlay */}
      <div
        className="absolute inset-0 cursor-col-resize z-20"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      
      {/* Labels - positioned in the actual blurred background areas */}
      <div className="absolute top-1/2 left-0 w-1/5 flex items-center justify-center pointer-events-none transform -translate-y-1/2 ml-1 md:ml-2">
        <div 
          className="px-2 py-1 md:px-6 md:py-3 rounded text-sm md:text-3xl font-bold select-none transition-all duration-300"
          style={{
            backgroundColor: `rgba(0, 0, 0, 0.8)`,
            color: `rgb(${255 - (sliderPosition / 100 * 187)}, ${68 + (sliderPosition / 100 * 187)}, 68)`,
            boxShadow: `0 0 ${10 + (sliderPosition / 100 * 15)}px rgba(${255 - (sliderPosition / 100 * 187)}, ${68 + (sliderPosition / 100 * 187)}, 68, ${0.2 + (sliderPosition / 100 * 0.4)})`,
            transform: `scale(${1 + (sliderPosition / 100 * 0.1)})`
          }}
        >
          BEFORE
        </div>
      </div>
      <div className="absolute top-1/2 right-0 w-1/5 flex items-center justify-center pointer-events-none transform -translate-y-1/2 mr-1 md:mr-2">
        <div 
          className="px-2 py-1 md:px-6 md:py-3 rounded text-sm md:text-3xl font-bold select-none transition-all duration-300"
          style={{
            backgroundColor: `rgba(0, 0, 0, 0.8)`,
            color: `rgb(${255 - ((100 - sliderPosition) / 100 * 187)}, ${68 + ((100 - sliderPosition) / 100 * 187)}, 68)`,
            boxShadow: `0 0 ${10 + ((100 - sliderPosition) / 100 * 15)}px rgba(${255 - ((100 - sliderPosition) / 100 * 187)}, ${68 + ((100 - sliderPosition) / 100 * 187)}, 68, ${0.2 + ((100 - sliderPosition) / 100 * 0.4)})`,
            transform: `scale(${1 + ((100 - sliderPosition) / 100 * 0.1)})`
          }}
        >
          AFTER
        </div>
      </div>
    </div>
  )
}
