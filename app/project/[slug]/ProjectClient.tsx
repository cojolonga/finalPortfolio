'use client'
import { ReactNode, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Project {
  slug: string
  category: string
  title: string
  cover: string
  restore?: { before: string; after: string }
  edit?: { sources: string[]; final: string }
  video?: { final: { type: string; href: string } }
  timeline?: Array<{ n: number; label: string; media: any }>
  info?: { 
    title?: string
    subtitle?: string
    steps?: Array<{ n: number; title: string; note?: string }>
  }
}

interface ProjectClientProps {
  project: Project
  children: ReactNode
}

export default function ProjectClient({ project, children }: ProjectClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromHome = searchParams.get('from') === 'home'
  
  const handleBackgroundClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    
    // Don't trigger if clicking on interactive elements or their containers
    if (target.closest('.before-after-slider, img, button, a, input, video, iframe, header, nav, [data-lightbox]')) {
      return
    }
    
    // Only trigger on specific background elements or flex containers
    const isBackgroundElement = 
      target.classList.contains('max-w-7xl') ||
      target.classList.contains('py-12') ||
      target.classList.contains('space-y-16') ||
      target.classList.contains('flex-col') ||
      target.classList.contains('justify-center') ||
      (target.tagName === 'SECTION' && target.classList.contains('py-12')) ||
      (target === e.currentTarget) // The root div itself
    
    if (isBackgroundElement) {
      // Prevent default and stop propagation to avoid double navigation
      e.preventDefault()
      e.stopPropagation()
      
      // Navigate back to home if came from home, otherwise to category page
      const backPath = fromHome ? '/' : `/${project.category}`
      router.push(backPath)
    }
  }

  return (
    <div onClick={handleBackgroundClick} className="min-h-screen relative">
      {children}
    </div>
  )
}
