'use client'

import Link from 'next/link'
import Image from 'next/image'
import VideoPlayer from '@/components/VideoPlayer'
import LongFormVideo from '@/components/LongFormVideo'

interface Project {
  slug: string
  category: string
  title: string
  cover: string
  videoCategory?: string
  video?: { final: { type: string; src?: string; href?: string } }
  info?: { title?: string; subtitle?: string }
}

interface VideosClientProps {
  projects: Project[]
}

export default function VideosClient({ projects }: VideosClientProps) {
  // Group videos by category
  const longFormVideos = projects.filter(p => p.videoCategory === 'longform')
  const shortsVideos = projects.filter(p => p.videoCategory === 'shorts')
  const promoVideos = projects.filter(p => p.videoCategory === 'promo')

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-criforge-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-2xl font-cinzel font-bold">
              <span className="text-criforge-accent">Ars</span><span className="text-white">AI</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-white hover:text-criforge-accent transition-colors font-bold font-cinzel text-lg tracking-wide">
                HOME
              </Link>
              <Link href="/restores" className="text-white hover:text-criforge-accent transition-colors font-bold font-cinzel text-lg tracking-wide">
                RESTORATIONS
              </Link>
              <Link href="/edits" className="text-white hover:text-criforge-accent transition-colors font-bold font-cinzel text-lg tracking-wide">
                EDITS
              </Link>
              <Link href="/portraits" className="text-white hover:text-criforge-accent transition-colors font-bold font-cinzel text-lg tracking-wide">
                PORTRAITS
              </Link>
              <Link href="/videos" className="text-criforge-accent font-bold font-cinzel text-lg tracking-wide">
                VIDEOS
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Header Spacer */}
      <div className="h-20"></div>

      {/* Header */}
      <section className="py-20 px-4 bg-gradient-to-b from-inferno-bg to-inferno-gray">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-shadow mb-6">
            VIDEO PRODUCTION
          </h1>
          <p className="text-xl text-inferno-fg/80 max-w-3xl mx-auto">
            Professional video editing, color grading, and post-production work
          </p>
        </div>
      </section>

      {/* Video Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Long Form Videos */}
          {longFormVideos.length > 0 && (
            <div>
              <h2 className="text-3xl font-cinzel font-bold mb-8 text-center">Long Form</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {longFormVideos.map((project) => (
                  <div key={project.slug} className="group">
                    <div className=" rounded-lg overflow-hidden hover-glow transition-all">
                      <div className="aspect-video bg-inferno-bg flex items-center justify-center relative">
                        {project.video?.final.src ? (
                          <LongFormVideo
                            src={project.video.final.src}
                            title={project.info?.title || project.title}
                            thumbnail={project.cover}
                          />
                        ) : project.cover ? (
                          <Image 
                            src={project.cover} 
                            alt={project.title}
                            fill
                            className="object-cover"
                            priority
                            unoptimized
                          />
                        ) : (
                          <div className="text-inferno-fg/40 text-4xl">🎬</div>
                        )}
                      </div>
                      <Link href={`/project/${project.slug}`} className="block">
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shorts */}
          {shortsVideos.length > 0 && (
            <div>
              <h2 className="text-3xl font-cinzel font-bold mb-8 text-center">Shorts</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {shortsVideos.map((project) => (
                  <div key={project.slug} className="flex-shrink-0">
                    <div className=" rounded-lg overflow-hidden w-48 h-80 relative">
                      {project.video?.final.src ? (
                        <VideoPlayer
                          src={project.video.final.src}
                          title={project.info?.title || project.title}
                          className="w-full h-full"
                          objectFit="cover"
                          showFullscreenButton={true}
                        />
                      ) : project.cover ? (
                        <Image 
                          src={project.cover} 
                          alt={project.title}
                          fill
                          className="object-cover"
                          priority
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-inferno-fg/40 text-4xl">🎬</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Promo Videos */}
          {promoVideos.length > 0 && (
            <div>
              <h2 className="text-3xl font-cinzel font-bold mb-8 text-center">Promo Videos</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {promoVideos.map((project) => (
                  <div key={project.slug} className="flex-shrink-0">
                    <div className=" rounded-lg overflow-hidden w-48 h-80 relative">
                      {project.video?.final.src ? (
                        <VideoPlayer
                          src={project.video.final.src}
                          title={project.info?.title || project.title}
                          className="w-full h-full"
                          objectFit="cover"
                          showFullscreenButton={true}
                        />
                      ) : project.cover ? (
                        <Image 
                          src={project.cover} 
                          alt={project.title}
                          fill
                          className="object-cover"
                          priority
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-inferno-fg/40 text-4xl">🎬</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length === 0 && (
            <div className="text-center text-inferno-fg/60">
              <p className="text-xl mb-4">No video projects found</p>
              <p>Add content to the /content/videos folder</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
