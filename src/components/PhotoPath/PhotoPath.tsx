'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Path2 from '@/components/Path2/Path2'
import { BRAND_COLORS } from '@/components/Path2/Path2'
import styles from './PhotoPath.module.css'

const PHOTOS = [
  '/images/2025_07_16-Free_Arts_Day-23-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-22-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-21-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-20-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-19-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-18-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-17-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-16-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-15-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-14-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-13-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-12-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-11-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-10-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-09-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-08-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-07-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-06-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-05-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-04-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-03-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-02-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-01-by_yeasinsgallery.jpg',
  '/images/Shantell_Martin-Playne-7.jpg',
  '/images/Shantell_Martin_Playne-6.jpg',
  '/images/Shantell_Martin_Playne-5.jpg',
  '/images/Shantell_Martin_Playne-4.jpg',
  '/images/Shantell_Martin_Playne-3.jpg',
  '/images/Shantell_Martin_Playne-2.jpg',
  '/images/Shantell_Martin_Playne-1.jpg',
]

interface PathConfig {
  id: number
  color: string
  lobes: 0 | 1 | 2
  amplitude: number
  strokeWidth: number
  bias: 'left' | 'right' | 'auto'
  wildness: number
}

let nextPathId = 0

export default function PhotoPath() {
  const [selectedPhoto, setSelectedPhoto] = useState<string>('')
  const [paths, setPaths] = useState<PathConfig[]>([])
  const [imageLoaded, setImageLoaded] = useState(false)

  const generateRandomPathConfig = (): PathConfig => {
    const config = {
      id: nextPathId++,
      color: BRAND_COLORS[Math.floor(Math.random() * 4)], // Exclude off-white
      lobes: [0, 1, 2][Math.floor(Math.random() * 3)] as 0 | 1 | 2,
      amplitude: 0.4 + Math.random() * 0.35, // 0.4-0.75
      strokeWidth: 50 + Math.floor(Math.random() * 30), // 50-80px
      bias: (['left', 'right', 'auto'][Math.floor(Math.random() * 3)]) as 'left' | 'right' | 'auto',
      wildness: 0.9 + Math.random() * 0.6 // 0.9-1.5
    }
    console.log('Generated path config:', config)
    return config
  }

  useEffect(() => {
    console.log('PhotoPath mounting, selecting random photo and generating initial path')
    const randomPhoto = PHOTOS[Math.floor(Math.random() * PHOTOS.length)]
    console.log('Selected photo:', randomPhoto)
    setSelectedPhoto(randomPhoto)
  }, [])

  useEffect(() => {
    if (imageLoaded) {
      console.log('Image loaded, generating initial path')
      const initialPath = generateRandomPathConfig()
      console.log('Setting initial path:', initialPath)
      setPaths([initialPath])
    }
  }, [imageLoaded])

  const handlePathClick = (pathId: number, e: React.MouseEvent) => {
    console.log('Path clicked:', pathId, 'shiftKey:', e.shiftKey)
    e.stopPropagation()
    e.preventDefault()
    
    // If shift key, add a new path instead of replacing
    if (e.shiftKey) {
      console.log('Shift+click detected, adding new path')
      const newPath = generateRandomPathConfig()
      console.log('Generated new path:', newPath.id)
      setPaths(prevPaths => {
        console.log('Adding path. Current count:', prevPaths.length)
        const result = [...prevPaths, newPath]
        console.log('New count:', result.length)
        return result
      })
      return
    }
    
    // Normal click: replace this path
    const newPath = generateRandomPathConfig()
    console.log('Generated new path:', newPath.id)
    
    setPaths(prevPaths => {
      console.log('setState running. Before filter:', prevPaths.length, 'paths')
      
      const pathExists = prevPaths.some(path => path.id === pathId)
      if (!pathExists) {
        console.log('Path', pathId, 'not found (likely Strict Mode double-invoke), returning unchanged')
        return prevPaths
      }
      
      const filteredPaths = prevPaths.filter(path => path.id !== pathId)
      console.log('After filter:', filteredPaths.length, 'paths')
      const result = [...filteredPaths, newPath]
      console.log('Final paths:', result.length)
      return result
    })
  }

  const handleContainerClick = (e: React.MouseEvent) => {
    console.log('Container clicked, shiftKey:', e.shiftKey)
    if (e.shiftKey) {
      // Shift+click: Add a new path
      e.preventDefault()
      setPaths(prevPaths => {
        console.log('Adding path. Current count:', prevPaths.length)
        const newPath = generateRandomPathConfig()
        console.log('New path ID:', newPath.id)
        const result = [...prevPaths, newPath]
        console.log('New count:', result.length)
        return result
      })
    }
  }

  if (!selectedPhoto) return null

  return (
    <div className={styles.photoPath} onClick={handleContainerClick}>
      <div className={styles.imageWrapper}>
        <Image
          src={selectedPhoto}
          alt="PLAYNE artwork"
          width={800}
          height={600}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          priority
          onLoad={() => {
            console.log('Image loaded!')
            setImageLoaded(true)
          }}
        />
        {imageLoaded && paths.map(pathConfig => (
          <div 
            key={pathConfig.id}
            className={styles.pathWrapper}
          >
            <Path2
              color={pathConfig.color}
              lobes={pathConfig.lobes}
              amplitude={pathConfig.amplitude}
              strokeWidth={pathConfig.strokeWidth}
              bias={pathConfig.bias}
              wildness={pathConfig.wildness}
              onClick={(e: React.MouseEvent) => handlePathClick(pathConfig.id, e)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

