'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ImageCarousel from '@/components/ImageCarousel'
import CategorySection from '@/components/CategorySection'
import VideoSection from '@/components/VideoSection'
import ArrowCompare from '@/components/ArrowCompare'
import BeforeAfter from '@/components/BeforeAfter'
import WhatIDoGallery from '@/components/WhatIDoGallery'
import ScrollReveal from '@/components/ScrollReveal'
import StatsCounter from '@/components/StatsCounter'

interface Project {
  slug: string
  title: string
  category: 'restores' | 'edits' | 'portraits' | 'videos'
  type: string
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
  edit?: {
    sources: string[]
    final: string | string[]
  }
  portrait?: {
    sources: string[]
    final: string | string[]
  }
  restore?: {
    before: string
    after: string
  }
}

function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete()
    }, 2500) // Trigger when content starts fading out

    return () => clearTimeout(timer)
  }, [onLoadingComplete])

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h1 className="loading-title">ArsAI</h1>
        <div className="loading-line"></div>
        <div className="loading-subtitle">Professional Portfolio</div>
      </div>
      <div className="loading-overlay"></div>
    </div>
  )
}

function MainContent({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Restore scroll position when coming back from project
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('homeScrollPosition')
    if (savedScrollPosition) {
      const scrollY = parseInt(savedScrollPosition, 10)
      window.scrollTo(0, scrollY)
      sessionStorage.removeItem('homeScrollPosition')
    }
  }, [])

  // Prepare carousel images from all edited projects
  const carouselImages = [...projects.filter(p => p.category === 'edits'), ...projects.filter(p => p.category === 'portraits')]
    .map(project => ({
      src: project.cover || '',
      alt: project.title,
      category: project.category,
      projectName: project.title
    }))
    
  // Group projects by category
  const restoreProjects = projects.filter(p => p.category === 'restores').map(p => ({
    name: p.slug,
    title: p.title,
    subtitle: p.info?.subtitle,
    description: p.info?.title,
    final: p.cover || '',
    category: p.category
  }))
  
  const editProjects = projects.filter(p => p.category === 'edits').map(p => ({
    name: p.slug,
    title: p.title,
    subtitle: p.info?.subtitle,
    description: p.info?.title,
    final: p.cover || '',
    category: p.category
  }))
  
  const portraitProjects = projects.filter(p => p.category === 'portraits').map(p => ({
    name: p.slug,
    title: p.title,
    subtitle: p.info?.subtitle,
    description: p.info?.title,
    final: p.cover || '',
    category: p.category
  }))
  
  const videoProjects = projects.filter(p => p.category === 'videos')

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md border-b transition-all duration-300" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%)',
        borderColor: 'rgba(139, 69, 19, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(139, 69, 19, 0.1)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-2xl font-cinzel font-bold transition-all duration-300 hover:scale-110" style={{
              filter: 'drop-shadow(0 2px 8px rgba(139, 69, 19, 0.3))'
            }}>
              <span className="text-criforge-accent" style={{
                textShadow: '0 0 15px rgba(139, 69, 19, 0.6)'
              }}>Ars</span><span className="text-white" style={{
                color: '#f8fafc',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
              }}>AI</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-criforge-accent font-bold font-cinzel text-lg tracking-wide transition-all duration-300 hover:scale-110" style={{
                textShadow: '0 0 15px rgba(139, 69, 19, 0.8), 0 0 30px rgba(139, 69, 19, 0.4)',
                filter: 'drop-shadow(0 2px 4px rgba(139, 69, 19, 0.3))'
              }}>
                HOME
              </Link>
              <Link href="/restores" className="font-bold font-cinzel text-lg tracking-wide transition-all duration-300 hover:scale-110 hover:text-criforge-accent" style={{
                color: '#f1f5f9',
                textShadow: '0 0 8px rgba(255, 255, 255, 0.2)',
                filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3))'
              }}>
                RESTORATIONS
              </Link>
              <Link href="/edits" className="font-bold font-cinzel text-lg tracking-wide transition-all duration-300 hover:scale-110 hover:text-criforge-accent" style={{
                color: '#f1f5f9',
                textShadow: '0 0 8px rgba(255, 255, 255, 0.2)',
                filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3))'
              }}>
                EDITS
              </Link>
              <Link href="/portraits" className="font-bold font-cinzel text-lg tracking-wide transition-all duration-300 hover:scale-110 hover:text-criforge-accent" style={{
                color: '#f1f5f9',
                textShadow: '0 0 8px rgba(255, 255, 255, 0.2)',
                filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3))'
              }}>
                PORTRAITS
              </Link>
              <Link href="/videos" className="font-bold font-cinzel text-lg tracking-wide transition-all duration-300 hover:scale-110 hover:text-criforge-accent" style={{
                color: '#f1f5f9',
                textShadow: '0 0 8px rgba(255, 255, 255, 0.2)',
                filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3))'
              }}>
                VIDEOS
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="h-20" />

      {/* Hero Section with Carousel */}
      <section className="relative px-4" style={{ paddingTop: '24px', paddingBottom: '0px' }}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="fade" duration={1000}>
            <div className="text-center" style={{ marginBottom: '0px' }}>
              <h1 className="text-6xl md:text-8xl font-cinzel font-bold tracking-wider transition-all duration-700 hover:scale-105" style={{
                textShadow: '0 0 30px rgba(139, 69, 19, 0.8), 0 0 60px rgba(139, 69, 19, 0.4), 0 0 100px rgba(139, 69, 19, 0.2)',
                marginBottom: '12px',
                filter: 'drop-shadow(0 4px 20px rgba(139, 69, 19, 0.3))'
              }}>
                <span className="text-criforge-accent animate-pulse" style={{
                  textShadow: '0 0 20px rgba(139, 69, 19, 0.9), 0 0 40px rgba(139, 69, 19, 0.6)'
                }}>Ars</span><span className="text-white" style={{
                  color: '#f8fafc',
                  textShadow: '0 0 15px rgba(255, 255, 255, 0.3), 0 0 30px rgba(255, 255, 255, 0.1)'
                }}>AI</span>
              </h1>
              <p className="text-xl md:text-2xl max-w-5xl mx-auto leading-relaxed font-medium transition-all duration-500 hover:scale-102" style={{ 
                marginBottom: '12px',
                color: '#e2e8f0',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                filter: 'drop-shadow(0 1px 3px rgba(255, 255, 255, 0.1))'
              }}>
                <span className="bg-gradient-to-r from-slate-200 via-white to-slate-200 bg-clip-text text-transparent">
                  Transforming moments into masterpieces through professional photo restoration, creative editing, and cinematic video production
                </span>
              </p>
              
              {/* Stats */}
              <StatsCounter />
            </div>
          </ScrollReveal>
          
          {/* Main Carousel */}
          <div className="overflow-visible" style={{ marginTop: '0px', marginBottom: '0px' }}>
            <ImageCarousel 
              images={carouselImages} 
              onImageClick={(image) => {
                // Save scroll position before opening modal
                sessionStorage.setItem('homeScrollPosition', window.scrollY.toString())
                
                // Find the full project data
                const project = projects.find(p => p.cover === image.src)
                if (project) {
                  setSelectedProject(project)
                  setLightboxOpen(true)
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <WhatIDoGallery />

      {/* Category Sections */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-20">
          
          {/* Photo Restorations */}
          <ScrollReveal direction="up" delay={100}>
            <CategorySection
              title="Photo Restorations"
              projects={restoreProjects}
              categoryPath="/restores"
              description="Bringing damaged and aged photographs back to life with meticulous attention to detail"
              fromHome={true}
            />
          </ScrollReveal>

          {/* Creative Edits */}
          <ScrollReveal direction="up" delay={200}>
            <CategorySection
              title="Creative Edits"
              projects={editProjects}
              categoryPath="/edits"
              description="Transforming ordinary images into extraordinary art through creative manipulation"
              fromHome={true}
            />
          </ScrollReveal>

          {/* Portraits */}
          <ScrollReveal direction="up" delay={300}>
            <CategorySection
              title="Portraits"
              projects={portraitProjects}
            categoryPath="/portraits"
            description="Professional portrait photography and retouching work"
            fromHome={true}
            />
          </ScrollReveal>

        </div>
      </section>

      {/* Video Sections */}
      <section className="py-12 px-4 bg-criforge-bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={400}>
            <VideoSection
              title="Video Production"
              projects={videoProjects.filter(p => p.category === 'videos') as any}
              description="Professional video editing, color grading, and post-production work"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <ScrollReveal direction="fade" delay={500}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-cinzel font-bold mb-8 transition-all duration-700 hover:scale-105" style={{
              color: '#f8fafc',
              textShadow: '0 0 25px rgba(139, 69, 19, 0.6), 0 0 50px rgba(139, 69, 19, 0.3), 0 0 15px rgba(255, 255, 255, 0.2)',
              filter: 'drop-shadow(0 4px 15px rgba(139, 69, 19, 0.2))'
            }}>
              <span className="bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent">
                Let's Work Together
              </span>
            </h2>
            <p className="text-xl leading-relaxed mb-12 max-w-3xl mx-auto font-medium transition-all duration-500 hover:scale-102" style={{
              color: '#e2e8f0',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              filter: 'drop-shadow(0 1px 3px rgba(255, 255, 255, 0.1))'
            }}>
              <span className="bg-gradient-to-r from-slate-200 via-white to-slate-200 bg-clip-text text-transparent">
                Ready to bring your visual projects to life? Get in touch for professional photo restoration, 
                creative editing, portraits, and video production services.
              </span>
            </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="https://upwork.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-criforge-accent hover:bg-criforge-accent-dark text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              style={{
                boxShadow: '0 10px 25px rgba(139, 69, 19, 0.3), 0 0 20px rgba(139, 69, 19, 0.2)',
                filter: 'drop-shadow(0 4px 15px rgba(139, 69, 19, 0.4))'
              }}
            >
              Hire Me on Upwork
            </a>
            <a
              href="mailto:contact@arsai.com"
              className="inline-flex items-center px-8 py-4 border-2 border-criforge-accent text-criforge-accent hover:bg-criforge-accent hover:text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              style={{
                boxShadow: '0 8px 20px rgba(139, 69, 19, 0.2), inset 0 0 20px rgba(139, 69, 19, 0.1)',
                textShadow: '0 0 10px rgba(139, 69, 19, 0.3)'
              }}
            >
              Get in Touch
            </a>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* Modal - Stay in Home */}
      {lightboxOpen && selectedProject && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setLightboxOpen(false)
              setSelectedProject(null)
            }
          }}
        >
          <div className="relative max-w-7xl w-full">
            {selectedProject.category === 'restores' && selectedProject.restore && (
              <BeforeAfter
                before={selectedProject.restore.before}
                after={selectedProject.restore.after}
                alt={selectedProject.title}
              />
            )}
            {selectedProject.category === 'edits' && selectedProject.edit && (
              <ArrowCompare
                sources={selectedProject.edit.sources}
                final={selectedProject.edit.final}
                alt={selectedProject.title}
              />
            )}
            {selectedProject.category === 'portraits' && selectedProject.portrait && (
              <ArrowCompare
                sources={selectedProject.portrait.sources}
                final={selectedProject.portrait.final}
                alt={selectedProject.title}
              />
            )}
          </div>
        </div>
      )}

      <footer className="bg-criforge-bg-card py-12 border-t border-criforge-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-cinzel font-bold text-criforge-accent mb-2">ArsAI</h3>
              <p className="text-criforge-fg-muted">
                © {new Date().getFullYear()} ArsAI. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-criforge-fg-secondary hover:text-criforge-accent transition-colors"
              >
                GitHub
              </a>
              <a
                href="mailto:contact@arsai.com"
                className="text-criforge-fg-secondary hover:text-criforge-accent transition-colors"
              >
                Email
              </a>
              <a
                href="https://upwork.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-criforge-fg-secondary hover:text-criforge-accent transition-colors"
              >
                Upwork
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default function HomePageClient({ projects }: { projects: Project[] }) {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true)
    // Check if animation has been shown in this browser session
    const hasShownAnimation = sessionStorage.getItem('arsai-animation-shown')
    if (hasShownAnimation) {
      setIsLoading(false)
      setShowContent(true)
    }
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Mark animation as shown for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('arsai-animation-shown', 'true')
    }
    // Small delay to ensure smooth fade-in transition
    setTimeout(() => {
      setShowContent(true)
    }, 100)
  }

  return (
    <main className="min-h-screen site-bg">
      {isClient && isLoading && (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      )}
      {(!isLoading || !isClient) && (
        <div className={`transition-opacity duration-700 ease-out ${showContent || !isClient ? 'opacity-100' : 'opacity-0'}`}>
          <MainContent projects={projects} />
        </div>
      )}
    </main>
  )
}
