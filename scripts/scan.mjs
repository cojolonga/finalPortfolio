#!/usr/bin/env node

import { globby } from 'globby'
import { readFileSync, writeFileSync, statSync, existsSync, mkdirSync } from 'fs'
import { join, dirname, basename, extname } from 'path'
import { parse as parseYaml } from 'yaml'
import matter from 'gray-matter'

// Categorize videos based on name patterns and aspect ratio
function categorizeVideo(projectName, fileName) {
  const name = projectName.toLowerCase()
  
  // Check for promo keywords
  if (name.includes('promo') || name.includes('trailer') || name.includes('teaser')) {
    return 'promo'
  }
  
  // Check for shorts keywords or vertical aspect ratios
  if (name.includes('short') || name.includes('reel') || name.includes('tiktok') || 
      name.includes('story') || name.includes('vertical')) {
    return 'shorts'
  }
  
  // Default to long form for everything else
  return 'longform'
}

const contentDir = 'public/content'
const outputDir = 'app/_data'
const outputFile = join(outputDir, 'manifest.json')

// Ensure output directory exists
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true })
}

async function detectProjectType(projectPath) {
  const files = await globby('**/*', { cwd: projectPath, onlyFiles: true })
  
  // Get category from path
  const pathParts = projectPath.split(/[/\\]/)
  const category = pathParts[pathParts.length - 2]
  
  const hasBeforeAfter = files.some(f => f.startsWith('before.')) && files.some(f => f.startsWith('after.'))
  const hasSources = files.some(f => f.startsWith('sources/'))
  const hasFinal = files.some(f => f.startsWith('final/'))
  const hasVideoFinal = files.some(f => f === 'final.url' || (f.endsWith('.mp4') || f.endsWith('.webm') || f.endsWith('.mov') || f.endsWith('.avi')))
  
  if (hasBeforeAfter) return 'restores'
  if (hasSources && hasFinal) {
    // Use the actual folder category for sources/final structure
    return category === 'portraits' ? 'portraits' : 'edits'
  }
  if (hasVideoFinal) return 'videos'
  
  return 'unknown'
}

function readInfoYml(projectPath) {
  const infoPath = join(projectPath, 'info.yml')
  if (!existsSync(infoPath)) return null
  
  try {
    const content = readFileSync(infoPath, 'utf-8')
    return parseYaml(content)
  } catch (error) {
    console.warn(`Error reading ${infoPath}:`, error.message)
    return null
  }
}

function processUrlFile(filePath) {
  if (!existsSync(filePath)) return null
  
  try {
    const url = readFileSync(filePath, 'utf-8').trim()
    return { type: 'url', href: url }
  } catch (error) {
    console.warn(`Error reading URL file ${filePath}:`, error.message)
    return null
  }
}

function getMediaObject(filePath, projectPath) {
  const fullPath = join(projectPath, filePath)
  
  if (filePath.endsWith('.url')) {
    return processUrlFile(fullPath)
  }
  
  // Get category and project name from projectPath
  const pathParts = projectPath.split(/[/\\]/)
  const category = pathParts[pathParts.length - 2]
  const projectName = pathParts[pathParts.length - 1]
  
  // Return relative path for local files with category included
  return { type: 'file', src: `/content/${join(category, projectName, filePath).replace(/\\/g, '/')}` }
}

async function processTimeline(projectPath) {
  const timelinePath = join(projectPath, 'timeline')
  if (!existsSync(timelinePath)) return []
  
  const allFiles = await globby('*', { cwd: timelinePath, onlyFiles: true })
  const timelineFiles = allFiles
    .filter(f => /^\d+_/.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/^(\d+)_/)[1])
      const numB = parseInt(b.match(/^(\d+)_/)[1])
      return numA - numB
    })
  
  return timelineFiles.map(file => {
    const match = file.match(/^(\d+)_(.+)/)
    if (!match) return null
    
    const [, num, rest] = match
    const label = rest.replace(/\.[^.]+$/, '').replace(/_/g, ' ')
    const media = getMediaObject(`timeline/${file}`, projectPath)
    
    return {
      n: parseInt(num),
      label,
      media
    }
  }).filter(Boolean)
}

