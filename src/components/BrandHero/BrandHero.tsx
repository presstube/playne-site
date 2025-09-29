import styles from './BrandHero.module.css'

export default function BrandHero() {
  return (
    <div className={styles.brandHero}>
      <img 
        src="/svg/Playne_Logo_Black_RGB.svg" 
        alt="PLAYNE Logo"
        className={styles.logo}
      />
    </div>
  )
}


