#!/usr/bin/env node

import { globby } from 'globby'
import { existsSync, mkdirSync } from 'fs'
import { join, dirname, basename, extname } from 'path'
import { spawn, exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const contentDir = 'public/content/videos'
const thumbnailDir = 'public/thumbnails'

// Ensure thumbnail directory exists
if (!existsSync(thumbnailDir)) {
  mkdirSync(thumbnailDir, { recursive: true })
}

function generateThumbnail(videoPath, outputPath) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', videoPath,
      '-ss', '00:00:01.000',  // Extract frame at 1 second
      '-vframes', '1',        // Extract only 1 frame
      '-y',                   // Overwrite output file
      outputPath
    ])

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Generated thumbnail: ${basename(outputPath)}`)
        resolve(outputPath)
      } else {
        console.log(`❌ Failed to generate thumbnail for: ${basename(videoPath)}`)
        resolve(null)
      }
    })

    ffmpeg.on('error', (err) => {
      console.log(`❌ FFmpeg error for ${basename(videoPath)}:`, err.message)
      resolve(null)
    })
  })
}

function getVideoInfo(videoPath) {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_streams',
      '-select_streams', 'v:0',
      videoPath
    ])

    let output = ''
    ffprobe.stdout.on('data', (data) => {
      output += data.toString()
    })

    ffprobe.on('close', (code) => {
      if (code === 0) {
        try {
          const info = JSON.parse(output)
          const videoStream = info.streams[0]
          if (videoStream) {
            resolve({
              width: videoStream.width,
              height: videoStream.height,
              aspectRatio: videoStream.width / videoStream.height
            })
          } else {
            resolve(null)
          }
        } catch (err) {
          resolve(null)
        }
      } else {
        resolve(null)
      }
    })

    ffprobe.on('error', () => {
      resolve(null)
    })
  })
}

async function processVideos() {
  console.log('🎬 Generating video thumbnails...')
  
  if (!existsSync(contentDir)) {
    console.log('📁 Videos directory not found')
    return
  }

  // Find all video projects
  const projectDirs = await globby('*/', { cwd: contentDir, onlyDirectories: true })
  
  for (const projectDir of projectDirs) {
    const projectPath = join(contentDir, projectDir.replace(/\/$/, ''))
    const projectName = basename(projectPath)
    
    // Find video files
    const videoFiles = await globby('*.{mp4,webm,mov,avi}', { cwd: projectPath, onlyFiles: true })
    
    if (videoFiles.length > 0) {
      const videoFile = videoFiles[0] // Use first video file
      const videoPath = join(projectPath, videoFile)
      
      // Check for custom thumbnail image first
      const customThumbnails = await globby('*.{jpg,jpeg,png,webp}', { cwd: projectPath, onlyFiles: true })
      const thumbnailPath = join(thumbnailDir, `${projectName}.jpg`)
      
      if (customThumbnails.length > 0) {
        // Use custom thumbnail image - always regenerate to ensure it's the right one
        const customThumbPath = join(projectPath, customThumbnails[0])
        
        try {
          // Convert custom image to jpg and copy to thumbnails directory
          await execAsync(`ffmpeg -i "${customThumbPath}" -y "${thumbnailPath}"`)
          console.log(`✅ Used custom thumbnail: ${projectName}.jpg (from ${customThumbnails[0]})`)
          continue
        } catch (error) {
          console.error(`❌ Failed to process custom thumbnail for ${projectName}:`, error.message)
          // Fall through to generate from video
        }
      }
      
      // Skip if generated thumbnail already exists
      if (existsSync(thumbnailPath)) {
        console.log(`⏭️  Thumbnail already exists: ${projectName}.jpg`)
        continue
      }
      
      try {
        // Special cases for specific videos based on actual video file names
        let frameTime = '00:00:01.000'  // Default: 1 second
        
        if (videoFile.toLowerCase().includes('gracias') && videoFile.toLowerCase().includes('fuego')) {
          frameTime = '00:00:13.333'  // Frame 400 at 30fps ≈ 13.33 seconds
        }
        
        // Use time-based extraction instead of frame number for better reliability
        await execAsync(`ffmpeg -i "${videoPath}" -ss ${frameTime} -vframes 1 -y "${thumbnailPath}"`)
        console.log(`✅ Generated thumbnail: ${projectName}.jpg ${frameTime !== '00:00:01.000' ? `(at ${frameTime})` : ''}`)
        
        // Get video dimensions for aspect ratio info
        const probe = await execAsync(`ffprobe -v quiet -print_format json -show_streams "${videoPath}"`)
        const metadata = JSON.parse(probe.stdout)
        const videoStream = metadata.streams.find(s => s.codec_type === 'video')
        
        if (videoStream) {
          const width = videoStream.width
          const height = videoStream.height
          const aspectRatio = (width / height).toFixed(2)
          console.log(`📐 ${projectName}: ${width}x${height} (${aspectRatio})`)
        }
      } catch (error) {
        console.error(`❌ Failed to generate thumbnail for ${projectName}:`, error.message)
      }
    }
  }
  
  console.log('🎯 Thumbnail generation complete!')
}

// Check if ffmpeg is available
function checkFFmpeg() {
  return new Promise((resolve) => {
    const ffmpeg = spawn('ffmpeg', ['-version'])
    ffmpeg.on('close', (code) => {
      resolve(code === 0)
    })
    ffmpeg.on('error', () => {
      resolve(false)
    })
  })
}

// Run the script
async function main() {
  const hasFFmpeg = await checkFFmpeg()
  if (!hasFFmpeg) {
    console.log('❌ FFmpeg not found. Please install FFmpeg to generate video thumbnails.')
    console.log('   Download from: https://ffmpeg.org/download.html')
    return
  }
  
  await processVideos()
}

main().catch(console.error)
