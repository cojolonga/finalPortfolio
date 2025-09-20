'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Project {
  name: string
  title: string
  subtitle?: string
  description?: string
  final: string | string[]
  sources?: string[]
  category: string
}

interface CategorySectionProps {
  title: string
  projects: Project[]
  description: string
  categoryPath: string
  fromHome?: boolean
}

export default function CategorySection({ title, projects, description, categoryPath, fromHome = false }: CategorySectionProps) {
  const router = useRouter()
  
  const handleProjectClick = (e: React.MouseEvent, projectName: string) => {
    e.preventDefault()
    
    if (fromHome) {
      // Save current scroll position
      sessionStorage.setItem('homeScrollPosition', window.scrollY.toString())
    }
    
    const href = fromHome ? `/project/${projectName}?from=home` : `/project/${projectName}`
    router.push(href)
  }
  
  // Show only first 6 projects for preview
  const displayProjects = projects.slice(0, 6)
  

  return (
    <section className="py-16 relative overflow-visible">
      {/* Radial glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-criforge-accent/6 via-criforge-accent/3 to-transparent opacity-50" />
      <div className="absolute -inset-24 bg-gradient-radial from-criforge-accent/4 via-criforge-accent/1 to-transparent opacity-30 scale-125" />
      <div className="text-center mb-12 relative z-10">
        <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-4 transition-all duration-700 hover:scale-105" style={{
          color: '#f8fafc',
          textShadow: '0 0 20px rgba(139, 69, 19, 0.5), 0 0 40px rgba(139, 69, 19, 0.2), 0 0 10px rgba(255, 255, 255, 0.1)',
          filter: 'drop-shadow(0 4px 12px rgba(139, 69, 19, 0.2))'
        }}>
          {title}
        </h2>
        <p className="text-lg max-w-2xl mx-auto font-medium transition-all duration-500 hover:scale-102" style={{
          color: '#e2e8f0',
          textShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
          filter: 'drop-shadow(0 1px 3px rgba(255, 255, 255, 0.1))'
        }}>
          <span className="bg-gradient-to-r from-slate-200 via-white to-slate-200 bg-clip-text text-transparent">
            {description}
          </span>
        </p>
      </div>
      
      <div className="flex justify-end mb-8 relative z-10">
        <Link 
          href={categoryPath}
          className="hidden md:inline-flex items-center px-6 py-3 border-2 border-criforge-accent text-criforge-accent hover:bg-criforge-accent hover:text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          style={{
            boxShadow: '0 6px 16px rgba(139, 69, 19, 0.2), inset 0 0 15px rgba(139, 69, 19, 0.1)',
            textShadow: '0 0 8px rgba(139, 69, 19, 0.3)',
            filter: 'drop-shadow(0 2px 8px rgba(139, 69, 19, 0.2))'
          }}
        >
          View All
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Special layout for Portraits */}
      {title === "Portraits" ? (
        <div className="space-y-8 relative z-10">
          {/* First row - 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.slice(0, 3).map((project, index) => {
              const finalImage = Array.isArray(project.final) ? project.final[0] : project.final
              
              return (
                <Link
                  key={`${project.category}-${project.name}-${index}`}
                  href={fromHome ? `/project/${project.name}?from=home` : `/project/${project.name}`}
                  onClick={(e) => handleProjectClick(e, project.name)}
                  className="group relative block rounded-lg overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
                  style={{
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(139, 69, 19, 0.1)',
                    filter: 'drop-shadow(0 4px 15px rgba(139, 69, 19, 0.2))'
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={finalImage}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority={index < 3}
                      unoptimized
                    />
                    
                    {/* Elegant hover overlay with glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent group-hover:from-black/30 group-hover:via-black/10 transition-all duration-500" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500" style={{
                      background: 'radial-gradient(circle at center, rgba(139, 69, 19, 0.2) 0%, transparent 70%)'
                    }} />
                  </div>
                </Link>
              )
            })}
          </div>
          
          {/* Second row - remaining items centered */}
          {displayProjects.length > 3 && (
            <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                  {displayProjects.slice(3).map((project, index) => {
                const finalImage = Array.isArray(project.final) ? project.final[0] : project.final
                
                return (
                  <Link
                    key={`${project.category}-${project.name}-${index + 3}`}
                    href={fromHome ? `/project/${project.name}?from=home` : `/project/${project.name}`}
                    onClick={(e) => handleProjectClick(e, project.name)}
                    className="group relative block rounded-lg overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
                    style={{
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(139, 69, 19, 0.1)',
                      filter: 'drop-shadow(0 4px 15px rgba(139, 69, 19, 0.2))'
                    }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={finalImage}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority={false}
                        unoptimized
                      />
                      
                      {/* Elegant hover overlay with glow */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent group-hover:from-black/30 group-hover:via-black/10 transition-all duration-500" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500" style={{
                        background: 'radial-gradient(circle at center, rgba(139, 69, 19, 0.2) 0%, transparent 70%)'
                      }} />
                    </div>
                  </Link>
                )
              })}
                </div>
            </div>
          )}
        </div>
      ) : (
        /* Default grid layout for other sections */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {displayProjects.map((project, index) => {
            const finalImage = Array.isArray(project.final) ? project.final[0] : project.final
            
            return (
              <Link
                key={`${project.category}-${project.name}-${index}`}
                href={fromHome ? `/project/${project.name}?from=home` : `/project/${project.name}`}
                onClick={(e) => handleProjectClick(e, project.name)}
                className="group relative block rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={finalImage}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={index < 3}
                    unoptimized
                  />
                  
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Mobile View All Button */}
      <div className="mt-12 text-center md:hidden">
        <Link 
          href={categoryPath}
          className="inline-flex items-center px-8 py-4 bg-criforge-accent hover:bg-criforge-accent-dark text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          View All {title}
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
