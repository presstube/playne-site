"use client"
import { useState } from 'react'
import Link from 'next/link'
import styles from './Footer.module.css'
import { PLAYNE_LOGO_PATH } from '../shared/playne-logo-path'

const FOOTER_COLORS = [
  // omitting black (bg is black)
  '#FC555B', // red
  '#FCDC4A', // yellow
  '#FB6DCB', // pink
  '#A9ECD4', // blue
  '#EAEADA', // off-white
]

export default function Footer() {
  const [currentColorIndex, setCurrentColorIndex] = useState(4) // start with off-white

  const sitemap = [
    { label: 'home', href: '/' },
    { label: 'about', href: '/about' },
    { label: 'programs', href: '/programs' },
    { label: 'shop', href: '/shop' },
    { label: 'contact', href: '/contact' },
  ]

  const handleClick = () => {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * FOOTER_COLORS.length)
    } while (newIndex === currentColorIndex && FOOTER_COLORS.length > 1)
    setCurrentColorIndex(newIndex)
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoColumn} onClick={handleClick} style={{ cursor: 'pointer' }}>
          <svg className={styles.logo} viewBox="0 0 4000 1393.81" xmlns="http://www.w3.org/2000/svg">
            <path fill={FOOTER_COLORS[currentColorIndex]} d={PLAYNE_LOGO_PATH} />
          </svg>
        </div>
        <nav className={styles.navColumn}>
          <ul className={styles.navList}>
            {sitemap.map((item) => (
              <li key={item.label} className={styles.navItem}>
                <Link href={item.href} className={styles.navLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}

