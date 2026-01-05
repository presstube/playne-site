"use client"
import { useState } from 'react'
import styles from './BrandHero.module.css'
import { PLAYNE_LOGO_PATH } from '../shared/playne-logo-path'
import { THEME_COLORS } from '@/contexts/LandingThemeContext'

const BRAND_COLORS = [
  '#231f20', // black
  '#FC555B', // red
  '#FCDC4A', // yellow
  '#FB6DCB', // pink
  '#A9ECD4', // blue
  '#EAEADA', // beige (PLAYNE offwhite)
]

interface BrandHeroProps {
  theme?: 'dark' | 'light'
}

export default function BrandHero({ theme }: BrandHeroProps = {}) {
  const [currentColorIndex, setCurrentColorIndex] = useState(1) // start with red (not black)

  const handleClick = () => {
    if (!theme) {
      // No theme context, just cycle avoiding current color
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * BRAND_COLORS.length)
      } while (newIndex === currentColorIndex && BRAND_COLORS.length > 1)
      setCurrentColorIndex(newIndex)
    } else {
      // Theme context provided, avoid both current color AND background color
      const bgColor = THEME_COLORS[theme].bg
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * BRAND_COLORS.length)
      } while (
        (newIndex === currentColorIndex || BRAND_COLORS[newIndex] === bgColor) && 
        BRAND_COLORS.length > 1
      )
      setCurrentColorIndex(newIndex)
    }
  }

  // Always use the cycling color (which now respects the background)
  const logoColor = BRAND_COLORS[currentColorIndex]

  return (
    <div className={styles.brandHero} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <svg className={styles.logo} viewBox="0 0 4000 1393.81" xmlns="http://www.w3.org/2000/svg">
        <path fill={logoColor} d={PLAYNE_LOGO_PATH} />
      </svg>
    </div>
  )
}


