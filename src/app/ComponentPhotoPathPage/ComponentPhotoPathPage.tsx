'use client'

import PhotoPath from '@/components/PhotoPath/PhotoPath'
import { GalleryImage } from '@/lib/image-hat'
import styles from './ComponentPhotoPathPage.module.css'

interface ComponentPhotoPathPageProps {
  image: GalleryImage | null
}

export default function ComponentPhotoPathPage({ image }: ComponentPhotoPathPageProps) {
  if (!image) {
    return (
      <div className={styles.componentPhotoPathPage}>
        <p>No gallery images available</p>
      </div>
    )
  }
  
  return (
    <div className={styles.componentPhotoPathPage}>
      <PhotoPath image={image} />
    </div>
  )
}

