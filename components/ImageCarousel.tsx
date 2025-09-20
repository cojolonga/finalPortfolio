'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface CarouselImage {
  src: string
  alt: string
  category: string
  projectName: string
}

interface ImageCarouselProps {
  images: CarouselImage[]
  onImageClick?: (image: CarouselImage) => void
}

const lerp = (start: number, end: number, amt: number): number => {
  return (1 - amt) * start + amt * end
}

export default function ImageCarousel({ images, onImageClick }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragVelocity, setDragVelocity] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const lastDragX = useRef(0)
  const animationFrameRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const animateToIndex = (newIndex: number, fromAutoPlay = false) => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)

    const itemWidth = (typeof window !== 'undefined' ? window.innerWidth : 1200) * 0.22
    const startOffset = fromAutoPlay ? 0 : dragOffset
    const targetOffset = fromAutoPlay ? -itemWidth : (currentIndex - newIndex) * itemWidth

    let startTime: number | null = null
    const duration = fromAutoPlay ? 600 : 400 // Slower for autoplay

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3) // Ease-out cubic

      const currentOffset = lerp(startOffset, targetOffset, easedProgress)
      setDragOffset(currentOffset)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setCurrentIndex(newIndex)
        setDragOffset(0)
      }
    }
    animationFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (isAutoPlaying && !isDragging) {
      intervalRef.current = setInterval(() => {
        const newIndex = (currentIndex + 1) % images.length
        animateToIndex(newIndex, true)
      }, 3000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isAutoPlaying, isDragging, images.length, currentIndex])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    setIsDragging(true)
    setIsAutoPlaying(false)
    setDragStart(e.clientX)
    lastDragX.current = e.clientX
    setDragVelocity(0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const offset = e.clientX - dragStart
    setDragOffset(offset)
    setDragVelocity(e.clientX - lastDragX.current)
    lastDragX.current = e.clientX
  }

  const handleMouseUp = () => {
    if (!isDragging || !isClient) return

    setIsDragging(false)

    const itemWidth = (typeof window !== 'undefined' ? window.innerWidth : 1200) * 0.22
    const velocityThreshold = 3 // Reduced for better sensitivity
    const offsetThreshold = itemWidth / 3 // Reduced threshold for easier navigation

    let newIndex = currentIndex

    // Improved logic to prevent fast drag bugs
    const absVelocity = Math.abs(dragVelocity)
    const absDragOffset = Math.abs(dragOffset)

    if (absDragOffset > offsetThreshold || absVelocity > velocityThreshold) {
      if (dragOffset < 0 || dragVelocity < -velocityThreshold) {
        // Moving left (next image)
        newIndex = (currentIndex + 1) % images.length
      } else if (dragOffset > 0 || dragVelocity > velocityThreshold) {
        // Moving right (previous image)
        newIndex = (currentIndex - 1 + images.length) % images.length
      }
    }

    // Ensure index is valid
    newIndex = Math.max(0, Math.min(images.length - 1, newIndex))

    animateToIndex(newIndex)

    setTimeout(() => setIsAutoPlaying(true), 3000)
  }

  const handleImageClick = (imageIndex: number) => {
    if (Math.abs(dragStart - lastDragX.current) < 10) {
      if (imageIndex === currentIndex) {
        onImageClick?.(images[currentIndex])
      } else {
        // Use the animation function for smooth transition to clicked image
        animateToIndex(imageIndex)
      }
    }
  }

  if (images.length === 0) {
    return <div className="w-full h-96" />
  }

  // Render range of 3 shows 7 images total (3 left + center + 3 right)
  const renderRange = 3

  return (
    <div className="relative w-full">
      <div
        className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center perspective-1000 cursor-grab active:cursor-grabbing select-none"
        style={{ overflow: 'visible' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {Array.from({ length: renderRange * 2 + 1 }).map((_, i) => {
          const indexOffset = i - renderRange
          const imageIndex = (currentIndex + indexOffset + images.length) % images.length
          const image = images[imageIndex]

          const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
          const virtualPosition = indexOffset + dragOffset / (windowWidth * 0.22)
          const distance = Math.abs(virtualPosition)

          // Progressive scale for 7 images: center=1.0, gradually smaller to edges
          const scale = distance >= 3 
            ? 0.45  // Outermost images (positions ±3)
            : (distance >= 2.5
              ? lerp(0.55, 0.45, (distance - 2.5) * 2)  // Position ±2.5 to ±3
              : (distance >= 2
                ? lerp(0.65, 0.55, (distance - 2) * 2)  // Position ±2 to ±2.5
                : (distance >= 1.5
                  ? lerp(0.75, 0.65, (distance - 1.5) * 2)  // Position ±1.5 to ±2
                  : (distance >= 1
                    ? lerp(0.85, 0.75, (distance - 1) * 2)  // Position ±1 to ±1.5
                    : lerp(1, 0.85, distance)))))
          
          // Smooth calculations based on virtual position (includes drag offset)
          const absoluteVirtualPosition = Math.abs(virtualPosition)
          
          // Smooth opacity for 7 visible images
          const opacity = absoluteVirtualPosition > 3.2 
            ? 0  // Hide images beyond position ±3.2
            : (absoluteVirtualPosition >= 3
              ? lerp(0.3, 0, (absoluteVirtualPosition - 3) * 5)  // Fade out outermost
              : (absoluteVirtualPosition >= 2.5
                ? lerp(0.5, 0.3, (absoluteVirtualPosition - 2.5) * 2)
                : (absoluteVirtualPosition >= 2
                  ? lerp(0.6, 0.5, (absoluteVirtualPosition - 2) * 2)
                  : (absoluteVirtualPosition >= 1.5
                    ? lerp(0.75, 0.6, (absoluteVirtualPosition - 1.5) * 2)
                    : (absoluteVirtualPosition >= 1
                      ? lerp(0.85, 0.75, (absoluteVirtualPosition - 1))
                      : lerp(1, 0.85, absoluteVirtualPosition))))))
          
          const zIndex = Math.floor(15 - distance * 2)
          // Adjusted spacing for 7 images - more compact but visible
          const translateX = lerp(0, 35, virtualPosition)  // Reduced from 45 to 35
          const rotateY = lerp(0, -12, virtualPosition)    // Slightly reduced rotation
          
          // Smooth overlay alpha for 7 images
          const overlayAlpha = absoluteVirtualPosition >= 3
            ? 0.6  // Darkest for outermost images
            : (absoluteVirtualPosition >= 2.5
              ? lerp(0.5, 0.6, (absoluteVirtualPosition - 2.5) * 2)
              : (absoluteVirtualPosition >= 2
                ? lerp(0.4, 0.5, (absoluteVirtualPosition - 2) * 2)
                : (absoluteVirtualPosition >= 1.5
                  ? lerp(0.3, 0.4, (absoluteVirtualPosition - 1.5) * 2)
                  : (absoluteVirtualPosition > 1
                    ? lerp(0.2, 0.3, (absoluteVirtualPosition - 1))
                    : 0.1))))

          const isCenter = imageIndex === currentIndex
          
          // Real-time glow effect that follows drag movement
          const glowIntensity = Math.max(0, Math.min(1, 1 - absoluteVirtualPosition))
          const glowOpacity = glowIntensity * 0.4
          const borderOpacity = glowIntensity * 0.3
          const borderWidth = lerp(1, 2, glowIntensity)

          return (
            <div
              key={`${image.src}-${indexOffset}`}
              className={`absolute w-[420px] h-[315px] md:w-[500px] md:h-[375px] select-none`}
              style={{
                transform: `translateX(${translateX}%) translateZ(${-distance * 200}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                transformStyle: 'preserve-3d',
                transition: 'none', // Keep transform immediate for smooth drag
              }}
              onClick={() => handleImageClick(imageIndex)}
              onDragStart={(e) => e.preventDefault()}
            >
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  boxShadow: `
                    0 25px 50px -12px rgba(139, 69, 19, ${glowOpacity}), 
                    0 0 0 1px rgba(139, 69, 19, ${borderOpacity}),
                    0 15px 35px -5px rgba(0, 0, 0, 0.4)
                  `,
                  border: `${borderWidth}px solid rgba(139, 69, 19, ${borderOpacity})`,
                  transition: isDragging ? 'none' : 'box-shadow 0.3s ease-out, border 0.3s ease-out',
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover pointer-events-none"
                  priority={distance <= 1}
                  loading={distance <= 2 ? "eager" : "lazy"}
                  quality={isCenter ? 90 : 75}
                  draggable={false}
                />
                {!isCenter && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ backgroundColor: `rgba(0,0,0, ${overlayAlpha})` }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
