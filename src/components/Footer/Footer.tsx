import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  const sitemap = [
    { label: 'home', href: '/' },
    { label: 'about', href: '/about' },
    { label: 'programs', href: '/programs' },
    { label: 'shop', href: '/shop' },
    { label: 'contact', href: '/contact' },
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoColumn}>
          <img 
            src="/svg/Playne_Logo_Black_RGB.svg" 
            alt="PLAYNE Logo"
            className={styles.logo}
          />
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

