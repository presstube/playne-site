'use client'

import { useState, useEffect, useCallback } from 'react'
import { urlFor } from '@/sanity/lib/image'
import { GalleryImage } from '@/lib/image-hat'
import styles from './StoryFragment.module.css'

interface StoryFragmentProps {
  images: GalleryImage[]
}

export default function StoryFragment({ images }: StoryFragmentProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  // Set mounted flag on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle click - show random image
  const handleClick = useCallback(() => {
    if (images.length === 0) return
    
    const randomIndex = Math.floor(Math.random() * images.length)
    setCurrentIndex(randomIndex)
  }, [images.length])

  // Handle keyboard navigation
  useEffect(() => {
    if (!mounted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => {
          if (prev === null) return 0
          return (prev + 1) % images.length
        })
      }
      
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => {
          if (prev === null) return 0
          return (prev - 1 + images.length) % images.length
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mounted, images.length])

  // Get current image URL
  const currentImageUrl = currentIndex !== null && images[currentIndex]
    ? urlFor(images[currentIndex].imageAsset)
        .width(1600)  // Request high quality, aspect ratio will be preserved
        .fit('max')   // Don't crop, just constrain max dimension
        .quality(90)
        .url()
    : null

  const currentImage = currentIndex !== null ? images[currentIndex] : null

  return (
    <div className={styles.container} onClick={handleClick}>
      {mounted && currentImageUrl && currentImage && (
        <img
          src={currentImageUrl}
          alt={currentImage.altText || 'Gallery image'}
          className={styles.image}
        />
      )}
    </div>
  )
}

