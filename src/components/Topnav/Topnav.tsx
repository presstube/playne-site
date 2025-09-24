import styles from './Topnav.module.css'
import Link from 'next/link'

export default function Topnav() {
  return (
    <nav className={styles.topnav}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <Link href="/" className={styles.brandLink}>
              Next Sanity Spike
            </Link>
          </div>
          <div className={styles.navigation}>
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
            <Link href="/about" className={styles.navLink}>
              About
            </Link>
            <Link href="/studio" className={styles.studioLink}>
              Studio
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
