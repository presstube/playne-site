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

  // Calculate image size: 80% of screen, respecting orientation
  // Memoize to prevent recalculation on every render
  const { isPortrait, maxWidth, maxHeight, imageUrl } = useMemo(() => {
    const portrait = image.dimensions.aspectRatio < 1
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    
    // Calculate CSS pixel dimensions
    const cssMaxWidth = portrait 
      ? Math.round(screenSize.height * 0.8 * image.dimensions.aspectRatio) 
      : Math.round(screenSize.width * 0.8)
    const cssMaxHeight = portrait 
      ? Math.round(screenSize.height * 0.8)
      : Math.round(screenSize.width * 0.8 / image.dimensions.aspectRatio)
    
    // Request at device pixel ratio for retina displays (2x, 3x, etc)
    const targetMaxWidth = Math.round(cssMaxWidth * dpr)
    const targetMaxHeight = Math.round(cssMaxHeight * dpr)

    // Use Sanity's image CDN with proper parameters
    const url = urlFor(image.imageAsset)
      .width(targetMaxWidth)
      .height(targetMaxHeight)
      .fit('max') // Don't crop, just constrain to max dimensions
      .auto('format') // Automatically choose best format (webp, etc)
      .quality(90)
      .url()

    return {
      isPortrait: portrait,
      maxWidth: portrait ? 'auto' : '80vw',
      maxHeight: portrait ? '80vh' : 'auto',
      imageUrl: url
    }
  }, [image, screenSize.width, screenSize.height])

  const handleImageLoad = () => {
    if (onImageLoad) {
      onImageLoad()
    }
  }

  return (
    <div 
      className={styles.photo}
      style={{ 
        borderRadius,
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: 'var(--brand-black)',
      }}
      onClick={onClick}
      suppressHydrationWarning
    >
      <Image
        key={image.assetId} // Force remount on image change for instant snap
        src={imageUrl}
        alt={image.altText}
        width={image.dimensions.width}
        height={image.dimensions.height}
        className={styles.image}
        placeholder="blur"
        blurDataURL={image.lqip}
        priority
        onLoad={handleImageLoad}
        style={{ 
          borderRadius,
          maxWidth,
          maxHeight,
          width: isPortrait ? 'auto' : '100%',
          height: isPortrait ? '100%' : 'auto',
          opacity: (mounted && !loading) ? 1 : 0,
          transition: loading ? 'none' : 'opacity 0.3s ease-in-out', // No transition when loading (instant snap)
        }}
      />
    </div>
  )
}


