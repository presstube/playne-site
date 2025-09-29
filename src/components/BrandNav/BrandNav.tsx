import styles from './BrandNav.module.css'

export default function BrandNav() {
  return (
    <div className={styles.brandNav}>
      <img 
        src="/svg/Playne_Logo_Black_RGB.svg" 
        alt="PLAYNE Logo"
        className={styles.logo}
      />
    </div>
  )
}


