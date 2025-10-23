'use client'

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import { GalleryImage } from '@/lib/image-hat'
import { urlFor } from '@/sanity/lib/image'
import styles from './Photo.module.css'

interface PhotoProps {
  image: GalleryImage
  borderRadius?: string
  onClick?: () => void
  loading?: boolean
  onImageLoad?: () => void
}

export default function Photo({ image, borderRadius = '8px', onClick, loading = false, onImageLoad }: PhotoProps) {
  const [mounted, setMounted] = useState(false)
  const [screenSize, setScreenSize] = useState({ width: 1200, height: 800 })

  // Detect screen size and set mounted flag
  useEffect(() => {
    // Set actual screen size once mounted (client-side only)
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
    setMounted(true)

    const updateSize = () => {
      setScreenSize({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      })
    }
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Calculate image size: fit within 70% of screen (both width AND height)
  // Memoize to prevent recalculation on every render
  const { imageUrl, displayWidth, displayHeight } = useMemo(() => {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    
    // Define the bounding box (70% of screen)
    const maxWidth = screenSize.width * 0.7
    const maxHeight = screenSize.height * 0.7
    
    const aspectRatio = image.dimensions.aspectRatio
    
    // Calculate dimensions if we constrain by width
    const widthConstrainedW = maxWidth
    const widthConstrainedH = maxWidth / aspectRatio
    
    // Calculate dimensions if we constrain by height
    const heightConstrainedW = maxHeight * aspectRatio
    const heightConstrainedH = maxHeight
    
    // Choose whichever fits within BOTH constraints
    let finalWidth: number
    let finalHeight: number
    
    if (widthConstrainedH <= maxHeight) {
      // Width-constrained version fits within height limit
      finalWidth = widthConstrainedW
      finalHeight = widthConstrainedH
    } else {
      // Height-constrained version needed
      finalWidth = heightConstrainedW
      finalHeight = heightConstrainedH
    }
    
    // Round to integers
    const cssWidth = Math.round(finalWidth)
    const cssHeight = Math.round(finalHeight)
    
    // Request at device pixel ratio for retina displays (2x, 3x, etc)
    const targetWidth = Math.round(cssWidth * dpr)
    const targetHeight = Math.round(cssHeight * dpr)

    // Use Sanity's image CDN with proper parameters
    const url = urlFor(image.imageAsset)
      .width(targetWidth)
      .height(targetHeight)
      .fit('max') // Don't crop, just constrain to max dimensions
      .auto('format') // Automatically choose best format (webp, etc)
      .quality(90)
      .url()

    return {
      imageUrl: url,
      displayWidth: cssWidth,
      displayHeight: cssHeight
    }
  }, [image, screenSize.width, screenSize.height])

  const handleImageLoad = () => {
    if (onImageLoad) {
      onImageLoad()
    }
  }

  return (
    <Image
      key={image.assetId} // Force remount on image change for instant snap
      src={imageUrl}
      alt={image.altText}
      width={displayWidth}
      height={displayHeight}
      className={styles.image}
      placeholder="blur"
      blurDataURL={image.lqip}
      priority
      onLoad={handleImageLoad}
      onClick={onClick}
      style={{ 
        borderRadius,
        cursor: onClick ? 'pointer' : 'default',
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
        maxWidth: '70vw',
        maxHeight: '70vh',
        opacity: (mounted && !loading) ? 1 : 0,
        transition: loading ? 'none' : 'opacity 0.3s ease-in-out', // No transition when loading (instant snap)
      }}
      suppressHydrationWarning
    />
  )
}


