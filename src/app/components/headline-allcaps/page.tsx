"use client"
import { useCallback, useMemo, useState } from 'react'
import HeadlineAllCaps from '@/components/HeadlineAllCaps/HeadlineAllCaps'
import styles from './page.module.css'

const ALL_CAPS: string[] = [
  'EMPOWER YOUNG MINDS',
  'PRACTICAL LEARNING FOR LIFE',
  'BUILD CONFIDENCE THROUGH ACTION',
  'COMMUNITY CREATIVITY CONFIDENCE',
  'LEARN BY DOING',
  'REAL SKILLS REAL IMPACT',
]

type Align = 'left' | 'center'
type Theme = 'light' | 'dark'

export default function Page() {
  const [textIdx, setTextIdx] = useState(0)
  const [align, setAlign] = useState<Align>('center')
  const [theme, setTheme] = useState<Theme>('light')

  const text = useMemo(() => ALL_CAPS[textIdx % ALL_CAPS.length], [textIdx])

  const randomize = useCallback(() => {
    setTextIdx((prev) => (prev + 1) % ALL_CAPS.length)
    setAlign(Math.random() < 0.5 ? 'left' : 'center')
    setTheme(Math.random() < 0.5 ? 'light' : 'dark')
  }, [])

  const containerClass = useMemo(() => {
    return [styles.card, theme === 'dark' ? styles.dark : styles.light].join(' ')
  }, [theme])

  return (
    <div className={styles.page}>
      <div className={containerClass} onClick={randomize} role="button" aria-label="Randomize headline" tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); randomize() } }}
      >
        <div className={styles.inner}>
          <HeadlineAllCaps text={text} size="lg" align={align} theme={theme} />
        </div>
      </div>
    </div>
  )
}


