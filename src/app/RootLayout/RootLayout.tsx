'use client'

import styles from './RootLayout.module.css'
import Topnav from '@/components/Topnav/Topnav'
import PageNavigation from '@/components/PageNavigation/PageNavigation'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname()
  const isFrameless = pathname === '/' || pathname?.startsWith('/components') || pathname?.startsWith('/story') || pathname?.startsWith('/landing')
  
  return (
    <div className={styles.rootLayout}>
      {!isFrameless && (
        <div>
          <PageNavigation currentPath={pathname} />
          <Topnav />
        </div>
      )}
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
