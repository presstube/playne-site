import styles from './RootLayout.module.css'
import Topnav from '@/components/Topnav/Topnav'
import { ReactNode } from 'react'

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className={styles.rootLayout}>
      <Topnav />
      <main className={styles.main}>
        <div className={styles.container}>
          {children}
        </div>
      </main>
    </div>
  )
}
