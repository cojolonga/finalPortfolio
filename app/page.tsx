import { readFile } from 'fs/promises'
import { join } from 'path'
import HomePageClient from './components/HomePageClient'

interface Project {
  slug: string
  title: string
  category: 'restores' | 'edits' | 'videos'
  type: string
  cover?: string
  info?: {
    title?: string
    subtitle?: string
  }
}

async function getProjects(): Promise<Project[]> {
  try {
    const manifestPath = join(process.cwd(), 'app', '_data', 'manifest.json')
    const manifestContent = await readFile(manifestPath, 'utf-8')
    const manifest = JSON.parse(manifestContent)
    return manifest.projects || []
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export default async function Home() {
  const projects = await getProjects()
  return <HomePageClient projects={projects} />
}
