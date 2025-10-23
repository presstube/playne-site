'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { GalleryImage } from '@/lib/image-hat'
import { urlFor } from '@/sanity/lib/image'
import styles from './Photo.module.css'

interface PhotoProps {
  image: GalleryImage
  borderRadius?: string
}

export default function Photo({ image, borderRadius = '8px' }: PhotoProps) {
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
  const isPortrait = image.dimensions.aspectRatio < 1
  const maxDimension = isPortrait 
    ? Math.round(screenSize.height * 0.8)
    : Math.round(screenSize.width * 0.8)

  const imageUrl = urlFor(image.imageAsset)
    .width(maxDimension)
    .quality(90)
    .url()

  // Calculate max dimensions for CSS constraint
  const maxWidth = isPortrait ? 'auto' : '80vw'
  const maxHeight = isPortrait ? '80vh' : 'auto'

  return (
    <div 
      className={styles.photo}
      style={{ borderRadius }}
      suppressHydrationWarning
    >
      <Image
        src={imageUrl}
        alt={image.altText}
        width={image.dimensions.width}
        height={image.dimensions.height}
        className={styles.image}
        placeholder="blur"
        blurDataURL={image.lqip}
        style={{ 
          borderRadius,
          maxWidth,
          maxHeight,
          width: isPortrait ? 'auto' : '100%',
          height: isPortrait ? '100%' : 'auto',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.1s ease-in',
        }}
      />
    </div>
  )
}

