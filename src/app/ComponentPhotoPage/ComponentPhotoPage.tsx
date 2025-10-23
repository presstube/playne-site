'use client'

import { useState, useEffect } from 'react'
import Photo from '@/components/Photo/Photo'
import { GalleryImage, pickRandomImage } from '@/lib/image-hat'
import { client } from '@/sanity/lib/client'
import { allGalleryImagesQuery } from '@/sanity/lib/galleries-queries'
import styles from './ComponentPhotoPage.module.css'

interface ComponentPhotoPageProps {
  image: GalleryImage | null
}

export default function ComponentPhotoPage({ image: initialImage }: ComponentPhotoPageProps) {
  const [currentImage, setCurrentImage] = useState<GalleryImage | null>(initialImage)
  const [allImages, setAllImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Fetch all images on mount for client-side respawning
  useEffect(() => {
    async function fetchImages() {
      try {
        const images = await client.fetch(allGalleryImagesQuery)
        setAllImages(images)
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }
    fetchImages()
  }, [])
  
  const handleImageClick = () => {
    if (allImages.length > 0) {
      setIsLoading(true)
      // Pick a different image (not the current one)
      let newImage = pickRandomImage(allImages)
      let attempts = 0
      while (newImage?.assetId === currentImage?.assetId && attempts < 10) {
        newImage = pickRandomImage(allImages)
        attempts++
      }
      setCurrentImage(newImage)
    }
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }
  
  if (!currentImage) {
    return (
      <div className={styles.componentPhotoPage}>
        <p>No gallery images available</p>
      </div>
    )
  }
  
  return (
    <div className={styles.componentPhotoPage}>
      <Photo 
        image={currentImage} 
        onClick={handleImageClick}
        loading={isLoading}
        onImageLoad={handleImageLoad}
      />
    </div>
  )
}

