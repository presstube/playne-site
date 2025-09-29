'use client'

import styles from './RootLayout.module.css'
import Topnav from '@/components/Topnav/Topnav'
import PageNavigation from '@/components/PageNavigation/PageNavigation'
import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  const isFrameless = mounted && pathname?.startsWith('/components')
  
  return (
    <div className={styles.rootLayout}>
      <div className={isFrameless ? styles.hidden : ''}>
        <PageNavigation currentPath={pathname} />
        <Topnav />
      </div>
      <main className={`${styles.main} ${isFrameless ? styles.mainFrameless : ''}`}>
        <div className={`${styles.container} ${isFrameless ? styles.containerFrameless : ''}`}>
          {children}
        </div>
      </main>
      <footer className={`${styles.footer} ${isFrameless ? styles.hidden : ''}`}>
        <div className={styles.footerContainer}>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink} aria-label="Instagram">
              <span>Instagram</span>
            </a>
            <a href="#" className={styles.socialLink} aria-label="LinkedIn">
              <span>LinkedIn</span>
            </a>
          </div>
          <div className={styles.copyright}>
            <p>&copy; 2024 PLAYNE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
