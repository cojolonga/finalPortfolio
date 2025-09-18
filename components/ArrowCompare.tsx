'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Lightbox from './Lightbox'

interface ArrowCompareProps {
  sources: string[]
  final: string | string[]
  alt?: string
  timeline?: Array<{
    n: number
    label: string
    media: { type: string; src?: string; href?: string }
  }>
}

export default function ArrowCompare({ sources, final, alt = 'Edit comparison', timeline = [] }: ArrowCompareProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [finalAspectRatio, setFinalAspectRatio] = useState('16/9')
  const [selectedTimelineStep, setSelectedTimelineStep] = useState<number | null>(null)
  
  const finalImages = Array.isArray(final) ? final : [final]

  useEffect(() => {
    // Load the first final image to get its dimensions
    const firstFinal = Array.isArray(final) ? final[0] : final
    const img = new window.Image()
    img.onload = () => {
      const ratio = img.width / img.height
      setFinalAspectRatio(`${ratio}`)
    }
    img.src = firstFinal
  }, [final])

  const openLightbox = (images: string[], startIndex: number = 0) => {
    setLightboxImages(images)
    setLightboxIndex(startIndex)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Sources */}
        <div className="lg:col-span-4 self-stretch flex flex-col justify-center">
          <h3 className="text-lg font-cinzel font-semibold mb-4 text-criforge-accent">
            Sources
          </h3>
          <div className="space-y-4">
            {sources.length === 1 ? (
              /* Single source - match final image size */
              <div className="flex justify-center">
                <div 
                  className="relative w-full bg-criforge-bg-card rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-criforge-accent transition-all max-h-[40vh]"
                  style={{ aspectRatio: finalAspectRatio }}
                  onClick={() => openLightbox(sources, 0)}
                >
                  {/* Blurred background */}
                  <Image
                    src={sources[0]}
                    alt=""
                    fill
                    className="object-cover blur-md opacity-30"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Main image */}
                  <Image
                    src={sources[0]}
                    alt={`${alt} source`}
                    fill
                    className="object-contain hover:scale-105 transition-transform relative z-10"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            ) : sources.length === 2 ? (
              /* Two sources - side by side, same size as final */
              <div className="space-y-4">
                {sources.map((source, index) => (
                  <div 
                    key={index}
                    className="relative w-full bg-criforge-bg-card rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-criforge-accent transition-all max-h-[40vh]"
                    style={{ aspectRatio: finalAspectRatio }}
                    onClick={() => openLightbox(sources, index)}
                  >
                    {/* Blurred background */}
                    <Image
                      src={source}
                      alt=""
                      fill
                      className="object-cover blur-md opacity-30"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Main image */}
                    <Image
                      src={source}
                      alt={`${alt} source ${index + 1}`}
                      fill
                      className="object-contain hover:scale-105 transition-transform relative z-10"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            ) : sources.length === 3 ? (
              /* Three sources - triangle layout: 1 top, 2 bottom */
              <div className="space-y-4">
                {/* Top image */}
                <div className="flex justify-center">
                  <div 
                    className="relative w-full bg-criforge-bg-card rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-criforge-accent transition-all max-h-[40vh]"
                    style={{ aspectRatio: finalAspectRatio }}
                    onClick={() => openLightbox(sources, 0)}
                  >
                    {/* Blurred background */}
                    <Image
                      src={sources[0]}
                      alt=""
                      fill
                      className="object-cover blur-md opacity-30"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Main image */}
                    <Image
                      src={sources[0]}
                      alt={`${alt} source 1`}
                      fill
                      className="object-contain hover:scale-105 transition-transform relative z-10"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                {/* Bottom two images */}
                <div className="space-y-4">
                  {sources.slice(1, 3).map((source, index) => (
                    <div 
                      key={index + 1}
                      className="relative w-full bg-criforge-bg-card rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-criforge-accent transition-all max-h-[40vh]"
                      style={{ aspectRatio: finalAspectRatio }}
                      onClick={() => openLightbox(sources, index + 1)}
                    >
                      {/* Blurred background */}
                      <Image
                        src={source}
                        alt=""
                        fill
                        className="object-cover blur-md opacity-30"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      {/* Main image */}
                      <Image
                        src={source}
                        alt={`${alt} source ${index + 2}`}
                        fill
                        className="object-contain hover:scale-105 transition-transform relative z-10"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* 4-5 sources - original grid layout */
              <>
                {/* First row - 2 images */}
                <div className="grid grid-cols-2 gap-4 justify-items-center">
                  {sources.slice(0, 2).map((source, index) => (
                    <div
                      key={index}
                      className="w-32 h-32 bg-criforge-bg-card rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-criforge-accent transition-all"
                      onClick={() => openLightbox(sources, index)}
                    >
                      <Image
                        src={source}
                        alt={`${alt} source ${index + 1}`}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        sizes="128px"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Second row - up to 3 images */}
                {sources.length > 2 && (
                  <div className="grid grid-cols-3 gap-3 justify-items-center">
                    {sources.slice(2, 5).map((source, index) => (
                      <div
                        key={index + 2}
                        className="w-28 h-28 bg-criforge-bg-card rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-criforge-accent transition-all"
                        onClick={() => openLightbox(sources, index + 2)}
                      >
                        <Image
                          src={source}
                          alt={`${alt} source ${index + 3}`}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                          sizes="112px"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="lg:col-span-4 self-stretch flex justify-center items-center arrow-glow">
          <svg
              width="240"
              height="80"
              viewBox="0 0 240 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animated-arrow-svg"
              style={{overflow: 'visible'}}
            >
              <defs>
                <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e50914" />
                  <stop offset="100%" stopColor="#8b0000" />
                </linearGradient>
                <filter id="arrowGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="shineGradient" gradientTransform="rotate(45)">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
                  <stop offset="45%" stopColor="rgba(255, 255, 255, 0)" />
                  <stop offset="50%" stopColor="rgba(255, 255, 255, 0.8)" />
                  <stop offset="55%" stopColor="rgba(255, 255, 255, 0)" />
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                </linearGradient>
                <mask id="arrowMask">
                  <rect x="0" y="0" width="240" height="80" fill="black" />
                  <path d="M0 40 H200 M180 28 L200 40 L180 52" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </mask>
              </defs>

              {/* Base Arrow with Gradient and Glow */}
              <path
                d="M0 40 H200 M180 28 L200 40 L180 52"
                stroke="url(#arrowGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="arrow-path"
              />

              {/* Diagonal Shine Effect */}
              <rect
                x="-240"
                y="0"
                width="240"
                height="80"
                fill="url(#shineGradient)"
                mask="url(#arrowMask)"
                className="arrow-shine-effect"
              />
            </svg>
          </div>

        {/* Final */}
        <div className="lg:col-span-4">
          <h3 className="text-lg font-cinzel font-semibold mb-4 text-criforge-accent">
            Final Result{finalImages.length > 1 ? 's' : ''}
          </h3>
          <div className="space-y-4">
            {finalImages.map((finalImg, index) => (
              <div 
                key={index}
                className="relative w-full bg-criforge-bg-card rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-criforge-accent transition-all max-h-[40vh] ring-2 ring-green-500/50 shadow-lg shadow-green-500/20"
                style={{ aspectRatio: finalAspectRatio }}
                onClick={() => openLightbox(finalImages, index)}
              >
                {/* Blurred background */}
                <Image
                  src={finalImg}
                  alt=""
                  fill
                  className="object-cover blur-md opacity-30"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Main image */}
                <Image
                  src={finalImg}
                  alt={`${alt} final result ${index + 1}`}
                  fill
                  className="object-contain hover:scale-105 transition-transform relative z-10"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      {timeline.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-cinzel font-semibold mb-6 text-criforge-accent text-center">
            Process Timeline
          </h3>
          <div className="flex justify-center items-center space-x-4 overflow-x-auto pb-4">
            {timeline.map((step, index) => (
              <div key={step.n} className="flex flex-col items-center space-y-2 min-w-0 flex-shrink-0">
                <div 
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                    selectedTimelineStep === step.n 
                      ? 'bg-criforge-accent border-criforge-accent text-white shadow-lg shadow-criforge-accent/30' 
                      : 'bg-criforge-bg-card border-criforge-accent/50 text-criforge-accent hover:border-criforge-accent hover:shadow-md'
                  }`}
                  onClick={() => {
                    setSelectedTimelineStep(selectedTimelineStep === step.n ? null : step.n)
                    if (step.media?.src) {
                      openLightbox([step.media.src], 0)
                    }
                  }}
                >
                  <span className="font-bold text-sm">{step.n}</span>
                </div>
                <p className="text-xs text-center text-criforge-text-secondary max-w-20 leading-tight">
                  {step.label}
                </p>
                {index < timeline.length - 1 && (
                  <div className="absolute top-6 left-16 w-8 h-px bg-criforge-accent/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  )
}
