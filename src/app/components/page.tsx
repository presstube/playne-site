'use client'

import { useCallback, useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './page.module.css'
import Headline from '@/components/Headline/Headline'
import HeadlineSub from '@/components/HeadlineSub/HeadlineSub'
import Button from '@/components/Button/Button'
import LinkButton from '@/components/LinkButton/LinkButton'
import Card from '@/components/Card/Card'
import ActionCard from '@/components/ActionCard/ActionCard'
import ContentCard from '@/components/ContentCard/ContentCard'
import EventCard from '@/components/EventCard/EventCard'
import DonationCard from '@/components/DonationCard/DonationCard'
import Path2 from '@/components/Path2/Path2'
import { BRAND_COLORS } from '@/components/Path2/Path2'

// Headline demo data
const HEADLINE_COPY = [
  'Empower young minds through practical learning',
  'Community creativity confidence',
  'Real skills real impact',
  'Learn by doing',
  'Building confidence through action and purpose',
  'Education for the real world',
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

type CaseType = 'all-caps' | 'title-case'
type Align = 'left' | 'center'

const FG_COLORS = [
  'var(--brand-black)',
  'var(--brand-offwhite)',
]

const BG_COLORS = [
  'var(--brand-offwhite)',
  'var(--brand-black)',
  'var(--brand-yellow)',
  'var(--brand-blue)',
  'transparent',
]

const PAGE_BG = 'var(--brand-offwhite)'

// PhotoPath photos
const PHOTOS = [
  '/images/2025_07_16-Free_Arts_Day-23-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-22-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-21-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-20-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-19-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-18-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-17-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-16-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-15-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-14-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-13-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-12-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-11-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-10-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-09-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-08-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-07-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-06-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-05-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-04-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-03-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-02-by_yeasinsgallery.jpg',
  '/images/2025_07_16-Free_Arts_Day-01-by_yeasinsgallery.jpg',
  '/images/Shantell_Martin-Playne-7.jpg',
  '/images/Shantell_Martin_Playne-6.jpg',
  '/images/Shantell_Martin_Playne-5.jpg',
  '/images/Shantell_Martin_Playne-4.jpg',
  '/images/Shantell_Martin_Playne-3.jpg',
  '/images/Shantell_Martin_Playne-2.jpg',
  '/images/Shantell_Martin_Playne-1.jpg',
]

interface PathConfig {
  id: number
  color: string
  lobes: 0 | 1 | 2
  amplitude: number
  strokeWidth: number
  bias: 'left' | 'right' | 'auto'
  wildness: number
}

let nextPathId = 0

interface Division {
  id: string
  style: React.CSSProperties
  pathCount: number
  paths: Array<{ 
    color: string
    lobes: 0 | 1 | 2
    amplitude: number
    strokeWidth: number
    bias: 'left' | 'right' | 'auto'
    wildness: number
  }>
  isDark: boolean
}

export default function Page() {
  // Headline state
  const [hlIdx, setHlIdx] = useState(0)
  const [hlCaseType, setHlCaseType] = useState<CaseType>('all-caps')
  const [hlAlign, setHlAlign] = useState<Align>('center')
  const [hlFg, setHlFg] = useState<string>('var(--brand-black)')
  const [hlBg, setHlBg] = useState<string>(PAGE_BG)

  const headlineText = useMemo(() => HEADLINE_COPY[hlIdx % HEADLINE_COPY.length], [hlIdx])

  const randomizeHeadline = useCallback(() => {
    setHlIdx((p) => (p + 1) % HEADLINE_COPY.length)
    setHlCaseType(Math.random() < 0.5 ? 'all-caps' : 'title-case')
    setHlAlign(Math.random() < 0.5 ? 'left' : 'center')
    const nextBg = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)]
    setHlBg(nextBg)
    const nextFg = nextBg === 'var(--brand-black)' ? 'var(--brand-offwhite)' : 'var(--brand-black)'
    setHlFg(nextFg)
  }, [])

  // HeadlineSub state
  const [hsHIdx, setHsHIdx] = useState(0)
  const [hsSIdx, setHsSIdx] = useState(0)
  const [hsAlign, setHsAlign] = useState<Align>('center')
  const [hsFg, setHsFg] = useState<string>('var(--brand-black)')
  const [hsBg, setHsBg] = useState<string>(PAGE_BG)

  const headline = useMemo(() => HEADLINES[hsHIdx % HEADLINES.length], [hsHIdx])
  const sub = useMemo(() => SUBS[hsSIdx % SUBS.length], [hsSIdx])

  const randomizeHeadlineSub = useCallback(() => {
    setHsHIdx((p) => (p + 1) % HEADLINES.length)
    setHsSIdx((p) => (p + 1) % SUBS.length)
    setHsAlign(Math.random() < 0.5 ? 'left' : 'center')
    const nextBg = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)]
    setHsBg(nextBg)
    const nextFg = nextBg === 'var(--brand-black)' ? 'var(--brand-offwhite)' : 'var(--brand-black)'
    setHsFg(nextFg)
  }, [])

  // Path2 state
  const [path2Key, setPath2Key] = useState(0)
  const [divisions, setDivisions] = useState<Division[]>([])

  const regeneratePath2 = useCallback(() => {
    setPath2Key(p => p + 1)
  }, [])

  // PhotoPath state
  const [selectedPhoto, setSelectedPhoto] = useState<string>('')
  const [photoPaths, setPhotoPaths] = useState<PathConfig[]>([])
  const [photoImageLoaded, setPhotoImageLoaded] = useState(false)

  const generateRandomPathConfig = useCallback((): PathConfig => {
    return {
      id: nextPathId++,
      color: BRAND_COLORS[Math.floor(Math.random() * 4)], // Exclude off-white
      lobes: [0, 1, 2][Math.floor(Math.random() * 3)] as 0 | 1 | 2,
      amplitude: 0.4 + Math.random() * 0.35, // 0.4-0.75
      strokeWidth: 50 + Math.floor(Math.random() * 30), // 50-80px
      bias: (['left', 'right', 'auto'][Math.floor(Math.random() * 3)]) as 'left' | 'right' | 'auto',
      wildness: 0.9 + Math.random() * 0.6 // 0.9-1.5
    }
  }, [])

  const generatePaths = useCallback(() => {
    const count = Math.floor(1 + Math.random() * 5) // 1-5 paths
    const newPaths = Array.from({ length: count }, () => generateRandomPathConfig())
    setPhotoPaths(newPaths)
  }, [generateRandomPathConfig])

  const changePhoto = useCallback(() => {
    const randomPhoto = PHOTOS[Math.floor(Math.random() * PHOTOS.length)]
    setSelectedPhoto(randomPhoto)
    setPhotoImageLoaded(false)
    // Paths will regenerate when image loads
  }, [])

  const changePaths = useCallback(() => {
    setPhotoPaths([]) // Clear paths first
    setTimeout(() => {
      generatePaths() // Then regenerate
    }, 50)
  }, [generatePaths])

  // Initialize PhotoPath on mount
  useEffect(() => {
    const randomPhoto = PHOTOS[Math.floor(Math.random() * PHOTOS.length)]
    setSelectedPhoto(randomPhoto)
  }, [])

  // Generate paths when photo loads
  useEffect(() => {
    if (photoImageLoaded) {
      generatePaths()
    }
  }, [photoImageLoaded, generatePaths])

  useEffect(() => {
    const layout = generateRandomLayout()
    const withPaths = layout.map(div => {
      const pathCount = Math.floor(1 + Math.random() * 5)
      const isDark = Math.random() < 0.3
      
      const availableColors = isDark 
        ? ['#EAEADA', '#A9ECD4', '#FCDC4A']
        : ['#FC555B', '#FCDC4A', '#FB6DCB', '#A9ECD4']
      
      const shuffled = [...availableColors].sort(() => Math.random() - 0.5)
      const selectedColors = shuffled.slice(0, pathCount)
      
      const paths = selectedColors.map(color => ({
        color,
        lobes: [0, 1, 2][Math.floor(Math.random() * 3)] as 0 | 1 | 2,
        amplitude: 0.4 + Math.random() * 0.35,
        strokeWidth: 50 + Math.floor(Math.random() * 30),
        bias: (['left', 'right', 'auto'][Math.floor(Math.random() * 3)]) as 'left' | 'right' | 'auto',
        wildness: 0.8 + Math.random() * 0.7
      }))
      
      return { ...div, pathCount, paths, isDark }
    })
    setDivisions(withPaths)
  }, [path2Key])

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>COMPONENTS</h1>

      {/* Headline */}
      <section className={styles.componentSection}>
        <h2 className={styles.componentLabel}>Headline</h2>
        <div className={styles.headlineDemo} onClick={randomizeHeadline} role="button" aria-label="Randomize headline" tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); randomizeHeadline() } }}
        >
          <div className={styles.headlineDemoInner}>
            <Headline 
              text={headlineText} 
              caseType={hlCaseType} 
              align={hlAlign} 
              fg={hlFg} 
              bg={hlBg} 
              borderColor={hlBg === PAGE_BG ? 'rgba(35,31,32,0.12)' : undefined}
            />
          </div>
        </div>
      </section>

      {/* HeadlineSub */}
      <section className={styles.componentSection}>
        <h2 className={styles.componentLabel}>Headline Sub</h2>
        <div className={styles.headlineDemo} onClick={randomizeHeadlineSub} role="button" aria-label="Randomize headline + sub" tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); randomizeHeadlineSub() } }}
        >
          <div className={styles.headlineDemoInner}>
            <HeadlineSub 
              headline={headline}
              sub={sub}
              align={hsAlign}
              fg={hsFg}
              bg={hsBg}
              borderColor={hsBg === PAGE_BG ? 'rgba(35,31,32,0.12)' : undefined}
            />
          </div>
        </div>
      </section>

      {/* Path2 */}
      <section className={styles.componentSection}>
        <h2 className={styles.componentLabel}>Path2</h2>
        <div className={styles.path2Demo} onClick={regeneratePath2} role="button" aria-label="Regenerate paths" tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); regeneratePath2() } }}
        >
          {divisions.map((division) => (
            <div 
              key={division.id} 
              className={styles.path2Division} 
              style={{
                ...division.style,
                backgroundColor: division.isDark ? '#231f20' : 'transparent'
              }}
            >
              {division.paths.map((pathConfig, idx) => (
                <Path2 
                  key={idx} 
                  lobes={pathConfig.lobes}
                  amplitude={pathConfig.amplitude}
                  color={pathConfig.color}
                  strokeWidth={pathConfig.strokeWidth}
                  bias={pathConfig.bias}
                  wildness={pathConfig.wildness}
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* PhotoPath */}
      <section className={styles.componentSection}>
        <h2 className={styles.componentLabel}>Photo With Paths</h2>
        <div className={styles.photoPathDemo}>
          <div className={styles.photoPathButtons}>
            <Button onClick={changePhoto}>Change Photo</Button>
            <Button onClick={changePaths}>Change Paths</Button>
          </div>
          {selectedPhoto && (
            <div className={styles.photoPathImageContainer}>
              <div className={styles.photoPathImageWrapper}>
                <Image
                  src={selectedPhoto}
                  alt="PLAYNE artwork"
                  width={800}
                  height={600}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  priority
                  onLoad={() => setPhotoImageLoaded(true)}
                />
                {photoImageLoaded && photoPaths.map(pathConfig => (
                  <div 
                    key={pathConfig.id}
                    className={styles.photoPathPathWrapper}
                  >
                    <Path2
                      color={pathConfig.color}
                      lobes={pathConfig.lobes}
                      amplitude={pathConfig.amplitude}
                      strokeWidth={pathConfig.strokeWidth}
                      bias={pathConfig.bias}
                      wildness={pathConfig.wildness}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Graveyard */}
      <div className={styles.graveyard}>
        <div className={styles.graveyardDivider}></div>
        <h2 className={styles.graveyardTitle}>GRAVEYARD</h2>

        <section className={styles.graveyardSection}>
          <div className={styles.examples}>
            <div className={styles.example}>
              <Button onClick={() => console.log('clicked')}>Button Component</Button>
              <p className={styles.label}>Button</p>
            </div>
            <div className={styles.example}>
              <LinkButton href="/get-involved">LinkButton Component</LinkButton>
              <p className={styles.label}>LinkButton</p>
            </div>
          </div>
        </section>

        <section className={styles.graveyardSection}>
          <div className={styles.cardGrid}>
            <div className={styles.example}>
              <Card>
                <h3>Basic Card</h3>
                <p>Standard card container with border and padding</p>
              </Card>
              <p className={styles.label}>Card</p>
            </div>

            <div className={styles.example}>
              <ActionCard
                title="Action Card"
                description="Card with title, description, and action button"
                actionText="Learn More"
                actionHref="/about"
              />
              <p className={styles.label}>ActionCard</p>
            </div>

            <div className={styles.example}>
              <ContentCard
                title="Content Card"
                description="Rich content card with headline and body text for program details or story snippets"
              />
              <p className={styles.label}>ContentCard</p>
            </div>

            <div className={styles.example}>
              <EventCard
                title="Workshop: Financial Literacy"
                date="March 15, 2025"
                location="PLAYNE Center"
                description="Learn essential money management skills"
              />
              <p className={styles.label}>EventCard</p>
            </div>

            <div className={styles.example}>
              <DonationCard
                amount="$50"
                title="Monthly Support"
                description="Support one student for a month"
                onDonate={(amt) => console.log(`${amt} selected`)}
              />
              <p className={styles.label}>DonationCard</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function generateRandomLayout(): Array<Omit<Division, 'pathCount' | 'paths' | 'isDark'>> {
  const layouts = [
    () => [
      { id: 'a', style: { gridColumn: '1 / 2', gridRow: '1 / 3' } },
      { id: 'b', style: { gridColumn: '2 / 4', gridRow: '1 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 2', gridRow: '1 / 3' } },
      { id: 'b', style: { gridColumn: '2 / 4', gridRow: '1 / 2' } },
      { id: 'c', style: { gridColumn: '2 / 4', gridRow: '2 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 4', gridRow: '1 / 2' } },
      { id: 'b', style: { gridColumn: '1 / 3', gridRow: '2 / 3' } },
      { id: 'c', style: { gridColumn: '3 / 4', gridRow: '2 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 3', gridRow: '1 / 2' } },
      { id: 'b', style: { gridColumn: '3 / 4', gridRow: '1 / 2' } },
      { id: 'c', style: { gridColumn: '1 / 2', gridRow: '2 / 3' } },
      { id: 'd', style: { gridColumn: '2 / 4', gridRow: '2 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 2', gridRow: '1 / 3' } },
      { id: 'b', style: { gridColumn: '2 / 3', gridRow: '1 / 2' } },
      { id: 'c', style: { gridColumn: '3 / 4', gridRow: '1 / 2' } },
      { id: 'd', style: { gridColumn: '2 / 3', gridRow: '2 / 3' } },
      { id: 'e', style: { gridColumn: '3 / 4', gridRow: '2 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 3', gridRow: '1 / 2' } },
      { id: 'b', style: { gridColumn: '3 / 4', gridRow: '1 / 3' } },
      { id: 'c', style: { gridColumn: '1 / 3', gridRow: '2 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 2', gridRow: '1 / 3' } },
      { id: 'b', style: { gridColumn: '2 / 4', gridRow: '1 / 2' } },
      { id: 'c', style: { gridColumn: '2 / 3', gridRow: '2 / 3' } },
      { id: 'd', style: { gridColumn: '3 / 4', gridRow: '2 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 4', gridRow: '1 / 2' } },
      { id: 'b', style: { gridColumn: '1 / 2', gridRow: '2 / 3' } },
      { id: 'c', style: { gridColumn: '2 / 4', gridRow: '2 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 3', gridRow: '1 / 2' } },
      { id: 'b', style: { gridColumn: '3 / 4', gridRow: '1 / 3' } },
      { id: 'c', style: { gridColumn: '1 / 2', gridRow: '2 / 3' } },
      { id: 'd', style: { gridColumn: '2 / 3', gridRow: '2 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 2', gridRow: '1 / 2' } },
      { id: 'b', style: { gridColumn: '2 / 4', gridRow: '1 / 3' } },
      { id: 'c', style: { gridColumn: '1 / 2', gridRow: '2 / 3' } },
    ],
  ]

  const randomLayout = layouts[Math.floor(Math.random() * layouts.length)]
  return randomLayout()
}
