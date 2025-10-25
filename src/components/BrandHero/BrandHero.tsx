"use client"
import { useState } from 'react'
import styles from './BrandHero.module.css'
import { PLAYNE_LOGO_PATH } from '../shared/playne-logo-path'

const BRAND_COLORS = [
  '#231f20', // black
  '#FC555B', // red
  '#FCDC4A', // yellow
  '#FB6DCB', // pink
  '#A9ECD4', // blue
  // omitting off-white
]

export default function BrandHero() {
  const [currentColorIndex, setCurrentColorIndex] = useState(0) // start with black

  const handleClick = () => {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * BRAND_COLORS.length)
    } while (newIndex === currentColorIndex && BRAND_COLORS.length > 1)
    setCurrentColorIndex(newIndex)
  }

  return (
    <div className={styles.brandHero} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <svg className={styles.logo} viewBox="0 0 4000 1393.81" xmlns="http://www.w3.org/2000/svg">
        <path fill={BRAND_COLORS[currentColorIndex]} d={PLAYNE_LOGO_PATH} />
      </svg>
    </div>
  )
}


