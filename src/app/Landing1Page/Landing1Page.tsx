'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './Landing1Page.module.css'
import BrandHero from '@/components/BrandHero/BrandHero'
import Headline from '@/components/Headline/Headline'
import Photo from '@/components/Photo/Photo'
import TitleBodyQuote from '@/components/TitleBodyQuote/TitleBodyQuote'
import PhotoTextOverlay from '@/components/PhotoTextOverlay/PhotoTextOverlay'
import { GalleryImage, pickRandomImage } from '@/lib/image-hat'
import { client } from '@/sanity/lib/client'
import { allGalleryImagesQuery } from '@/sanity/lib/galleries-queries'

const STORAGE_KEY_FIRST = 'landing1-first-image-id'
const STORAGE_KEY_SECOND = 'landing1-second-image-id'

// Default image IDs
const DEFAULT_FIRST_IMAGE_ID = 'image-8b8bc31949a279893dd20ea9057da59d00cbfe5c-2048x1365-jpg'
const DEFAULT_SECOND_IMAGE_ID = 'image-f804373c1d301de9db9df3a72493c1556003120b-4240x2384-jpg'

export default function Landing1Page() {
  const [allImages, setAllImages] = useState<GalleryImage[]>([])
  const [firstImage, setFirstImage] = useState<GalleryImage | null>(null)
  const [secondImage, setSecondImage] = useState<GalleryImage | null>(null)

  // Fetch all images on mount
  useEffect(() => {
    async function fetchImages() {
      try {
        const images = await client.fetch(allGalleryImagesQuery)
        setAllImages(images)
        
        // Try to restore saved images from localStorage
        const savedFirstId = localStorage.getItem(STORAGE_KEY_FIRST)
        const savedSecondId = localStorage.getItem(STORAGE_KEY_SECOND)
        
        if (images.length > 0) {
          // Find saved images or use defaults
          const firstImg = savedFirstId 
            ? images.find(img => img.assetId === savedFirstId) || images.find(img => img.assetId === DEFAULT_FIRST_IMAGE_ID) || pickRandomImage(images)
            : images.find(img => img.assetId === DEFAULT_FIRST_IMAGE_ID) || pickRandomImage(images)
          const secondImg = savedSecondId
            ? images.find(img => img.assetId === savedSecondId) || images.find(img => img.assetId === DEFAULT_SECOND_IMAGE_ID) || pickRandomImage(images)
            : images.find(img => img.assetId === DEFAULT_SECOND_IMAGE_ID) || pickRandomImage(images)
          
          setFirstImage(firstImg)
          setSecondImage(secondImg)
          
          // Log current image IDs on load for easy hard-coding
          console.log('=== Landing/1 Current Images ===')
          console.log('First Image ID:', firstImg?.assetId || 'none')
          console.log('Second Image ID:', secondImg?.assetId || 'none')
          console.log('================================')
        }
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }
    fetchImages()
  }, [])

  const handleFirstPhotoClick = useCallback(() => {
    if (allImages.length > 0) {
      const newImage = pickRandomImage(allImages)
      setFirstImage(newImage)
      if (newImage?.assetId) {
        localStorage.setItem(STORAGE_KEY_FIRST, newImage.assetId)
        console.log('First Image - Sanity ID:', newImage.assetId)
      }
    }
  }, [allImages])

  const handleSecondPhotoClick = useCallback(() => {
    if (allImages.length > 0) {
      const newImage = pickRandomImage(allImages)
      setSecondImage(newImage)
      if (newImage?.assetId) {
        localStorage.setItem(STORAGE_KEY_SECOND, newImage.assetId)
        console.log('Second Image - Sanity ID:', newImage.assetId)
      }
    }
  }, [allImages])

  return (
    <div className={styles.page}>
      <div className={styles.heroSection}>
        <BrandHero />
      </div>
      
      <div className={styles.headlineSection}>
        <Headline
          text="What we wish we learned in school"
          caseType="all-caps"
          align="center"
          fg="var(--brand-black)"
          bg="transparent"
        />
      </div>

      {/* First Section: Photo with overlaid text */}
      {firstImage && (
        <PhotoTextOverlay textPosition="bottom-right" rotation={-2} overlap="18%">
          <div onClick={handleFirstPhotoClick} style={{ cursor: 'pointer', display: 'block', width: '100%' }}>
            <Photo image={firstImage} />
          </div>
          <TitleBodyQuote
            subtitle="What if school taught you about YOU?"
            body="Founded by renowned artist Shantell Martin, PLAYNE brings creativity into classrooms and community spaces to teach real-life skills. We help young people understand their bodies, emotions, money, and voice—the things that matter most but often get skipped in traditional education. Our lessons are hands-on, multisensory, and built around one simple idea: students should explore who and what they are before being told who to be."
            quote="When students explore who they are, they unlock what they can become."
            fg="var(--brand-offwhite)"
            bg="var(--brand-black)"
          />
        </PhotoTextOverlay>
      )}

      {/* Second Section: Four Pillars */}
      <div className={styles.pillarsSection}>
        <Headline
          text="Four Pathways to Discovering You"
          caseType="all-caps"
          align="center"
          fg="var(--brand-black)"
          bg="transparent"
        />
      </div>

      {secondImage && (
        <PhotoTextOverlay textPosition="bottom-left" rotation={2} overlap="18%">
          <div onClick={handleSecondPhotoClick} style={{ cursor: 'pointer', display: 'block', width: '100%' }}>
            <Photo image={secondImage} />
          </div>
          <TitleBodyQuote
            subtitle="The Four Pillars of PLAYNE"
            body="Think of them as the primary colors in your life's composition. <strong><em>Anatomy & Body Awareness.</em></strong> <strong><em>Wellness & Self-Care.</em></strong> <strong><em>Nutrition & Healthy Living.</em></strong> <strong><em>Financial Literacy.</em></strong> When you learn these fundamentals young, you gain the perspective to see your whole life as a work of art—understanding balance, contrast, harmony, and flow. Just like an artist mixes colors to create something new, these pillars blend together to help you create the life you want."
            quote="What if every child learned to paint their own future with confidence?"
            fg="var(--brand-black)"
            bg="var(--brand-yellow)"
          />
        </PhotoTextOverlay>
      )}
    </div>
  )
}

