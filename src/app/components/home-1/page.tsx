'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './page.module.css'
import BrandShaderHero from '@/components/BrandShaderHero/BrandShaderHero'
import TitleBodyQuote from '@/components/TitleBodyQuote/TitleBodyQuote'
import Photo from '@/components/Photo/Photo'
import PathContainer from '@/components/PathContainer/PathContainer'
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
const LSO_PATH_KEY = 'home1-path'
const LSO_TBQ2_KEY = 'home1-tbq2'
const LSO_PHOTO2_KEY = 'home1-photo2'

// Brand colors for PathContainer background
const PATH_BRAND_COLORS = [
  '#231f20', // black
  '#FC555B', // red
  '#FCDC4A', // yellow
  '#FB6DCB', // pink
  '#A9ECD4', // blue
  '#EAEADA', // offwhite
]

// Brand colors for TitleBodyQuote background
const TBQ_BG_COLORS = [
  { bg: '#231f20', fg: '#EAEADA' }, // black bg, offwhite text
  { bg: '#FC555B', fg: '#EAEADA' }, // red bg, offwhite text
  { bg: '#FCDC4A', fg: '#231f20' }, // yellow bg, black text
  { bg: '#FB6DCB', fg: '#EAEADA' }, // pink bg, offwhite text
  { bg: '#A9ECD4', fg: '#231f20' }, // blue bg, black text
  { bg: '#EAEADA', fg: '#231f20' }, // offwhite bg, black text
]

interface PathContainerConfig {
  width: number
  height: number
  bgColor: string
  pathCount: number
  seed: number // Add seed for reproducible paths
}

