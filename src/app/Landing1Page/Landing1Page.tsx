'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './Landing1Page.module.css'
import BrandHero from '@/components/BrandHero/BrandHero'
import Headline from '@/components/Headline/Headline'
import Photo from '@/components/Photo/Photo'
import TitleBodyQuote from '@/components/TitleBodyQuote/TitleBodyQuote'
import PhotoTextOverlay from '@/components/PhotoTextOverlay/PhotoTextOverlay'
import PathDrawingOverlay from '@/components/PathDrawingOverlay/PathDrawingOverlay'
import { useLandingTheme, THEME_COLORS } from '@/contexts/LandingThemeContext'
import { GalleryImage, pickRandomImage } from '@/lib/image-hat'
import { client } from '@/sanity/lib/client'
import { allGalleryImagesQuery } from '@/sanity/lib/galleries-queries'
import { PLAYNE_LOGO_PATH } from '@/components/shared/playne-logo-path'

const STORAGE_KEY_FIRST = 'landing1-first-image-id'
const STORAGE_KEY_SECOND = 'landing1-second-image-id'
const STORAGE_KEY_THIRD = 'landing1-third-image-id'
const STORAGE_KEY_FOURTH = 'landing1-fourth-image-id'

// All localStorage keys used by Landing/1
const ALL_LANDING_STORAGE_KEYS = [
  STORAGE_KEY_FIRST,
  STORAGE_KEY_SECOND,
  STORAGE_KEY_THIRD,
  STORAGE_KEY_FOURTH,
  'landing1-bg-path-raw',
  'landing1-path-color-index',
  'landing1-theme',
]

// Default image IDs
const DEFAULT_FIRST_IMAGE_ID = 'image-8b8bc31949a279893dd20ea9057da59d00cbfe5c-2048x1365-jpg'
const DEFAULT_SECOND_IMAGE_ID = 'image-f804373c1d301de9db9df3a72493c1556003120b-4240x2384-jpg'
const DEFAULT_THIRD_IMAGE_ID = 'image-a18f4bd36df2aec4a0a2b80d6ea3d5e9bcae8050-5250x3500-jpg'
const DEFAULT_FOURTH_IMAGE_ID = 'image-1a3757910370425fdce03a9b2c25623acac10456-2531x1615-jpg'

