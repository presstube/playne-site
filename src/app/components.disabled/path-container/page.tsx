"use client"
import { useState, useCallback, useEffect } from 'react'
import styles from './page.module.css'
import PathContainer from '@/components/PathContainer/PathContainer'

// Brand colors
const BRAND_COLORS = [
  '#231f20', // black
  '#FC555B', // red
  '#FCDC4A', // yellow
  '#FB6DCB', // pink
  '#A9ECD4', // blue
  '#EAEADA', // offwhite
]

interface ContainerConfig {
  width: number
  height: number
  bgColor: string
  pathCount: number
}

function generateRandomContainer(): ContainerConfig {
  // Radical variety in dimensions
  const minWidth = 300
  const maxWidth = 1000
  const minHeight = 200
  const maxHeight = 700

  const width = Math.floor(minWidth + Math.random() * (maxWidth - minWidth))
  const height = Math.floor(minHeight + Math.random() * (maxHeight - minHeight))
  
  const pathCount = Math.floor(1 + Math.random() * 5) // 1-5 paths
  
  // Random background color from all brand colors
  const bgColor = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)]
  
  return { width, height, bgColor, pathCount }
}

export default function Page() {
  const [mounted, setMounted] = useState(false)
  const [container, setContainer] = useState<ContainerConfig | null>(null)
  const [key, setKey] = useState(0)

  // Only generate container on client side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    setContainer(generateRandomContainer())
  }, [])

  const handleClick = useCallback(() => {
    if (!mounted) return
    setContainer(generateRandomContainer())
    setKey(k => k + 1)
  }, [mounted])

  if (!mounted || !container) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <PathContainer
            width={600}
            height={400}
            bgColor="transparent"
            pathCount={3}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div
        className={styles.card}
        onClick={handleClick}
        role="button"
        aria-label="Click to generate new container and paths"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        <PathContainer
          key={key}
          width={container.width}
          height={container.height}
          bgColor={container.bgColor}
          pathCount={container.pathCount}
        />
      </div>
    </div>
  )
}

