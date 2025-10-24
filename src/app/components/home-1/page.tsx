'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './page.module.css'
import BrandShaderHeroWithControls from '@/components/BrandShaderHeroWithControls/BrandShaderHeroWithControls'
import Headline from '@/components/Headline/Headline'
import TitleBodyQuote from '@/components/TitleBodyQuote/TitleBodyQuote'
import HeadlineSub from '@/components/HeadlineSub/HeadlineSub'
import Photo from '@/components/Photo/Photo'
import PathContainer from '@/components/PathContainer/PathContainer'
import Shape from '@/components/Shape/Shape'
import { GalleryImage, pickRandomImage } from '@/lib/image-hat'
import { client } from '@/sanity/lib/client'
import { allGalleryImagesQuery } from '@/sanity/lib/galleries-queries'

// Headline demo data
const HEADLINE_COPY = [
  'Empower young minds through practical learning',
  'Community creativity confidence',
  'Real skills real impact',
  'Learn by doing',
  'Building confidence through action and purpose',
  'Education for the real world',
]

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

const LSO_HEADLINE_KEY = 'home1-headline'
const LSO_PHOTO0_KEY = 'home1-photo0'
const LSO_PHOTO_KEY = 'home1-photo'
const LSO_TBQ_KEY = 'home1-tbq'
const LSO_PATH_KEY = 'home1-path'
const LSO_TBQ2_KEY = 'home1-tbq2'
const LSO_PHOTO2_KEY = 'home1-photo2'
const LSO_SHAPE_KEY = 'home1-shape'
const LSO_HS_KEY = 'home1-hs'
const LSO_PHOTO3_KEY = 'home1-photo3'
const LSO_TBQ3_KEY = 'home1-tbq3'

// Brand colors for PathContainer background
const PATH_BRAND_COLORS = [
  '#231f20', // black
  '#FC555B', // red
  '#FCDC4A', // yellow
  '#FB6DCB', // pink
  '#A9ECD4', // blue
  '#EAEADA', // offwhite
]

// HeadlineSub demo data
const HEADLINES = [
  'Empower young minds',
  'Learn by doing',
  'Real skills real impact',
  'Community creativity confidence',
  'Education for the real world',
]

const SUBS = [
  'Practical learning for life',
  'Hands-on lessons that build confidence',
  'Creativity at the center of education',
  'Wellness, finance, nutrition, and body awareness',
  'Programs designed to spark curiosity',
]

const BG_COLORS = [
  'var(--brand-offwhite)',
  'var(--brand-black)',
  'var(--brand-yellow)',
  'var(--brand-blue)',
  'var(--brand-red)',
  'transparent',
]

type Align = 'left' | 'center'

