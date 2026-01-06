"use client"
import styles from './BrandHero.module.css'
import { PLAYNE_LOGO_PATH } from '../shared/playne-logo-path'
import { THEME_COLORS } from '@/contexts/LandingThemeContext'

interface BrandHeroProps {
  theme?: 'dark' | 'light'
  onClick?: () => void
}

export default function BrandHero({ theme, onClick }: BrandHeroProps = {}) {
  // Logo color matches the text color of the current theme
  // Light theme (beige bg) -> black logo
  // Dark theme (black bg) -> beige logo
  const logoColor = theme ? THEME_COLORS[theme].text : '#231f20' // default to black

  return (
    <div 
      className={styles.brandHero} 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <svg className={styles.logo} viewBox="0 0 4000 1393.81" xmlns="http://www.w3.org/2000/svg">
        <path fill={logoColor} d={PLAYNE_LOGO_PATH} />
      </svg>
    </div>
  )
}


