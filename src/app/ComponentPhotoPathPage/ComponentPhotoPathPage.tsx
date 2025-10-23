'use client'

import { useState, useEffect } from 'react'
import PhotoPath from '@/components/PhotoPath/PhotoPath'
import Button from '@/components/Button/Button'
import { GalleryImage, pickRandomImage } from '@/lib/image-hat'
import { client } from '@/sanity/lib/client'
import { allGalleryImagesQuery } from '@/sanity/lib/galleries-queries'
import styles from './ComponentPhotoPathPage.module.css'

interface ComponentPhotoPathPageProps {
  image: GalleryImage | null
}

export default function ComponentPhotoPathPage({ image: initialImage }: ComponentPhotoPathPageProps) {
  const [currentImage, setCurrentImage] = useState<GalleryImage | null>(initialImage)
  const [allImages, setAllImages] = useState<GalleryImage[]>([])
  const [pathResetTrigger, setPathResetTrigger] = useState(0)
  const [addPathTrigger, setAddPathTrigger] = useState(0)
  
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
  
  const handleNewImage = () => {
    if (allImages.length > 0) {
      const newImage = pickRandomImage(allImages)
      setCurrentImage(newImage)
      setPathResetTrigger(prev => prev + 1) // Trigger path reset
    }
  }
  
  const handleAddPath = () => {
    setAddPathTrigger(prev => prev + 1)
  }
  
  if (!currentImage) {
    return (
      <div className={styles.componentPhotoPathPage}>
        <p>No gallery images available</p>
      </div>
    )
  }
  
  return (
    <div className={styles.componentPhotoPathPage}>
      <div className={styles.controls}>
        <Button variant="primary" onClick={handleNewImage}>
          NEW IMAGE
        </Button>
        <Button variant="secondary" onClick={handleAddPath}>
          ADD PATH
        </Button>
      </div>
      <PhotoPath 
        image={currentImage} 
        pathResetTrigger={pathResetTrigger}
        addPathTrigger={addPathTrigger}
      />
    </div>
  )
}

