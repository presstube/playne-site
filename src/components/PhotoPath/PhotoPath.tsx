'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Path2 from '@/components/Path2/Path2'
import { BRAND_COLORS } from '@/components/Path2/Path2'
import { GalleryImage } from '@/lib/image-hat'
import { urlFor } from '@/sanity/lib/image'
import styles from './PhotoPath.module.css'

interface PathConfig {
  id: number
  color: string
  lobes: 0 | 1 | 2
  amplitude: number
  strokeWidth: number
  bias: 'left' | 'right' | 'auto'
  wildness: number
}

interface PhotoPathProps {
  image: GalleryImage
  pathResetTrigger?: number
  addPathTrigger?: number
}

let nextPathId = 0

export default function PhotoPath({ image, pathResetTrigger = 0, addPathTrigger = 0 }: PhotoPathProps) {
  const [paths, setPaths] = useState<PathConfig[]>([])
  const [imageLoaded, setImageLoaded] = useState(false)
  const [screenSize, setScreenSize] = useState({ width: 1200, height: 800 })

  // Get optimized Sanity image URL with responsive sizing
  // Portrait: 80% of screen height, Landscape: 80% of screen width
  const isPortrait = image.dimensions.aspectRatio < 1
  const maxDimension = isPortrait 
    ? Math.round(screenSize.height * 0.8)
    : Math.round(screenSize.width * 0.8)

  const imageUrl = urlFor(image.imageAsset)
    .width(maxDimension)
    .quality(85)
    .url()

  // Detect screen size
  useEffect(() => {
    const updateSize = () => {
      setScreenSize({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      })
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

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
    console.log('PhotoPath mounting with Sanity image:', image.galleryTitle)
  }, [image])

  // Reset paths when image changes (NEW IMAGE button)
  useEffect(() => {
    if (pathResetTrigger > 0 && imageLoaded) {
      console.log('Resetting paths due to new image')
      const initialPath = generateRandomPathConfig()
      setPaths([initialPath])
      setImageLoaded(false) // Force reload
    }
  }, [pathResetTrigger])

  // Add path when ADD PATH button clicked
  useEffect(() => {
    if (addPathTrigger > 0) {
      console.log('Adding path via trigger')
      const newPath = generateRandomPathConfig()
      setPaths(prevPaths => [...prevPaths, newPath])
    }
  }, [addPathTrigger])

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

  return (
    <div className={styles.photoPath} onClick={handleContainerClick}>
      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl}
          alt={image.altText}
          width={image.dimensions.width}
          height={image.dimensions.height}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          priority
          placeholder="blur"
          blurDataURL={image.lqip}
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

