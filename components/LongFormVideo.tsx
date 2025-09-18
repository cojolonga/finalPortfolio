'use client'

import { useState, useRef, useEffect } from 'react'

interface LongFormVideoProps {
  src: string
  title?: string
  className?: string
  thumbnail?: string
}

export default function LongFormVideo({ src, title, className = '', thumbnail }: LongFormVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastClickTime = useRef(0)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const loadVideo = () => {
    if (!videoLoaded) {
      setVideoLoaded(true)
      const video = videoRef.current
      if (video) {
        // Video already has src, just play it
        video.play().catch(error => {
          console.warn('LongForm video autoplay failed:', error)
          setIsPlaying(false)
          setShowPlayButton(true)
        })
        setIsPlaying(true)
        setShowPlayButton(false)
      }
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    const currentTime = Date.now()
    const timeDiff = currentTime - lastClickTime.current
    
    // Load video on first interaction
    if (!videoLoaded) {
      loadVideo()
      lastClickTime.current = currentTime
      return
    }
    
    // If clicks are within 400ms, it's a double click
    if (timeDiff < 400) {
      // Double click - trigger fullscreen
      e.preventDefault()
      e.stopPropagation()
      
      const video = videoRef.current
      if (!video) return

      if (isFullscreen) {
        document.exitFullscreen()
      } else if (video.requestFullscreen) {
        video.requestFullscreen()
      }
      
      lastClickTime.current = 0 // Reset to prevent triple clicks
      return
    }
    
    // Single click - play/pause
    lastClickTime.current = currentTime
    
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().catch(error => {
        console.warn('LongForm video play failed:', error)
        setIsPlaying(false)
        setShowPlayButton(true)
      })
      setIsPlaying(true)
      setShowPlayButton(false)
    } else {
      video.pause()
      setIsPlaying(false)
      setShowPlayButton(true)
    }
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    // This is just a fallback, the main logic is in handleClick
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover cursor-pointer"
        title={title}
        preload="metadata"
        poster={thumbnail}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        playsInline
        onPlay={() => {
          setIsPlaying(true)
          setShowPlayButton(false)
        }}
        onPause={() => {
          setIsPlaying(false)
          setShowPlayButton(true)
        }}
        onError={(e) => {
          console.warn('LongForm video loading error:', e)
        }}
        onAbort={(e) => {
          console.warn('LongForm video loading aborted:', e)
        }}
      />
      
      {!videoLoaded && !thumbnail && (
        <div 
          className="absolute inset-0 bg-gray-800 flex items-center justify-center cursor-pointer"
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          <div className="text-white/60 text-4xl">🎬</div>
        </div>
      )}
      
      {/* Play/Pause button overlay */}
      {showPlayButton && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 cursor-pointer"
          onClick={handleClick}
        >
          <button className="bg-black bg-opacity-60 text-white p-4 rounded-full hover:bg-opacity-80 transition-opacity pointer-events-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