// Default layout configuration
const HOME1_DEFAULTS = {
  "headline": {
    "copyIdx": 0,
    "fg": "var(--brand-black)",
    "bg": "var(--brand-yellow)"
  },
  "photo0": {
    "gallerySlug": "shantell-martin-playne",
    "assetId": "image-e533c7b585468baf66445ba2fdd95e7b8f323945-4128x2322-jpg"
  },
  "photo": {
    "gallerySlug": "free-arts-day-2025",
    "assetId": "image-e1677c69aa63bd619bb89abcce1aab39800563f5-2048x1365-jpg"
  },
  "tbq": {
    "subBodyIdx": 0,
    "quoteIdx": 1
  },
  "path": {
    "width": 680,
    "height": 392,
    "bgColor": "#A9ECD4",
    "pathCount": 3,
    "seed": 0.4295308248051748
  },
  "tbq2": {
    "subBodyIdx": 3,
    "quoteIdx": 3,
    "colorIdx": 3
  },
  "photo2": {
    "gallerySlug": "shantell-martin-playne",
    "assetId": "image-e533c7b585468baf66445ba2fdd95e7b8f323945-4128x2322-jpg"
  },
  "shape": {
    "seed": 0.17480261842131872
  },
  "headlineSub": {
    "hIdx": 4,
    "sIdx": 4,
    "align": "center",
    "bg": "var(--brand-yellow)",
    "fg": "var(--brand-black)"
  },
  "photo3": {
    "gallerySlug": "free-arts-day-2025",
    "assetId": "image-b81fa715fde217b8a15438f69c5cde5f6a6554b1-2048x1365-jpg"
  },
  "tbq3": {
    "subBodyIdx": 4,
    "quoteIdx": 0,
    "colorIdx": 1
  }
}

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
  // Headline state (top element)
  const [headlineCopyIdx, setHeadlineCopyIdx] = useState(0)
  const [headlineFg, setHeadlineFg] = useState('var(--brand-black)')
  const [headlineBg, setHeadlineBg] = useState('var(--brand-yellow)')
  
  // Photo0 state (second element)
  const [currentImage0, setCurrentImage0] = useState<GalleryImage | null>(null)
  const [isPhoto0Loading, setIsPhoto0Loading] = useState(false)
  
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

  // HeadlineSub state
  const [hsHIdx, setHsHIdx] = useState(0)
  const [hsSIdx, setHsSIdx] = useState(0)
  const [hsAlign, setHsAlign] = useState<Align>('center')
  const [hsFg, setHsFg] = useState<string>('var(--brand-black)')
  const [hsBg, setHsBg] = useState<string>('var(--brand-offwhite)')

  // PathContainer state
  const [mounted, setMounted] = useState(false)
  const [pathContainer, setPathContainer] = useState<PathContainerConfig | null>(null)
  const [pathContainerKey, setPathContainerKey] = useState(0)

  // Shape state
  const [shapeSeed, setShapeSeed] = useState<number | null>(null)
  const [shapeKey, setShapeKey] = useState(0)

  // Third photo state
  const [currentImage3, setCurrentImage3] = useState<GalleryImage | null>(null)
  const [isPhoto3Loading, setIsPhoto3Loading] = useState(false)

  // Third TitleBodyQuote state
  const [tbq3SubBodyIdx, setTbq3SubBodyIdx] = useState(2) // Start with "How It Works" (index 2)
  const [tbq3QuoteIdx, setTbq3QuoteIdx] = useState(3) // Start with 4th quote
  const [tbq3ColorIdx, setTbq3ColorIdx] = useState(2) // Start with yellow bg

  // Load saved states from localStorage on mount
  useEffect(() => {
    // Load saved Headline
    const savedHeadline = localStorage.getItem(LSO_HEADLINE_KEY)
    if (savedHeadline) {
      try {
        const parsed = JSON.parse(savedHeadline)
        setHeadlineCopyIdx(parsed.copyIdx ?? HOME1_DEFAULTS.headline.copyIdx)
        setHeadlineFg(parsed.fg ?? HOME1_DEFAULTS.headline.fg)
        setHeadlineBg(parsed.bg ?? HOME1_DEFAULTS.headline.bg)
      } catch (e) {
        console.error('Error parsing saved headline state:', e)
      }
    } else {
      // Use defaults
      setHeadlineCopyIdx(HOME1_DEFAULTS.headline.copyIdx)
      setHeadlineFg(HOME1_DEFAULTS.headline.fg)
      setHeadlineBg(HOME1_DEFAULTS.headline.bg)
    }

    const savedTbq = localStorage.getItem(LSO_TBQ_KEY)
    if (savedTbq) {
      try {
        const parsed = JSON.parse(savedTbq)
        setTbqSubBodyIdx(parsed.subBodyIdx ?? HOME1_DEFAULTS.tbq.subBodyIdx)
        setTbqQuoteIdx(parsed.quoteIdx ?? HOME1_DEFAULTS.tbq.quoteIdx)
      } catch (e) {
        console.error('Error parsing saved TBQ state:', e)
      }
    } else {
      // Use defaults
      setTbqSubBodyIdx(HOME1_DEFAULTS.tbq.subBodyIdx)
      setTbqQuoteIdx(HOME1_DEFAULTS.tbq.quoteIdx)
    }

    const savedTbq2 = localStorage.getItem(LSO_TBQ2_KEY)
    if (savedTbq2) {
      try {
        const parsed = JSON.parse(savedTbq2)
        setTbq2SubBodyIdx(parsed.subBodyIdx ?? HOME1_DEFAULTS.tbq2.subBodyIdx)
        setTbq2QuoteIdx(parsed.quoteIdx ?? HOME1_DEFAULTS.tbq2.quoteIdx)
        setTbq2ColorIdx(parsed.colorIdx ?? HOME1_DEFAULTS.tbq2.colorIdx)
      } catch (e) {
        console.error('Error parsing saved TBQ2 state:', e)
      }
    } else {
      // Use defaults
      setTbq2SubBodyIdx(HOME1_DEFAULTS.tbq2.subBodyIdx)
      setTbq2QuoteIdx(HOME1_DEFAULTS.tbq2.quoteIdx)
      setTbq2ColorIdx(HOME1_DEFAULTS.tbq2.colorIdx)
    }

    const savedHs = localStorage.getItem(LSO_HS_KEY)
    if (savedHs) {
      try {
        const parsed = JSON.parse(savedHs)
        setHsHIdx(parsed.hIdx ?? HOME1_DEFAULTS.headlineSub.hIdx)
        setHsSIdx(parsed.sIdx ?? HOME1_DEFAULTS.headlineSub.sIdx)
        setHsAlign(parsed.align ?? HOME1_DEFAULTS.headlineSub.align as Align)
        setHsFg(parsed.fg ?? HOME1_DEFAULTS.headlineSub.fg)
        setHsBg(parsed.bg ?? HOME1_DEFAULTS.headlineSub.bg)
      } catch (e) {
        console.error('Error parsing saved HeadlineSub state:', e)
      }
    } else {
      // Use defaults
      setHsHIdx(HOME1_DEFAULTS.headlineSub.hIdx)
      setHsSIdx(HOME1_DEFAULTS.headlineSub.sIdx)
      setHsAlign(HOME1_DEFAULTS.headlineSub.align as Align)
      setHsFg(HOME1_DEFAULTS.headlineSub.fg)
      setHsBg(HOME1_DEFAULTS.headlineSub.bg)
    }

    // Load saved photo 3
    const savedPhoto3 = localStorage.getItem(LSO_PHOTO3_KEY)
    if (savedPhoto3) {
      try {
        const parsed = JSON.parse(savedPhoto3)
        setCurrentImage3(parsed)
      } catch (e) {
        console.error('Error parsing saved photo 3:', e)
      }
    }

    const savedTbq3 = localStorage.getItem(LSO_TBQ3_KEY)
    if (savedTbq3) {
      try {
        const parsed = JSON.parse(savedTbq3)
        setTbq3SubBodyIdx(parsed.subBodyIdx ?? HOME1_DEFAULTS.tbq3.subBodyIdx)
        setTbq3QuoteIdx(parsed.quoteIdx ?? HOME1_DEFAULTS.tbq3.quoteIdx)
        setTbq3ColorIdx(parsed.colorIdx ?? HOME1_DEFAULTS.tbq3.colorIdx)
      } catch (e) {
        console.error('Error parsing saved TBQ3 state:', e)
      }
    } else {
      // Use defaults
      setTbq3SubBodyIdx(HOME1_DEFAULTS.tbq3.subBodyIdx)
      setTbq3QuoteIdx(HOME1_DEFAULTS.tbq3.quoteIdx)
      setTbq3ColorIdx(HOME1_DEFAULTS.tbq3.colorIdx)
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
      // Use defaults
      console.log('Using default PathContainer config')
      setPathContainer(HOME1_DEFAULTS.path)
    }
    
    // Load saved Shape seed
    const savedShape = localStorage.getItem(LSO_SHAPE_KEY)
    if (savedShape) {
      try {
        const parsed = JSON.parse(savedShape)
        console.log('Loading saved Shape seed:', parsed)
        setShapeSeed(parsed.seed ?? HOME1_DEFAULTS.shape.seed)
      } catch (e) {
        console.error('Error parsing saved shape seed:', e)
      }
    } else {
      // Use defaults
      setShapeSeed(HOME1_DEFAULTS.shape.seed)
    }
    
    setMounted(true)
  }, [])

  // Fetch gallery images for Photo
  useEffect(() => {
    async function fetchImages() {
      try {
        const images = await client.fetch(allGalleryImagesQuery)
        setAllImages(images)
        
        // Check if we have a saved photo0 (new top photo)
        const savedPhoto0 = localStorage.getItem(LSO_PHOTO0_KEY)
        if (savedPhoto0) {
          try {
            const parsed = JSON.parse(savedPhoto0)
            console.log('Loaded saved photo 0:', parsed)
            setCurrentImage0(parsed)
          } catch (e) {
            console.error('Error parsing saved photo 0:', e)
            // Fallback to defaults
            if (images.length > 0) {
              const defaultImage = images.find(
                img => img.gallerySlug === HOME1_DEFAULTS.photo0.gallerySlug && 
                       img.assetId === HOME1_DEFAULTS.photo0.assetId
              ) || pickRandomImage(images)
              console.log('Using default/fallback photo 0:', defaultImage)
              setCurrentImage0(defaultImage)
            }
          }
        } else {
          // Use defaults
          const defaultImage = images.find(
            img => img.gallerySlug === HOME1_DEFAULTS.photo0.gallerySlug && 
                   img.assetId === HOME1_DEFAULTS.photo0.assetId
          )
          if (defaultImage) {
            console.log('Using default photo 0:', defaultImage)
            setCurrentImage0(defaultImage)
          } else if (images.length > 0) {
            console.log('Default photo 0 not found, using random')
            const fallbackImage = pickRandomImage(images)
            setCurrentImage0(fallbackImage)
          }
        }
        
        // Check if we have a saved photo
        const savedPhoto = localStorage.getItem(LSO_PHOTO_KEY)
        if (savedPhoto) {
          try {
            const parsed = JSON.parse(savedPhoto)
            console.log('Loaded saved photo:', parsed)
            setCurrentImage(parsed)
          } catch (e) {
            console.error('Error parsing saved photo:', e)
            // Fallback to defaults
            if (images.length > 0) {
              const defaultImage = images.find(
                img => img.gallerySlug === HOME1_DEFAULTS.photo.gallerySlug && 
                       img.assetId === HOME1_DEFAULTS.photo.assetId
              ) || pickRandomImage(images)
              console.log('Using default/fallback photo:', defaultImage)
              setCurrentImage(defaultImage)
            }
          }
        } else {
          // Use defaults
          const defaultImage = images.find(
            img => img.gallerySlug === HOME1_DEFAULTS.photo.gallerySlug && 
                   img.assetId === HOME1_DEFAULTS.photo.assetId
          )
          if (defaultImage) {
            console.log('Using default photo:', defaultImage)
            setCurrentImage(defaultImage)
          } else if (images.length > 0) {
            console.log('Default photo not found, using random')
            const fallbackImage = pickRandomImage(images)
            setCurrentImage(fallbackImage)
          }
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
            // Fallback to defaults
            if (images.length > 0) {
              const defaultImage = images.find(
                img => img.gallerySlug === HOME1_DEFAULTS.photo2.gallerySlug && 
                       img.assetId === HOME1_DEFAULTS.photo2.assetId
              ) || pickRandomImage(images)
              console.log('Using default/fallback photo 2:', defaultImage)
              setCurrentImage2(defaultImage)
            }
          }
        } else {
          // Use defaults
          const defaultImage = images.find(
            img => img.gallerySlug === HOME1_DEFAULTS.photo2.gallerySlug && 
                   img.assetId === HOME1_DEFAULTS.photo2.assetId
          )
          if (defaultImage) {
            console.log('Using default photo 2:', defaultImage)
            setCurrentImage2(defaultImage)
          } else if (images.length > 0) {
            console.log('Default photo 2 not found, using random')
            const fallbackImage = pickRandomImage(images)
            setCurrentImage2(fallbackImage)
          }
        }

        // Check if we have a saved third photo
        const savedPhoto3 = localStorage.getItem(LSO_PHOTO3_KEY)
        if (savedPhoto3) {
          try {
            const parsed = JSON.parse(savedPhoto3)
            console.log('Loaded saved photo 3:', parsed)
            setCurrentImage3(parsed)
          } catch (e) {
            console.error('Error parsing saved photo 3:', e)
            // Fallback to defaults
            if (images.length > 0) {
              const defaultImage = images.find(
                img => img.gallerySlug === HOME1_DEFAULTS.photo3.gallerySlug && 
                       img.assetId === HOME1_DEFAULTS.photo3.assetId
              ) || pickRandomImage(images)
              console.log('Using default/fallback photo 3:', defaultImage)
              setCurrentImage3(defaultImage)
            }
          }
        } else {
          // Use defaults
          const defaultImage = images.find(
            img => img.gallerySlug === HOME1_DEFAULTS.photo3.gallerySlug && 
                   img.assetId === HOME1_DEFAULTS.photo3.assetId
          )
          if (defaultImage) {
            console.log('Using default photo 3:', defaultImage)
            setCurrentImage3(defaultImage)
          } else if (images.length > 0) {
            console.log('Default photo 3 not found, using random')
            const fallbackImage = pickRandomImage(images)
            setCurrentImage3(fallbackImage)
          }
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

  const handleHeadlineClick = useCallback(() => {
    const newIdx = (headlineCopyIdx + 1) % HEADLINE_COPY.length
    // Randomize colors
    const nextBg = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)]
    const nextFg = nextBg === 'var(--brand-black)' ? 'var(--brand-offwhite)' : 'var(--brand-black)'
    
    setHeadlineCopyIdx(newIdx)
    setHeadlineBg(nextBg)
    setHeadlineFg(nextFg)
    
    // Save to localStorage
    localStorage.setItem(LSO_HEADLINE_KEY, JSON.stringify({ 
      copyIdx: newIdx,
      fg: nextFg,
      bg: nextBg
    }))
  }, [headlineCopyIdx])

  const handlePhoto0Click = useCallback(() => {
    if (allImages.length > 0) {
      setIsPhoto0Loading(true)
      // Pick a different image (not the current one)
      let newImage = pickRandomImage(allImages)
      let attempts = 0
      while (newImage?.assetId === currentImage0?.assetId && attempts < 10) {
        newImage = pickRandomImage(allImages)
        attempts++
      }
      console.log('New photo 0 loaded:', newImage)
      setCurrentImage0(newImage)
      // Save to localStorage
      if (newImage) {
        localStorage.setItem(LSO_PHOTO0_KEY, JSON.stringify(newImage))
      }
    }
  }, [allImages, currentImage0])

  const handlePhoto0Load = useCallback(() => {
    setIsPhoto0Loading(false)
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

  const handleShapeClick = useCallback(() => {
    const newSeed = Math.random()
    setShapeSeed(newSeed)
    setShapeKey(k => k + 1)
    // Save to localStorage
    localStorage.setItem(LSO_SHAPE_KEY, JSON.stringify({ seed: newSeed }))
  }, [])

  const handleHsClick = useCallback(() => {
    const newHIdx = (hsHIdx + 1) % HEADLINES.length
    const newSIdx = (hsSIdx + 1) % SUBS.length
    const newAlign: Align = Math.random() < 0.5 ? 'left' : 'center'
    const newBg = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)]
    const newFg = newBg === 'var(--brand-black)' ? 'var(--brand-offwhite)' : 'var(--brand-black)'
    
    setHsHIdx(newHIdx)
    setHsSIdx(newSIdx)
    setHsAlign(newAlign)
    setHsBg(newBg)
    setHsFg(newFg)
    
    // Save to localStorage
    localStorage.setItem(LSO_HS_KEY, JSON.stringify({
      hIdx: newHIdx,
      sIdx: newSIdx,
      align: newAlign,
      bg: newBg,
      fg: newFg
    }))
  }, [hsHIdx, hsSIdx])

  const handlePhoto3Click = useCallback(() => {
    if (allImages.length === 0) return
    setIsPhoto3Loading(true)
    const newImage = pickRandomImage(allImages)
    setCurrentImage3(newImage)
  }, [allImages])

  const handlePhoto3Load = useCallback(() => {
    setIsPhoto3Loading(false)
    if (currentImage3) {
      console.log('Photo 3 loaded:', currentImage3)
      localStorage.setItem(LSO_PHOTO3_KEY, JSON.stringify(currentImage3))
    }
  }, [currentImage3])

  const handleTbq3Click = useCallback(() => {
    const newSubBodyIdx = (tbq3SubBodyIdx + 1) % SUBTITLE_BODY.length
    const newQuoteIdx = (tbq3QuoteIdx + 1) % PULL_QUOTES.length
    const newColorIdx = Math.floor(Math.random() * TBQ_BG_COLORS.length)
    
    setTbq3SubBodyIdx(newSubBodyIdx)
    setTbq3QuoteIdx(newQuoteIdx)
    setTbq3ColorIdx(newColorIdx)
    
    // Save to localStorage
    localStorage.setItem(LSO_TBQ3_KEY, JSON.stringify({
      subBodyIdx: newSubBodyIdx,
      quoteIdx: newQuoteIdx,
      colorIdx: newColorIdx
    }))
  }, [tbq3SubBodyIdx, tbq3QuoteIdx])

  // Keyboard listener for logging LSO state
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'l' || e.key === 'L') {
        // Gather all localStorage data
        const rawData = {
          headline: localStorage.getItem(LSO_HEADLINE_KEY) ? JSON.parse(localStorage.getItem(LSO_HEADLINE_KEY)!) : null,
          photo0: localStorage.getItem(LSO_PHOTO0_KEY) ? JSON.parse(localStorage.getItem(LSO_PHOTO0_KEY)!) : null,
          photo: localStorage.getItem(LSO_PHOTO_KEY) ? JSON.parse(localStorage.getItem(LSO_PHOTO_KEY)!) : null,
          tbq: localStorage.getItem(LSO_TBQ_KEY) ? JSON.parse(localStorage.getItem(LSO_TBQ_KEY)!) : null,
          path: localStorage.getItem(LSO_PATH_KEY) ? JSON.parse(localStorage.getItem(LSO_PATH_KEY)!) : null,
          tbq2: localStorage.getItem(LSO_TBQ2_KEY) ? JSON.parse(localStorage.getItem(LSO_TBQ2_KEY)!) : null,
          photo2: localStorage.getItem(LSO_PHOTO2_KEY) ? JSON.parse(localStorage.getItem(LSO_PHOTO2_KEY)!) : null,
          shape: localStorage.getItem(LSO_SHAPE_KEY) ? JSON.parse(localStorage.getItem(LSO_SHAPE_KEY)!) : null,
          headlineSub: localStorage.getItem(LSO_HS_KEY) ? JSON.parse(localStorage.getItem(LSO_HS_KEY)!) : null,
          photo3: localStorage.getItem(LSO_PHOTO3_KEY) ? JSON.parse(localStorage.getItem(LSO_PHOTO3_KEY)!) : null,
          tbq3: localStorage.getItem(LSO_TBQ3_KEY) ? JSON.parse(localStorage.getItem(LSO_TBQ3_KEY)!) : null,
        }

        // Create minimal version with only essential data
        const minimalData = {
          headline: rawData.headline,
          photo0: rawData.photo0 ? {
            gallerySlug: rawData.photo0.gallerySlug,
            assetId: rawData.photo0.assetId,
          } : null,
          photo: rawData.photo ? {
            gallerySlug: rawData.photo.gallerySlug,
            assetId: rawData.photo.assetId,
          } : null,
          tbq: rawData.tbq,
          path: rawData.path,
          tbq2: rawData.tbq2,
          photo2: rawData.photo2 ? {
            gallerySlug: rawData.photo2.gallerySlug,
            assetId: rawData.photo2.assetId,
          } : null,
          shape: rawData.shape,
          headlineSub: rawData.headlineSub,
          photo3: rawData.photo3 ? {
            gallerySlug: rawData.photo3.gallerySlug,
            assetId: rawData.photo3.assetId,
          } : null,
          tbq3: rawData.tbq3,
        }

        console.log('=== HOME-1 LOCAL STORAGE STATE (MINIMAL) ===')
        console.log(JSON.stringify(minimalData, null, 2))
        console.log('\n=== COPY/PASTE FORMAT ===')
        console.log('const HOME1_DEFAULTS = ' + JSON.stringify(minimalData, null, 2))
        console.log('\n=== FULL DATA (if needed) ===')
        console.log(JSON.stringify(rawData, null, 2))
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div className={styles.page}>
      <BrandShaderHeroWithControls />
      
      {/* New Headline at top */}
      <div 
        className={styles.headlineContainer}
        onClick={handleHeadlineClick}
        role="button"
        aria-label="Click to cycle headline"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleHeadlineClick()
          }
        }}
      >
        <Headline 
          text={HEADLINE_COPY[headlineCopyIdx]} 
          caseType="all-caps"
          fg={headlineFg}
          bg={headlineBg}
        />
      </div>

      {/* New Photo0 below Headline */}
      <div className={styles.photo0Container}>
        {currentImage0 ? (
          <Photo 
            image={currentImage0} 
            onClick={handlePhoto0Click}
            loading={isPhoto0Loading}
            onImageLoad={handlePhoto0Load}
          />
        ) : (
          <p>Loading images...</p>
        )}
      </div>
      
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

      <div 
        className={styles.shapeContainer}
        onClick={handleShapeClick}
        role="button"
        aria-label="Click to generate new shape"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleShapeClick()
          }
        }}
      >
        {shapeSeed !== null && (
          <Shape 
            key={shapeKey}
            seed={shapeSeed}
            width={600}
            height={400}
          />
        )}
      </div>

      <div 
        className={styles.headlineSubContainer}
        onClick={handleHsClick}
        role="button"
        aria-label="Click to cycle headline and sub"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleHsClick()
          }
        }}
      >
        <HeadlineSub
          headline={HEADLINES[hsHIdx]}
          sub={SUBS[hsSIdx]}
          align={hsAlign}
          fg={hsFg}
          bg={hsBg}
          borderColor={hsBg === 'var(--brand-offwhite)' ? 'rgba(35,31,32,0.12)' : undefined}
        />
      </div>

      <div className={styles.photo3Container}>
        {currentImage3 ? (
          <Photo 
            image={currentImage3} 
            onClick={handlePhoto3Click}
            loading={isPhoto3Loading}
            onImageLoad={handlePhoto3Load}
          />
        ) : (
          <p>Loading images...</p>
        )}
      </div>

      <div 
        className={styles.titleBodyQuote3Container}
        onClick={handleTbq3Click}
        role="button"
        aria-label="Click to cycle content and color"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleTbq3Click()
          }
        }}
      >
        <TitleBodyQuote
          subtitle={SUBTITLE_BODY[tbq3SubBodyIdx].subtitle}
          body={SUBTITLE_BODY[tbq3SubBodyIdx].body}
          quote={PULL_QUOTES[tbq3QuoteIdx]}
          fg={TBQ_BG_COLORS[tbq3ColorIdx].fg}
          bg={TBQ_BG_COLORS[tbq3ColorIdx].bg}
        />
      </div>
    </div>
  )
}

