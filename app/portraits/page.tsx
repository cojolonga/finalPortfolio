import Link from 'next/link'
import Image from 'next/image'
import { readFileSync } from 'fs'
import { join } from 'path'

interface Project {
  slug: string
  category: string
  title: string
  cover: string
  info?: { title?: string; subtitle?: string }
}

interface Manifest {
  projects: Project[]
}

async function getPortraitProjects(): Promise<Project[]> {
  try {
    const manifestPath = join(process.cwd(), 'app', '_data', 'manifest.json')
    const manifestContent = readFileSync(manifestPath, 'utf-8')
    const manifest: Manifest = JSON.parse(manifestContent)
    return manifest.projects.filter(p => p.category === 'portraits')
  } catch (error) {
    return []
  }
}

export default async function PortraitsPage() {
  const projects = await getPortraitProjects()

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
              <Link href="/portraits" className="text-criforge-accent font-bold font-cinzel text-lg tracking-wide">
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

      {/* Header */}
      <section className="py-20 px-4 bg-gradient-to-b from-criforge-bg to-criforge-bg-secondary">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-shadow mb-6">
            PORTRAITS
          </h1>
          <p className="text-xl text-criforge-text-secondary max-w-3xl mx-auto">
            Professional portrait photography and retouching work
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {projects.length === 0 ? (
            <div className="text-center text-criforge-text-secondary">
              <p className="text-xl mb-4">No portrait projects found</p>
              <p>Add content to the /content/portraits folder</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link 
                  key={project.slug} 
                  href={`/project/${project.slug}`}
                  className="group block"
                >
                  <div className="bg-criforge-bg-card rounded-lg overflow-hidden hover-glow transition-all">
                    <div className="aspect-[4/5] bg-criforge-bg flex items-center justify-center relative">
                      {project.cover ? (
                        <Image 
                          src={project.cover} 
                          alt={project.title}
                          fill
                          className="object-cover"
                          priority
                          unoptimized
                        />
                      ) : (
                        <div className="text-criforge-text-secondary text-4xl">📸</div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
