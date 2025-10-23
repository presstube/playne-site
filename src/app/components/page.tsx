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
import PathContainer from '@/components/PathContainer/PathContainer'
import BrandShaderHero from '@/components/BrandShaderHero/BrandShaderHero'
import TitleBodyQuote from '@/components/TitleBodyQuote/TitleBodyQuote'
import Shape from '@/components/Shape/Shape'
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

  // TitleBodyQuote state
  const [tbqSubBodyIdx, setTbqSubBodyIdx] = useState(0)
  const [tbqQuoteIdx, setTbqQuoteIdx] = useState(0)
  const [tbqIsDark, setTbqIsDark] = useState(false)

  const currentSubBody = useMemo(
    () => SUBTITLE_BODY[tbqSubBodyIdx % SUBTITLE_BODY.length],
    [tbqSubBodyIdx]
  )
  const currentQuote = useMemo(
    () => PULL_QUOTES[tbqQuoteIdx % PULL_QUOTES.length],
    [tbqQuoteIdx]
  )

  const handleTbqClick = useCallback(() => {
    setTbqSubBodyIdx((p) => (p + 1) % SUBTITLE_BODY.length)
    setTbqQuoteIdx((p) => (p + 1) % PULL_QUOTES.length)
    setTbqIsDark(Math.random() < 0.5)
  }, [])

  // Shape state
  const [shapeKey, setShapeKey] = useState(0)

  const handleShapeClick = useCallback(() => {
    setShapeKey((p) => p + 1)
  }, [])

  // PathContainer state
  const [mounted, setMounted] = useState(false)
  const [pathContainer, setPathContainer] = useState<{
    width: number
    height: number
    bgColor: string
    pathCount: number
  } | null>(null)
  const [pathContainerKey, setPathContainerKey] = useState(0)

  // Brand colors for background selection
  const PATH_BRAND_COLORS = [
    '#231f20', // black
    '#FC555B', // red
    '#FCDC4A', // yellow
    '#FB6DCB', // pink
    '#A9ECD4', // blue
    '#EAEADA', // offwhite
  ]

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
    
    setPathContainer({ width, height, bgColor, pathCount })
  }, [])

  // Generate PathContainer client-side only
  useEffect(() => {
    setMounted(true)
    generatePathContainer()
  }, [generatePathContainer])

  const handlePathContainerClick = useCallback(() => {
    generatePathContainer()
    setPathContainerKey(k => k + 1)
  }, [generatePathContainer])

  return (
    <div className={styles.page}>
      <BrandShaderHero />
      
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

      {/* TitleBodyQuote */}
      <section className={styles.componentSection}>
        <h2 className={styles.componentLabel}>Title Body Quote</h2>
        <div className={styles.headlineDemo} onClick={handleTbqClick} role="button" aria-label="Click to cycle content and randomize theme" tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleTbqClick() } }}
        >
          <div className={styles.headlineDemoInner}>
            <TitleBodyQuote
              subtitle={currentSubBody.subtitle}
              body={currentSubBody.body}
              quote={currentQuote}
              isDark={tbqIsDark}
            />
          </div>
        </div>
      </section>

      {/* Shape */}
      <section className={styles.componentSection}>
        <h2 className={styles.componentLabel}>Shapes</h2>
        <div className={styles.headlineDemo} onClick={handleShapeClick} role="button" aria-label="Click to generate new shape" tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleShapeClick() } }}
        >
          <div className={styles.headlineDemoInner}>
            <Shape key={shapeKey} />
          </div>
        </div>
      </section>

      {/* Paths */}
      <section className={styles.componentSection}>
        <h2 className={styles.componentLabel}>Paths</h2>
        {!mounted || !pathContainer ? (
          <div className={`${styles.headlineDemo} ${styles['headlineDemo--fullWidth']}`}>
            <div className={`${styles.headlineDemoInner} ${styles['headlineDemoInner--fullWidth']}`}>
              <PathContainer
                width={600}
                height={400}
                bgColor="transparent"
                pathCount={3}
              />
            </div>
          </div>
        ) : (
          <div className={`${styles.headlineDemo} ${styles['headlineDemo--fullWidth']}`} onClick={handlePathContainerClick} role="button" aria-label="Click to generate new paths" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePathContainerClick() } }}
          >
            <div className={`${styles.headlineDemoInner} ${styles['headlineDemoInner--fullWidth']}`}>
              <PathContainer
                key={pathContainerKey}
                width={pathContainer.width}
                height={pathContainer.height}
                bgColor={pathContainer.bgColor}
                pathCount={pathContainer.pathCount}
              />
            </div>
          </div>
        )}
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
