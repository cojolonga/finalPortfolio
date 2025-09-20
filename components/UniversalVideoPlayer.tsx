'use client'

import VideoPlayer from './VideoPlayer'

interface UniversalVideoPlayerProps {
  video: {
    final: {
      type: string
      src?: string
      href?: string
    }
  }
  title?: string
  poster?: string
  className?: string
  objectFit?: 'contain' | 'cover'
  showFullscreenButton?: boolean
}

export default function UniversalVideoPlayer({ 
  video, 
  title, 
  poster, 
  className = '', 
  objectFit = 'contain',
  showFullscreenButton = false 
}: UniversalVideoPlayerProps) {
  
  // Handle YouTube URLs
  if (video.final.type === 'url' && video.final.href) {
    const url = video.final.href
    
    // Extract video ID from YouTube URL
    let videoId = ''
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || ''
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('shorts/')[1]?.split('?')[0] || ''
    }
    
    if (videoId) {
      return (
        <div className={`relative ${className}`}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`}
            title={title || 'Video'}
            className="w-full h-full rounded-lg"
            style={{ aspectRatio: objectFit === 'cover' ? '9/16' : '16/9' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }
  }
  
  // Handle local video files
  if (video.final.src) {
    return (
      <VideoPlayer
        src={video.final.src}
        title={title}
        poster={poster}
        className={className}
        objectFit={objectFit}
        showFullscreenButton={showFullscreenButton}
      />
    )
  }
  
  // Fallback
  return (
    <div className={`bg-gray-800 rounded-lg flex items-center justify-center ${className}`}>
      <p className="text-white">Video not available</p>
    </div>
  )
}
