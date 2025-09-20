'use client'

import Link from 'next/link'
import UniversalVideoPlayer from './UniversalVideoPlayer'

interface VideoProject {
  slug: string
  title: string
  category: 'videos'
  cover?: string
  videoCategory?: string
  video?: {
    final: {
      type: string
      src?: string
      href?: string
    }
  }
  info?: {
    title?: string
    subtitle?: string
  }
}

interface VideoSectionProps {
  title: string
  projects: VideoProject[]
  description: string
}

export default function VideoSection({ title, projects, description }: VideoSectionProps) {
  // Show exactly 2 shorts, 2 longforms, 2 promos
  const shorts = projects.filter(p => p.videoCategory === 'shorts').slice(0, 2)
  const longforms = projects.filter(p => p.videoCategory === 'longform').slice(0, 2)
  const promos = projects.filter(p => p.videoCategory === 'promo').slice(0, 2)
  
  const displayProjects = [...shorts, ...longforms, ...promos];

  return (
    <section className="py-16 relative overflow-visible">
      {/* Radial glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-criforge-accent/6 via-criforge-accent/3 to-transparent opacity-50" />
      <div className="absolute -inset-24 bg-gradient-radial from-criforge-accent/4 via-criforge-accent/1 to-transparent opacity-30 scale-125" />
      <div className="text-center mb-12 relative z-10">
        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-criforge-text-secondary text-lg max-w-2xl mx-auto">
          {description}
        </p>
      </div>
      
      <div className="flex justify-end mb-8 relative z-10">
        <Link 
          href="/videos"
          className="hidden md:inline-flex items-center px-6 py-3 bg-criforge-accent hover:bg-criforge-accent-dark text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          View All
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {displayProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-criforge-text-secondary">No video projects available</p>
        </div>
      ) : (
        <div className="space-y-12 relative z-10">
          {(() => {
            const verticalVideos = displayProjects.filter(p => p.videoCategory === 'shorts' || p.videoCategory === 'promo');
            const horizontalVideos = displayProjects.filter(p => p.videoCategory === 'longform');

            return (
              <>
                {/* Vertical Videos Section */}
                {verticalVideos.length > 0 && (
                  <div className="flex justify-center gap-6 flex-wrap">
                    {verticalVideos.map((project) => (
                      <div key={project.slug} className="group relative w-[250px] aspect-[9/16]">
                        <div className="relative rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500 w-full h-full">
                          <UniversalVideoPlayer
                            video={project.video!}
                            title={project.info?.title || project.title}
                            poster={project.cover}
                            className="w-full h-full"
                            objectFit="cover"
                            showFullscreenButton={true}
                          />
                          <div className="absolute top-3 left-3 z-10">
                            <span className="inline-block px-3 py-1 bg-criforge-accent/90 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase">
                              {project.videoCategory}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Horizontal Videos Section */}
                {horizontalVideos.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {horizontalVideos.map((project) => (
                      <div key={project.slug} className="group relative w-full aspect-video">
                         <div className="relative rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500 w-full h-full">
                          <UniversalVideoPlayer
                            video={project.video!}
                            title={project.info?.title || project.title}
                            poster={project.cover}
                            className="w-full h-full"
                            objectFit="cover"
                            showFullscreenButton={true}
                          />
                          <div className="absolute top-3 left-3 z-10">
                            <span className="inline-block px-3 py-1 bg-criforge-accent/90 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase">
                              {project.videoCategory}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* Mobile View All Button */}
      <div className="mt-12 text-center md:hidden">
        <Link 
          href="/videos"
          className="inline-flex items-center px-8 py-4 bg-criforge-accent hover:bg-criforge-accent-dark text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          View All Videos
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