export default function Landing1Page() {
  const { theme } = useLandingTheme()
  const [allImages, setAllImages] = useState<GalleryImage[]>([])
  const [firstImage, setFirstImage] = useState<GalleryImage | null>(null)
  const [secondImage, setSecondImage] = useState<GalleryImage | null>(null)
  const [thirdImage, setThirdImage] = useState<GalleryImage | null>(null)
  const [fourthImage, setFourthImage] = useState<GalleryImage | null>(null)

  // Expose clear function to window for easy access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).clearLandingLSO = () => {
        ALL_LANDING_STORAGE_KEYS.forEach(key => {
          localStorage.removeItem(key)
        })
        console.log('✅ Cleared all Landing/1 localStorage:')
        console.log('   - Images (first, second, third, fourth)')
        console.log('   - Path raw points')
        console.log('   - Path color')
        console.log('   - Theme (background)')
        console.log('Reload the page to see defaults.')
      }
      console.log('💡 Use window.clearLandingLSO() to reset all Landing/1 settings')
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).clearLandingLSO
      }
    }
  }, [])

  // Fetch all images on mount
  useEffect(() => {
    async function fetchImages() {
      try {
        const images = await client.fetch(allGalleryImagesQuery)
        setAllImages(images)
        
        // Try to restore saved images from localStorage (client-side only)
        const savedFirstId = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_FIRST) : null
        const savedSecondId = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_SECOND) : null
        const savedThirdId = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_THIRD) : null
        const savedFourthId = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_FOURTH) : null
        
        if (images.length > 0) {
          // Find saved images or use defaults
          const firstImg = savedFirstId 
            ? images.find((img: GalleryImage) => img.assetId === savedFirstId) || images.find((img: GalleryImage) => img.assetId === DEFAULT_FIRST_IMAGE_ID) || pickRandomImage(images)
            : images.find((img: GalleryImage) => img.assetId === DEFAULT_FIRST_IMAGE_ID) || pickRandomImage(images)
          const secondImg = savedSecondId
            ? images.find((img: GalleryImage) => img.assetId === savedSecondId) || images.find((img: GalleryImage) => img.assetId === DEFAULT_SECOND_IMAGE_ID) || pickRandomImage(images)
            : images.find((img: GalleryImage) => img.assetId === DEFAULT_SECOND_IMAGE_ID) || pickRandomImage(images)
          const thirdImg = savedThirdId
            ? images.find((img: GalleryImage) => img.assetId === savedThirdId) || (DEFAULT_THIRD_IMAGE_ID ? images.find((img: GalleryImage) => img.assetId === DEFAULT_THIRD_IMAGE_ID) : null) || pickRandomImage(images)
            : (DEFAULT_THIRD_IMAGE_ID ? images.find((img: GalleryImage) => img.assetId === DEFAULT_THIRD_IMAGE_ID) : null) || pickRandomImage(images)
          const fourthImg = savedFourthId
            ? images.find((img: GalleryImage) => img.assetId === savedFourthId) || images.find((img: GalleryImage) => img.assetId === DEFAULT_FOURTH_IMAGE_ID) || pickRandomImage(images)
            : images.find((img: GalleryImage) => img.assetId === DEFAULT_FOURTH_IMAGE_ID) || pickRandomImage(images)
          
          setFirstImage(firstImg)
          setSecondImage(secondImg)
          setThirdImage(thirdImg)
          setFourthImage(fourthImg)
          
          // Log current image IDs on load for easy hard-coding
          console.log('=== Landing/1 Current Images ===')
          console.log('First Image ID:', firstImg?.assetId || 'none')
          console.log('Second Image ID:', secondImg?.assetId || 'none')
          console.log('Third Image ID:', thirdImg?.assetId || 'none')
          console.log('Fourth Image ID:', fourthImg?.assetId || 'none')
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

  const handleThirdPhotoClick = useCallback(() => {
    if (allImages.length > 0) {
      const newImage = pickRandomImage(allImages)
      setThirdImage(newImage)
      if (newImage?.assetId) {
        console.log('Third Image - Sanity ID:', newImage.assetId)
      }
    }
  }, [allImages])

  const handleFourthPhotoClick = useCallback(() => {
    if (allImages.length > 0) {
      const newImage = pickRandomImage(allImages)
      setFourthImage(newImage)
      if (newImage?.assetId) {
        console.log('Fourth Image - Sanity ID:', newImage.assetId)
      }
    }
  }, [allImages])

  return (
    <div className={styles.page}>
      <PathDrawingOverlay />
      
      <div className={styles.heroSection}>
        <BrandHero theme={theme} />
      </div>
      
      <div className={styles.headlineSection}>
        <Headline
          text="What we wish we learned in school"
          caseType="all-caps"
          align="center"
          fg={THEME_COLORS[theme].text}
          bg="transparent"
        />
      </div>

      {/* First Section: Photo with overlaid text */}
      {firstImage && (
        <PhotoTextOverlay textPosition="bottom-right" rotation={-2} overlap="18%">
          <div onClick={handleFirstPhotoClick} style={{ cursor: 'pointer', display: 'block', width: '100%', position: 'relative' }}>
            <Photo image={firstImage} />
            {firstImage.photographer && (
              <div className={`${styles.photographer} ${styles.photographerLeft}`}>
                Photo: {firstImage.photographer}
              </div>
            )}
          </div>
          <TitleBodyQuote
            subtitle="What if school taught you about YOU?"
            body="Founded by renowned artist Shantell Martin, PLAYNE brings creativity into classrooms and community spaces to teach real-life skills. We help young people understand their bodies, emotions, money, and voice, the things that matter most but often get skipped in traditional education. Our lessons are hands-on, multi-sensory, and built around one simple idea: students should explore who and what they are before being told who to be."
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
          fg={THEME_COLORS[theme].text}
          bg="transparent"
        />
      </div>

      {secondImage && (
        <PhotoTextOverlay textPosition="bottom-left" rotation={2} overlap="18%">
          <div onClick={handleSecondPhotoClick} style={{ cursor: 'pointer', display: 'block', width: '100%', position: 'relative' }}>
            <Photo image={secondImage} />
            {secondImage.photographer && (
              <div className={`${styles.photographer} ${styles.photographerRight}`}>
                Photo: {secondImage.photographer}
              </div>
            )}
          </div>
          <TitleBodyQuote
            subtitle="The Four Pillars of PLAYNE"
            body="Think of them as the primary colors in your life's composition. <strong><em>Anatomy & Body Awareness.</em></strong> <strong><em>Wellness & Self-Care.</em></strong> <strong><em>Nutrition & Healthy Living.</em></strong> <strong><em>Financial Literacy.</em></strong> When you learn these fundamentals young, you gain the perspective to see your whole life as a work of art, understanding balance, contrast, harmony, and flow. Just like an artist mixes colors to create something new, these pillars blend together to help you create the life you want."
            quote="What if every child learned to paint their own future with confidence?"
            fg="var(--brand-black)"
            bg="var(--brand-yellow)"
          />
        </PhotoTextOverlay>
      )}

      {/* Third Section: Meet Shantell */}
      <div className={styles.shantellSection}>
        <Headline
          text="Meet the founder"
          caseType="all-caps"
          align="center"
          fg={THEME_COLORS[theme].text}
          bg="transparent"
        />
      </div>

      {thirdImage && (
        <PhotoTextOverlay textPosition="bottom-right" rotation={-2} overlap="18%">
          <div onClick={handleThirdPhotoClick} style={{ cursor: 'pointer', display: 'block', width: '100%', position: 'relative' }}>
            <Photo image={thirdImage} />
            {thirdImage.photographer && (
              <div className={`${styles.photographer} ${styles.photographerLeft}`}>
                Photo: {thirdImage.photographer}
              </div>
            )}
          </div>
          <TitleBodyQuote
            subtitle="The Magic of Shantell Martin"
            body="Visual artist, philosopher, teacher, Shantell Martin is a creative force who's performed at MoMA, collaborated with Kendrick Lamar, and collaborated with brands like Tiffany & Co and The North Face. But her superpower isn't just making incredible art. It's her ability to unlock creativity in everyone she meets. Growing up, Shantell learned through doing, drawing, questioning, never memorizing answers but discovering them. That's the spark she brings to PLAYNE: the belief that education should feel like exploration, and that every young person deserves to learn about themselves with the same curiosity and freedom an artist brings to a blank canvas."
            quote="Education isn't about filling empty vessels. It's about igniting curious minds."
            fg="var(--brand-black)"
            bg="var(--brand-blue)"
          />
        </PhotoTextOverlay>
      )}

      {/* Fourth Section: Get in Touch */}
      <div className={styles.contactSection}>
        <Headline
          text="Let's create something together"
          caseType="all-caps"
          align="center"
          fg={THEME_COLORS[theme].text}
          bg="transparent"
        />
      </div>

      {fourthImage && (
        <PhotoTextOverlay textPosition="bottom-left" rotation={2} overlap="55%">
          <div onClick={handleFourthPhotoClick} style={{ cursor: 'pointer', display: 'block', width: '100%', position: 'relative' }}>
            <Photo image={fourthImage} />
            {fourthImage.photographer && (
              <div className={`${styles.photographer} ${styles.photographerRight}`}>
                Photo: {fourthImage.photographer}
              </div>
            )}
          </div>
          <TitleBodyQuote
            subtitle="Ready to bring PLAYNE to your school or community?"
            body="We'd love to hear from you. Whether you're an educator looking to spark creativity in your classroom, a community leader wanting to empower young people, or someone who believes kids deserve better tools to navigate life—let's talk. Every great collaboration starts with a conversation. What could we create together?"
            quote="The best time to plant a tree was 20 years ago. The second best time is now."
            fg="var(--brand-black)"
            bg="var(--brand-offwhite)"
            className={styles.noBorder}
            cta={
              <a href="mailto:playne@shantellmartin.com" className={styles.emailLink}>
                EMAIL US
              </a>
            }
          />
        </PhotoTextOverlay>
      )}

      {/* Bottom spacing and small brand logo */}
      <div className={styles.bottomSection}>
        <a href="mailto:playne@shantellmartin.com" aria-label="Email PLAYNE">
          <svg viewBox="0 0 4000 1393.81" xmlns="http://www.w3.org/2000/svg" className={styles.smallBrandLogo}>
            <path fill="var(--brand-red)" d={PLAYNE_LOGO_PATH} />
          </svg>
        </a>
      </div>
    </div>
  )
}