export default function Page() {
  const [currentImage, setCurrentImage] = useState<GalleryImage | null>(null)
  const [allImages, setAllImages] = useState<GalleryImage[]>([])
  const [isPhotoLoading, setIsPhotoLoading] = useState(false)
  
  // Second photo state
  const [currentImage2, setCurrentImage2] = useState<GalleryImage | null>(null)
  const [isPhoto2Loading, setIsPhoto2Loading] = useState(false)
  
  // TitleBodyQuote state
  const [tbqSubBodyIdx, setTbqSubBodyIdx] = useState(1) // Start with "What We Do" (index 1)
  const [tbqQuoteIdx, setTbqQuoteIdx] = useState(2) // Start with "Learning becomes real..." (index 2)

  // Second TitleBodyQuote state
  const [tbq2SubBodyIdx, setTbq2SubBodyIdx] = useState(0) // Start with "Who Are We?" (index 0)
  const [tbq2QuoteIdx, setTbq2QuoteIdx] = useState(0) // Start with first quote
  const [tbq2ColorIdx, setTbq2ColorIdx] = useState(0) // Start with black bg

  // PathContainer state
  const [mounted, setMounted] = useState(false)
  const [pathContainer, setPathContainer] = useState<PathContainerConfig | null>(null)
  const [pathContainerKey, setPathContainerKey] = useState(0)

  // Load saved states from localStorage on mount
  useEffect(() => {
    const savedTbq = localStorage.getItem(LSO_TBQ_KEY)
    if (savedTbq) {
      try {
        const parsed = JSON.parse(savedTbq)
        setTbqSubBodyIdx(parsed.subBodyIdx ?? 1)
        setTbqQuoteIdx(parsed.quoteIdx ?? 2)
      } catch (e) {
        console.error('Error parsing saved TBQ state:', e)
      }
    }

    const savedTbq2 = localStorage.getItem(LSO_TBQ2_KEY)
    if (savedTbq2) {
      try {
        const parsed = JSON.parse(savedTbq2)
        setTbq2SubBodyIdx(parsed.subBodyIdx ?? 0)
        setTbq2QuoteIdx(parsed.quoteIdx ?? 0)
        setTbq2ColorIdx(parsed.colorIdx ?? 0)
      } catch (e) {
        console.error('Error parsing saved TBQ2 state:', e)
      }
    }

    // Load saved PathContainer config
    const savedPath = localStorage.getItem(LSO_PATH_KEY)
    if (savedPath) {
      try {
        const parsed = JSON.parse(savedPath)
        console.log('Loading saved PathContainer config:', parsed)
        setPathContainer(parsed)
      } catch (e) {
        console.error('Error parsing saved path config:', e)
      }
    } else {
      console.log('No saved PathContainer config found')
    }
    
    setMounted(true)
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
        
        // Check if we have a saved second photo
        const savedPhoto2 = localStorage.getItem(LSO_PHOTO2_KEY)
        if (savedPhoto2) {
          try {
            const parsed = JSON.parse(savedPhoto2)
            console.log('Loaded saved photo 2:', parsed)
            setCurrentImage2(parsed)
          } catch (e) {
            console.error('Error parsing saved photo 2:', e)
            // Fallback to random
            if (images.length > 0) {
              const initialImage = pickRandomImage(images)
              console.log('Initial photo 2 loaded:', initialImage)
              setCurrentImage2(initialImage)
            }
          }
        } else if (images.length > 0) {
          const initialImage = pickRandomImage(images)
          console.log('Initial photo 2 loaded:', initialImage)
          setCurrentImage2(initialImage)
        }
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }
    fetchImages()
  }, [])

  // Generate PathContainer client-side only
  const generatePathContainer = useCallback(() => {
    // 30% chance to go full width, 70% chance for random size
    const shouldGoFullWidth = Math.random() < 0.3
    
    let width: number
    let height: number
    
    if (shouldGoFullWidth) {
      // Full width minus padding
      width = typeof window !== 'undefined' ? window.innerWidth - 64 : 1200 // 64 = 2rem * 2 sides * 16px
      height = Math.floor(200 + Math.random() * 500) // 200-700px height
    } else {
      // Radical variety in dimensions
      const minWidth = 300
      const maxWidth = 1000
      const minHeight = 200
      const maxHeight = 700
      
      width = Math.floor(minWidth + Math.random() * (maxWidth - minWidth))
      height = Math.floor(minHeight + Math.random() * (maxHeight - minHeight))
    }
    
    const pathCount = Math.floor(1 + Math.random() * 5) // 1-5 paths
    
    // Random background color from all brand colors
    const bgColor = PATH_BRAND_COLORS[Math.floor(Math.random() * PATH_BRAND_COLORS.length)]
    
    // Generate a unique seed for this configuration
    const seed = Math.random()
    
    const config = { width, height, bgColor, pathCount, seed }
    console.log('Generated new PathContainer config:', config)
    setPathContainer(config)
    
    // Save to localStorage
    localStorage.setItem(LSO_PATH_KEY, JSON.stringify(config))
  }, [setPathContainer])

  useEffect(() => {
    // Only generate if we don't have a saved config already loaded and we're mounted
    if (mounted && !pathContainer) {
      console.log('Generating new PathContainer (no saved config)')
      generatePathContainer()
    }
  }, [mounted, pathContainer, generatePathContainer])

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

  const handlePhoto2Click = useCallback(() => {
    if (allImages.length > 0) {
      setIsPhoto2Loading(true)
      // Pick a different image (not the current one)
      let newImage = pickRandomImage(allImages)
      let attempts = 0
      while (newImage?.assetId === currentImage2?.assetId && attempts < 10) {
        newImage = pickRandomImage(allImages)
        attempts++
      }
      console.log('New photo 2 loaded:', newImage)
      setCurrentImage2(newImage)
      // Save to localStorage
      if (newImage) {
        localStorage.setItem(LSO_PHOTO2_KEY, JSON.stringify(newImage))
      }
    }
  }, [allImages, currentImage2])

  const handlePhoto2Load = useCallback(() => {
    setIsPhoto2Loading(false)
  }, [])

  const handleTbqClick = useCallback(() => {
    const newSubBodyIdx = (tbqSubBodyIdx + 1) % SUBTITLE_BODY.length
    const newQuoteIdx = (tbqQuoteIdx + 1) % PULL_QUOTES.length
    
    setTbqSubBodyIdx(newSubBodyIdx)
    setTbqQuoteIdx(newQuoteIdx)
    
    // Save to localStorage
    localStorage.setItem(LSO_TBQ_KEY, JSON.stringify({
      subBodyIdx: newSubBodyIdx,
      quoteIdx: newQuoteIdx
    }))
  }, [tbqSubBodyIdx, tbqQuoteIdx])

  const handlePathContainerClick = useCallback(() => {
    generatePathContainer()
    setPathContainerKey(k => k + 1)
  }, [generatePathContainer])

  const handleTbq2Click = useCallback(() => {
    const newSubBodyIdx = (tbq2SubBodyIdx + 1) % SUBTITLE_BODY.length
    const newQuoteIdx = (tbq2QuoteIdx + 1) % PULL_QUOTES.length
    const newColorIdx = Math.floor(Math.random() * TBQ_BG_COLORS.length)
    
    setTbq2SubBodyIdx(newSubBodyIdx)
    setTbq2QuoteIdx(newQuoteIdx)
    setTbq2ColorIdx(newColorIdx)
    
    // Save to localStorage
    localStorage.setItem(LSO_TBQ2_KEY, JSON.stringify({
      subBodyIdx: newSubBodyIdx,
      quoteIdx: newQuoteIdx,
      colorIdx: newColorIdx
    }))
  }, [tbq2SubBodyIdx, tbq2QuoteIdx])

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
          isDark={true}
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

      <div className={styles.pathContainerWrapper}>
        {!mounted || !pathContainer ? (
          <PathContainer
            width={600}
            height={400}
            bgColor="transparent"
            pathCount={3}
          />
        ) : (
          <div 
            onClick={handlePathContainerClick} 
            role="button" 
            aria-label="Click to generate new paths" 
            tabIndex={0}
            onKeyDown={(e) => { 
              if (e.key === 'Enter' || e.key === ' ') { 
                e.preventDefault(); 
                handlePathContainerClick() 
              } 
            }}
          >
            <PathContainer
              key={pathContainerKey}
              width={pathContainer.width}
              height={pathContainer.height}
              bgColor={pathContainer.bgColor}
              pathCount={pathContainer.pathCount}
              seed={pathContainer.seed}
            />
          </div>
        )}
      </div>

      <div 
        className={styles.titleBodyQuote2Container}
        onClick={handleTbq2Click}
        role="button"
        aria-label="Click to cycle content and color"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleTbq2Click()
          }
        }}
      >
        <TitleBodyQuote
          subtitle={SUBTITLE_BODY[tbq2SubBodyIdx].subtitle}
          body={SUBTITLE_BODY[tbq2SubBodyIdx].body}
          quote={PULL_QUOTES[tbq2QuoteIdx]}
          fg={TBQ_BG_COLORS[tbq2ColorIdx].fg}
          bg={TBQ_BG_COLORS[tbq2ColorIdx].bg}
        />
      </div>

      <div className={styles.photo2Container}>
        {currentImage2 ? (
          <Photo 
            image={currentImage2} 
            onClick={handlePhoto2Click}
            loading={isPhoto2Loading}
            onImageLoad={handlePhoto2Load}
          />
        ) : (
          <p>Loading images...</p>
        )}
      </div>
    </div>
  )
}

