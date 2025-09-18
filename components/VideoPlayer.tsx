'use client'

import { useState, useRef, useEffect } from 'react'

interface VideoPlayerProps {
  src: string
  title?: string
  poster?: string
  className?: string
  objectFit?: 'contain' | 'cover'
  allowFullscreen?: boolean
  showFullscreenButton?: boolean
}

export default function VideoPlayer({ src, title, poster, className = '', objectFit = 'contain', allowFullscreen = true, showFullscreenButton = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [aspectRatio, setAspectRatio] = useState('16/9')
  const [isVertical, setIsVertical] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCustomFullscreen, setIsCustomFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(true)
  const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(null)
  const lastClickTime = useRef(0)

  const enterCustomFullscreen = () => {
    setIsCustomFullscreen(true)
    document.body.style.overflow = 'hidden'
  }

  const exitCustomFullscreen = () => {
    const mainVideo = videoRef.current
    const fullscreenVideo = fullscreenVideoRef.current
    
    if (mainVideo && fullscreenVideo) {
      // Sync time back to main video before closing
      mainVideo.currentTime = fullscreenVideo.currentTime
      
      // Resume main video if fullscreen was playing
      if (!fullscreenVideo.paused) {
        mainVideo.play().catch(error => {
          console.warn('Main video resume failed:', error)
        })
        setIsPlaying(true)
        setShowPlayButton(false)
      } else {
        setIsPlaying(false)
        setShowPlayButton(true)
      }
    }
    
    setIsCustomFullscreen(false)
    document.body.style.overflow = ''
  }

  const loadVideo = () => {
    if (!videoLoaded) {
      setVideoLoaded(true)
      const video = videoRef.current
      if (video) {
        if (video.paused) {
          // Unmute video before playing to ensure audio
          video.muted = false
          video.play().catch(error => {
            console.warn('Video play failed:', error)
            // If autoplay fails due to browser policy, keep muted for now
            video.muted = true
            video.play().catch(err => console.warn('Muted play also failed:', err))
          })
          setIsPlaying(true)
          setShowPlayButton(false)
        } else {
          video.pause()
          setIsPlaying(false)
          setShowPlayButton(true)
        }
      }
    }
  }

  const handleVideoClick = (e: React.MouseEvent) => {
    // Load video on first interaction
    if (!videoLoaded) {
      loadVideo()
      return
    }
    
    const video = videoRef.current
    if (!video) return
    
    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
      setShowPlayButton(true)
    } else {
      // Unmute video before playing to ensure audio
      video.muted = false
      video.play().catch(error => {
        console.warn('Video play failed:', error)
        // If autoplay fails due to browser policy, keep muted for now
        video.muted = true
        video.play().catch(err => console.warn('Muted play also failed:', err))
        setIsPlaying(false)
        setShowPlayButton(true)
      })
      setIsPlaying(true)
      setShowPlayButton(false)
    }
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (allowFullscreen) {
      if (isCustomFullscreen) {
        exitCustomFullscreen()
      } else {
        enterCustomFullscreen()
      }
    }
  }

  // Progressive loading with retries
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    let retryCount = 0
    const maxRetries = 8
    let retryTimeout: NodeJS.Timeout
    
    const handleLoadedMetadata = () => {
      const ratio = video.videoWidth / video.videoHeight
      const vertical = ratio < 1
      setAspectRatio(`${ratio}`)
      setIsVertical(vertical)
      setIsLoading(false)
      if (retryTimeout) clearTimeout(retryTimeout)
    }
    
    const handleError = () => {
      console.warn(`Video metadata loading failed for: ${src}, attempt ${retryCount + 1}`)
      retryLoading()
    }
    
    const retryLoading = () => {
      if (retryCount < maxRetries) {
        retryCount++
        console.log(`Retrying video load: ${src}, attempt ${retryCount}`)
        
        // Ultra-fast progressive delay: 100ms, 200ms, 300ms, 500ms, 700ms, 1s, 1.5s, 2s
        const delay = retryCount === 1 ? 100 : 
                     retryCount === 2 ? 200 :
                     retryCount === 3 ? 300 :
                     retryCount === 4 ? 500 :
                     retryCount === 5 ? 700 :
                     retryCount === 6 ? 1000 :
                     retryCount === 7 ? 1500 : 2000
        
        retryTimeout = setTimeout(() => {
          // Force reload by changing src slightly
          const currentSrc = video.src
          video.src = ''
          video.load()
          setTimeout(() => {
            video.src = currentSrc
            video.load()
          }, 20)
        }, delay)
      } else {
        console.warn(`Max retries reached for: ${src}`)
        setAspectRatio('16/9')
        setIsVertical(false)
        setIsLoading(false)
      }
    }
    
    // Reasonable initial timeout - 5 seconds
    const initialTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn(`Initial metadata loading timeout for: ${src}`)
        setIsLoading(false)
        setAspectRatio('16/9')
        setIsVertical(false)
      }
    }, 5000)
    
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('error', handleError)
    
    return () => {
      if (initialTimeout) clearTimeout(initialTimeout)
      if (retryTimeout) clearTimeout(retryTimeout)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('error', handleError)
    }
  }, [src, isLoading])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setIsPlaying(true)
      setShowPlayButton(false)
    }

    const handlePause = () => {
      setIsPlaying(false)
      setShowPlayButton(true)
    }

    const handleLoadedMetadata = () => {
      const ratio = video.videoWidth / video.videoHeight
      const vertical = ratio < 1
      setAspectRatio(`${ratio}`)
      setIsVertical(vertical)
      setIsLoading(false)
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCustomFullscreen) {
        setIsCustomFullscreen(false)
        document.body.style.overflow = ''
      }
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    document.addEventListener('keydown', handleEscapeKey)
    
    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = ''
    }
  }, [isCustomFullscreen])

  // Always maintain aspect ratio, limit vertical videos to reasonable size
  const containerStyle = isLoading 
    ? { aspectRatio: '16/9' }
    : isVertical 
      ? { 
          aspectRatio, 
          maxHeight: '80vh', 
          width: 'fit-content',
          maxWidth: '100%',
          margin: '0 auto' 
        }
      : objectFit === 'cover' && !isVertical
        ? { 
            aspectRatio: '16/9',
            width: '100%',
            maxWidth: '100%'
          }
        : { 
            aspectRatio,
            width: '100%',
            maxWidth: '100%'
          }

  return (
    <>
      <div 
        ref={containerRef}
        className={`rounded-lg overflow-hidden relative ${className}`}
        style={containerStyle}
      >
        <video
          ref={videoRef}
          src={src}
          className={`w-full h-full object-${isVertical ? 'contain' : objectFit} cursor-pointer`}
          title={title}
          preload="metadata"
          poster={poster}
          style={{ objectFit: isVertical ? 'contain' : objectFit }}
          onClick={handleVideoClick}
          playsInline
          crossOrigin="anonymous"
        />
        
        
        {videoLoaded && isLoading && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <div className="text-white/40 text-sm">Loading...</div>
            </div>
          </div>
        )}
        {/* Custom play button overlay */}
        {showPlayButton && !isPlaying && videoLoaded && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 cursor-pointer z-20"
            onClick={handleVideoClick}
          >
            <button className="bg-black bg-opacity-60 text-white p-4 rounded-full hover:bg-opacity-80 transition-opacity pointer-events-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        )}
        
        {/* Invisible overlay for controls when playing */}
        {isPlaying && (
          <div 
            className="absolute inset-0 cursor-pointer z-10"
            onClick={handleVideoClick}
          />
        )}
        
        {/* Fullscreen button */}
        {showFullscreenButton && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              enterCustomFullscreen()
            }}
            className="absolute bottom-3 right-3 z-30 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
            title="Fullscreen"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          </button>
        )}
      </div>
      
      {/* Custom fullscreen overlay */}
      {isCustomFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => {
            exitCustomFullscreen()
          }}
        >
          <video
            ref={fullscreenVideoRef}
            src={src}
            controls
            className="max-w-full max-h-full object-contain"
            title={title}
            playsInline
            style={{ 
              objectFit: 'contain',
              width: 'auto',
              height: 'auto',
              maxWidth: '100vw',
              maxHeight: '100vh'
            }}
            onClick={(e) => e.stopPropagation()}
            onLoadedData={() => {
              const mainVideo = videoRef.current
              const fullscreenVideo = fullscreenVideoRef.current
              if (mainVideo && fullscreenVideo) {
                // Sync time but don't auto-play to avoid duplicate playback
                fullscreenVideo.currentTime = mainVideo.currentTime
                // Pause main video to prevent duplicate audio
                mainVideo.pause()
                if (isPlaying) {
                  fullscreenVideo.play().catch(error => {
                    console.warn('Fullscreen video autoplay failed:', error)
                  })
                }
              }
            }}
            onError={(e) => {
              console.warn('Fullscreen video loading error:', e)
            }}
            onAbort={(e) => {
              console.warn('Fullscreen video loading aborted:', e)
            }}
          />
        </div>
      )}
    </>
  )
}
