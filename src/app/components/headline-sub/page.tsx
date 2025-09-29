"use client"
import { useCallback, useMemo, useState } from 'react'
import HeadlineSub from '@/components/HeadlineSub/HeadlineSub'
import styles from './page.module.css'

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

type Align = 'left' | 'center'

const BG_COLORS = [
  'var(--brand-offwhite)',
  'var(--brand-black)',
  'var(--brand-yellow)',
  'var(--brand-blue)',
  'transparent',
]

const PAGE_BG = 'var(--brand-offwhite)'

export default function Page() {
  const [hIdx, setHIdx] = useState(0)
  const [sIdx, setSIdx] = useState(0)
  const [align, setAlign] = useState<Align>('center')
  const [fg, setFg] = useState<string>('var(--brand-black)')
  const [bg, setBg] = useState<string>(PAGE_BG)

  const headline = useMemo(() => HEADLINES[hIdx % HEADLINES.length], [hIdx])
  const sub = useMemo(() => SUBS[sIdx % SUBS.length], [sIdx])

  const randomize = useCallback(() => {
    setHIdx((p) => (p + 1) % HEADLINES.length)
    setSIdx((p) => (p + 1) % SUBS.length)
    setAlign(Math.random() < 0.5 ? 'left' : 'center')
    const nextBg = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)]
    setBg(nextBg)
    const nextFg = nextBg === 'var(--brand-black)' ? 'var(--brand-offwhite)' : 'var(--brand-black)'
    setFg(nextFg)
  }, [])

  const borderColor = bg === PAGE_BG ? 'rgba(35,31,32,0.12)' : undefined

  return (
    <div className={styles.page}>
      <div className={styles.card} onClick={randomize} role="button" aria-label="Randomize headline + sub" tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); randomize() } }}
      >
        <div className={styles.inner}>
          <HeadlineSub 
            headline={headline}
            sub={sub}
            align={align}
            fg={fg}
            bg={bg}
            borderColor={borderColor}
          />
        </div>
      </div>
    </div>
  )
}


