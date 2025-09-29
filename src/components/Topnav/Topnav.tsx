'use client'

import styles from './Topnav.module.css'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import BrandNav from '@/components/BrandNav/BrandNav'

export default function Topnav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement | null>(null)
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const menuId = 'topnav-mobile-menu'

  // Close menu on route change
  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Body scroll lock and focus management
  useEffect(() => {
    if (isMenuOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      // Focus first focusable item within the menu
      const focusable = menuRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      focusable?.focus()
    } else {
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Handle keydown for Escape and simple focus trap
  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isMenuOpen) return
    if (e.key === 'Escape') {
      e.preventDefault()
      setIsMenuOpen(false)
      return
    }

    if (e.key === 'Tab' && menuRef.current) {
      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !el.hasAttribute('disabled'))

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement

      if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      }
    }
  }

  return (
    <>
      <nav className={styles.topnav}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.brand}>
              <Link href="/" className={styles.brandLink}>
                <BrandNav />
              </Link>
            </div>
            <div className={styles.navigation}>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
              <Link href="/about" className={styles.navLink}>
                About
              </Link>
              <Link href="/programs" className={styles.navLink}>
                Programs
              </Link>
              <Link href="/events" className={styles.navLink}>
                Events
              </Link>
              <Link href="/get-involved" className={styles.navLink}>
                Get Involved
              </Link>
              <Link href="/support" className={styles.navLink}>
                Support PLAYNE
              </Link>
              <Link href="/contact" className={styles.navLink}>
                Contact
              </Link>
            </div>
            <button
              type="button"
              className={styles.menuButton}
              aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={isMenuOpen}
              aria-controls={menuId}
              onClick={() => setIsMenuOpen(v => !v)}
              ref={triggerButtonRef}
            >
              {isMenuOpen ? 'CLOSE' : 'MENU'}
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isMenuOpen ? styles.backdropOpen : ''}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Full-screen Menu */}
      <div
        id={menuId}
        ref={menuRef}
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        onKeyDown={handleMenuKeyDown}
      >
        <div className={styles.mobileHeader}>
          <Link href="/" className={styles.brandLink} onClick={() => setIsMenuOpen(false)}>
            <BrandNav />
          </Link>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
          >
            CLOSE
          </button>
        </div>

        <nav className={styles.mobileNav} aria-label="Mobile">
          <Link href="/" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link href="/about" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          <Link href="/programs" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
            Programs
          </Link>
          <Link href="/events" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
            Events
          </Link>
          <Link href="/get-involved" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
            Get Involved
          </Link>
          <Link href="/support" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
            Support PLAYNE
          </Link>
          <Link href="/contact" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>
        </nav>
      </div>
    </>
  )
}
