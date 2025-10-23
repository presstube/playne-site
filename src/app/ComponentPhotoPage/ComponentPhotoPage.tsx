'use client'

import Photo from '@/components/Photo/Photo'
import { GalleryImage } from '@/lib/image-hat'
import styles from './ComponentPhotoPage.module.css'

interface ComponentPhotoPageProps {
  image: GalleryImage | null
}

export default function ComponentPhotoPage({ image }: ComponentPhotoPageProps) {
  if (!image) {
    return (
      <div className={styles.componentPhotoPage}>
        <p>No gallery images available</p>
      </div>
    )
  }
  
  return (
    <div className={styles.componentPhotoPage}>
      <Photo image={image} />
    </div>
  )
}

