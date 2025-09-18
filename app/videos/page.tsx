import { Metadata } from 'next'
import Link from 'next/link'
import { join } from 'path'
import { readFileSync } from 'fs'
import VideosClient from './VideosClient'

interface Project {
  slug: string
  category: string
  title: string
  cover: string
  videoCategory?: string
  video?: { final: { type: string; src?: string; href?: string } }
  info?: { title?: string; subtitle?: string }
}

interface Manifest {
  projects: Project[]
}

async function getVideoProjects(): Promise<Project[]> {
  try {
    const manifestPath = join(process.cwd(), 'app', '_data', 'manifest.json')
    const manifestContent = readFileSync(manifestPath, 'utf-8')
    const manifest: Manifest = JSON.parse(manifestContent)
    return manifest.projects.filter(p => p.category === 'videos')
  } catch (error) {
    return []
  }
}

export default async function VideosPage() {
  const projects = await getVideoProjects()
  
  return <VideosClient projects={projects} />
}
