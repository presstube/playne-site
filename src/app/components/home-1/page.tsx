'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './page.module.css'
import BrandShaderHero from '@/components/BrandShaderHero/BrandShaderHero'
import TitleBodyQuote from '@/components/TitleBodyQuote/TitleBodyQuote'
import Photo from '@/components/Photo/Photo'
import { GalleryImage, pickRandomImage } from '@/lib/image-hat'
import { client } from '@/sanity/lib/client'
import { allGalleryImagesQuery } from '@/sanity/lib/galleries-queries'

// TitleBodyQuote demo data
const SUBTITLE_BODY = [
  {
    subtitle: "Who Are We?",
    body: "Founded by Shantell Martin, Playne creates engaging, interactive learning experiences that foster confidence, critical thinking, and self‑expression."
  },
  {
    subtitle: "What We Do",
    body: "We pair original artworks with thoughtfully designed lessons so students can explore their bodies, feelings, and ideas through drawing, movement, and discussion."
  },
  {
    subtitle: "How It Works",
    body: "Simple materials, open prompts, and plenty of reflection. Lessons are flexible, welcoming, and built to work in classrooms, after‑school programs, and community spaces."
  },
  {
    subtitle: "Why Playne?",
    body: "Because young people deserve tools that help them think freely, care for themselves and others, and imagine new possibilities."
  },
  {
    subtitle: "Our Approach",
    body: "Playful, practical, and people‑centered. We blend observation, making, and conversation to help ideas click in the hands, the body, and the mind."
  },
]

const PULL_QUOTES = [
  "Art teaches more than technique — it teaches resilience, adaptability, and the ability to see the world in new ways.",
  "We ask students who they are before telling them who to be.",
  "Learning becomes real when hands, bodies, and ideas move together.",
  "Confidence grows when we make, reflect, and try again — gently.",
  "A single line can open a conversation that changes the day.",
]

const LSO_PHOTO_KEY = 'home1-photo'
const LSO_TBQ_KEY = 'home1-tbq'

export default function Page() {
  const [currentImage, setCurrentImage] = useState<GalleryImage | null>(null)
  const [allImages, setAllImages] = useState<GalleryImage[]>([])
  const [isPhotoLoading, setIsPhotoLoading] = useState(false)
  
  // TitleBodyQuote state
  const [tbqSubBodyIdx, setTbqSubBodyIdx] = useState(1) // Start with "What We Do" (index 1)
  const [tbqQuoteIdx, setTbqQuoteIdx] = useState(2) // Start with "Learning becomes real..." (index 2)
  const [tbqIsDark, setTbqIsDark] = useState(true)

  // Load saved states from localStorage on mount
  useEffect(() => {
    const savedTbq = localStorage.getItem(LSO_TBQ_KEY)
    if (savedTbq) {
      try {
        const parsed = JSON.parse(savedTbq)
        setTbqSubBodyIdx(parsed.subBodyIdx ?? 1)
        setTbqQuoteIdx(parsed.quoteIdx ?? 2)
        setTbqIsDark(parsed.isDark ?? true)
      } catch (e) {
        console.error('Error parsing saved TBQ state:', e)
      }
    }
  }, [])

  // Fetch gallery images for Photo
  useEffect(() => {
    async function fetchImages() {
      try {
        const images = await client.fetch(allGalleryImagesQuery)
        setAllImages(images)
        
        // Check if we have a saved photo
        const savedPhoto = localStorage.getItem(LSO_PHOTO_KEY)
        if (savedPhoto) {
          try {
            const parsed = JSON.parse(savedPhoto)
            console.log('Loaded saved photo:', parsed)
            setCurrentImage(parsed)
          } catch (e) {
            console.error('Error parsing saved photo:', e)
            // Fallback to random
            if (images.length > 0) {
              const initialImage = pickRandomImage(images)
              console.log('Initial photo loaded:', initialImage)
              setCurrentImage(initialImage)
            }
          }
        } else if (images.length > 0) {
          const initialImage = pickRandomImage(images)
          console.log('Initial photo loaded:', initialImage)
          setCurrentImage(initialImage)
        }
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }
    fetchImages()
  }, [])

  const handlePhotoClick = useCallback(() => {
    if (allImages.length > 0) {
      setIsPhotoLoading(true)
      // Pick a different image (not the current one)
      let newImage = pickRandomImage(allImages)
      let attempts = 0
      while (newImage?.assetId === currentImage?.assetId && attempts < 10) {
        newImage = pickRandomImage(allImages)
        attempts++
      }
      console.log('New photo loaded:', newImage)
      setCurrentImage(newImage)
      // Save to localStorage
      if (newImage) {
        localStorage.setItem(LSO_PHOTO_KEY, JSON.stringify(newImage))
      }
    }
  }, [allImages, currentImage])

  const handlePhotoLoad = useCallback(() => {
    setIsPhotoLoading(false)
  }, [])

  const handleTbqClick = useCallback(() => {
    const newSubBodyIdx = (tbqSubBodyIdx + 1) % SUBTITLE_BODY.length
    const newQuoteIdx = (tbqQuoteIdx + 1) % PULL_QUOTES.length
    const newIsDark = Math.random() < 0.5
    
    setTbqSubBodyIdx(newSubBodyIdx)
    setTbqQuoteIdx(newQuoteIdx)
    setTbqIsDark(newIsDark)
    
    // Save to localStorage
    localStorage.setItem(LSO_TBQ_KEY, JSON.stringify({
      subBodyIdx: newSubBodyIdx,
      quoteIdx: newQuoteIdx,
      isDark: newIsDark
    }))
  }, [tbqSubBodyIdx, tbqQuoteIdx])

  return (
    <div className={styles.page}>
      <BrandShaderHero />
      
      <div 
        className={styles.titleBodyQuoteContainer}
        onClick={handleTbqClick}
        role="button"
        aria-label="Click to cycle content and theme"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleTbqClick()
          }
        }}
      >
        <TitleBodyQuote
          subtitle={SUBTITLE_BODY[tbqSubBodyIdx].subtitle}
          body={SUBTITLE_BODY[tbqSubBodyIdx].body}
          quote={PULL_QUOTES[tbqQuoteIdx]}
          isDark={tbqIsDark}
        />
      </div>

      <div className={styles.photoContainer}>
        {currentImage ? (
          <Photo 
            image={currentImage} 
            onClick={handlePhotoClick}
            loading={isPhotoLoading}
            onImageLoad={handlePhotoLoad}
          />
        ) : (
          <p>Loading images...</p>
        )}
      </div>
    </div>
  )
}

