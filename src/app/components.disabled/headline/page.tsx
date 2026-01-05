"use client"
import { useCallback, useMemo, useState } from 'react'
import Headline from '@/components/Headline/Headline'
import styles from './page.module.css'

const COPY_HAT = [
  'Empower young minds through practical learning',
  'Community creativity confidence',
  'Real skills real impact',
  'Learn by doing',
  'Building confidence through action and purpose',
  'Education for the real world',
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

export default function Page() {
  const [idx, setIdx] = useState(0)
  const [caseType, setCaseType] = useState<CaseType>('all-caps')
  const [align, setAlign] = useState<Align>('center')
  const [fg, setFg] = useState<string>('var(--brand-black)')
  const [bg, setBg] = useState<string>(PAGE_BG)

  const text = useMemo(() => COPY_HAT[idx % COPY_HAT.length], [idx])

  const randomize = useCallback(() => {
    setIdx((p) => (p + 1) % COPY_HAT.length)
    setCaseType(Math.random() < 0.5 ? 'all-caps' : 'title-case')
    setAlign(Math.random() < 0.5 ? 'left' : 'center')
    const nextBg = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)]
    setBg(nextBg)
    const nextFg = nextBg === 'var(--brand-black)' ? 'var(--brand-offwhite)' : 'var(--brand-black)'
    setFg(nextFg)
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.card} onClick={randomize} role="button" aria-label="Randomize headline" tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); randomize() } }}
      >
        <div className={styles.inner}>
          <Headline 
            text={text} 
            caseType={caseType} 
            align={align} 
            fg={fg} 
            bg={bg} 
            borderColor={bg === PAGE_BG ? 'rgba(35,31,32,0.12)' : undefined}
          />
        </div>
      </div>
    </div>
  )
}


