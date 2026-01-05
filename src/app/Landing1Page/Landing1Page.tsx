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
        
        // Set initial images
        if (images.length > 0) {
          setFirstImage(pickRandomImage(images))
          setSecondImage(pickRandomImage(images))
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
        console.log('First Image - Sanity ID:', newImage.assetId)
      }
    }
  }, [allImages])

  const handleSecondPhotoClick = useCallback(() => {
    if (allImages.length > 0) {
      const newImage = pickRandomImage(allImages)
      setSecondImage(newImage)
      if (newImage?.assetId) {
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
          text="Teaching the things we wish we learned in school"
          caseType="title-case"
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
          caseType="title-case"
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