async function processProject(projectPath) {
  const projectName = basename(projectPath)
  const category = await detectProjectType(projectPath)
  const info = readInfoYml(projectPath)
  
  // Get modification time for sorting
  const stat = statSync(projectPath)
  const modTime = stat.mtime
  
  const project = {
    slug: `${category}-${projectName.toLowerCase()}`,
    category,
    title: projectName,
    cover: null,
    modTime: modTime.getTime()
  }
  
  // Add info if available
  if (info) {
    project.info = info
  }
  
  // Process based on type
  if (category === 'restores') {
    const beforeFiles = await globby('before.*', { cwd: projectPath, onlyFiles: true })
    const afterFiles = await globby('after.*', { cwd: projectPath, onlyFiles: true })
    
    if (beforeFiles.length > 0 && afterFiles.length > 0) {
      project.restore = {
        before: `/content/${category}/${projectName}/${beforeFiles[0]}`,
        after: `/content/${category}/${projectName}/${afterFiles[0]}`
      }
      project.cover = project.restore.after
    }
  } else if (category === 'edits' || category === 'portraits') {
    const sourceFiles = await globby('sources/*', { cwd: projectPath, onlyFiles: true })
    const finalFiles = await globby('final/*', { cwd: projectPath, onlyFiles: true })
    
    if (sourceFiles.length > 0 && finalFiles.length > 0) {
      const editData = {
        sources: sourceFiles.map(f => `/content/${category}/${projectName}/${f}`),
        final: finalFiles.length === 1 
          ? `/content/${category}/${projectName}/${finalFiles[0]}`
          : finalFiles.map(f => `/content/${category}/${projectName}/${f}`)
      }
      
      if (category === 'portraits') {
        project.portrait = editData
      } else {
        project.edit = editData
      }
      
      project.cover = Array.isArray(editData.final) ? editData.final[0] : editData.final
    }
  } else if (category === 'videos') {
    const finalUrlPath = join(projectPath, 'final.url')
    const allVideoFiles = await globby('*.{mp4,webm,mov,avi}', { cwd: projectPath, onlyFiles: true })
    const allFinalFiles = await globby('final.*', { cwd: projectPath, onlyFiles: true })
    const finalFiles = allFinalFiles.filter(f => !f.endsWith('.url'))
    
    if (existsSync(finalUrlPath)) {
      project.video = {
        final: processUrlFile(finalUrlPath)
      }
      // Try to get thumbnail from YouTube URL
      if (project.video.final?.href?.includes('youtu')) {
        const videoId = project.video.final.href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
        if (videoId) {
          project.cover = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        }
      }
      // Set videoCategory from info.yml if available
      if (info && info.videoCategory) {
        project.videoCategory = info.videoCategory
      }
    } else if (finalFiles.length > 0) {
      project.video = {
        final: { type: 'file', src: `/content/${category}/${projectName}/${finalFiles[0]}` }
      }
      project.cover = project.video.final.src
    } else if (allVideoFiles.length > 0) {
      // Handle video files directly in the project folder
      project.video = {
        final: { type: 'file', src: `/content/${category}/${projectName}/${allVideoFiles[0]}` }
      }
      // Use generated thumbnail if available, otherwise fallback to video
      const thumbnailPath = `/thumbnails/${projectName}.jpg`
      project.cover = thumbnailPath
    
      // Categorize video based on aspect ratio and name patterns
      project.videoCategory = categorizeVideo(projectName, allVideoFiles[0])
    }
  }
  
  // Process timeline
  const timeline = await processTimeline(projectPath)
  if (timeline.length > 0) {
    project.timeline = timeline
  }
  
  return project
}

async function scanContent() {
  console.log('🔍 Scanning content directory...')
  
  if (!existsSync(contentDir)) {
    console.log('📁 Content directory not found, creating empty manifest')
    const manifest = { projects: [] }
    writeFileSync(outputFile, JSON.stringify(manifest, null, 2))
    return
  }
  
  // Find all project directories
  const projectDirs = await globby('*/*/', { cwd: contentDir, onlyDirectories: true })
  const projectPaths = projectDirs.map(p => join(contentDir, p.replace(/\/$/, '')))
  
  console.log(`📂 Found ${projectPaths.length} project directories`)
  
  const projects = []
  
  for (const projectPath of projectPaths) {
    try {
      const project = await processProject(projectPath)
      projects.push(project)
      console.log(`✅ Processed: ${project.title} (${project.category})`)
    } catch (error) {
      console.error(`❌ Error processing ${projectPath}:`, error.message)
    }
  }
  
  // Sort by modification time (newest first)
  projects.sort((a, b) => b.modTime - a.modTime)
  
  // Remove modTime from final output
  projects.forEach(p => delete p.modTime)
  
  const manifest = { projects }
  
  writeFileSync(outputFile, JSON.stringify(manifest, null, 2))
  console.log(`📝 Generated manifest with ${projects.length} projects`)
  console.log(`💾 Saved to: ${outputFile}`)
}

// Run the scanner
scanContent().catch(console.error)
