import { readFileSync } from 'fs'
import { join } from 'path'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ArrowCompare from '@/components/ArrowCompare'
import BeforeAfter from '@/components/BeforeAfter'
import VideoPlayer from '@/components/VideoPlayer'
import Timeline from '@/components/Timeline'
import ProjectClient from './ProjectClient'

interface Project {
  slug: string
  category: string
  title: string
  cover: string
  restore?: { before: string; after: string }
  edit?: { sources: string[]; final: string }
  portrait?: { sources: string[]; final: string | string[] }
  video?: { final: { type: string; href: string } }
  timeline?: Array<{ n: number; label: string; media: any }>
  info?: { 
    title?: string
    subtitle?: string
    steps?: Array<{ n: number; title: string; note?: string }>
  }
}

interface Manifest {
  projects: Project[]
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    const manifestPath = join(process.cwd(), 'app', '_data', 'manifest.json')
    const manifestContent = readFileSync(manifestPath, 'utf-8')
    const manifest: Manifest = JSON.parse(manifestContent)
    return manifest.projects.find(p => p.slug === slug) || null
  } catch (error) {
    return null
  }
}

export async function generateStaticParams() {
  try {
    const manifestPath = join(process.cwd(), 'app', '_data', 'manifest.json')
    const manifestContent = readFileSync(manifestPath, 'utf-8')
    const manifest: Manifest = JSON.parse(manifestContent)
    return manifest.projects.map(project => ({
      slug: project.slug
    }))
  } catch (error) {
    return []
  }
}

export default async function ProjectPage({ 
  params 
}: { 
  params: { slug: string }
}) {
  const project = await getProject(params.slug)

  if (!project) {
    notFound()
  }

  // fromHome will be handled client-side

  const renderVideoEmbed = (videoData: { type: string; href?: string; src?: string }) => {
    if (videoData.href?.includes('youtu')) {
      const videoId = videoData.href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
      if (videoId) {
        return (
          <div className="aspect-video bg-inferno-gray rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              allowFullScreen
              title={project.info?.title || project.title}
            />
          </div>
        )
      }
    }
    
    if (videoData.href?.includes('.mp4') || videoData.href?.includes('.webm') || videoData.src) {
      const videoSrc = videoData.src || videoData.href
      if (videoSrc) {
        return (
          <VideoPlayer
            src={videoSrc}
            title={project.info?.title || project.title}
            className="w-full"
          />
        )
      }
    }
    
    return (
      <div className="aspect-video bg-inferno-gray rounded-lg flex items-center justify-center">
        <p className="text-inferno-fg/60">Video format not supported</p>
      </div>
    )
  }

  // Prepare timeline steps with info from info.yml if available
  const timelineSteps = project.timeline?.map(step => {
    const infoStep = project.info?.steps?.find(s => s.n === step.n)
    return {
      ...step,
      title: infoStep?.title || step.label,
      note: infoStep?.note
    }
  }) || []

  return (
    <ProjectClient project={project}>
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
              <Link href="/videos" className="text-white hover:text-criforge-accent transition-colors font-bold font-cinzel text-lg tracking-wide">
                VIDEOS
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Header Spacer */}
      <div className="h-20"></div>

      {/* Project Header */}
      <main className="pt-32 pb-12 flex items-center justify-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="space-y-16">
            {/* Restore Type */}
            {project.restore && (
              <div className="max-w-4xl mx-auto">
                <BeforeAfter
                  before={project.restore.before}
                  after={project.restore.after}
                />
              </div>
            )}

            {/* Edit Type */}
            {project.edit && (
              <ArrowCompare 
                sources={project.edit.sources}
                final={project.edit.final}
              />
            )}

            {/* Portrait Type */}
            {project.portrait && (
              <ArrowCompare 
                sources={project.portrait.sources}
                final={Array.isArray(project.portrait.final) ? project.portrait.final[0] : project.portrait.final}
              />
            )}

            {/* Video Type */}
            {project.video && (
              <div className="max-w-4xl mx-auto">
                {renderVideoEmbed(project.video.final)}
              </div>
            )}


            {/* Timeline */}
            {timelineSteps.length > 0 && (
              <div className="max-w-5xl mx-auto">
                <Timeline steps={timelineSteps} />
              </div>
            )}
          </div>
        </div>
      </main>

    </ProjectClient>
  )
}
