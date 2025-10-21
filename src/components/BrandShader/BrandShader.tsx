import styles from './BrandShader.module.css'

export default function BrandShader() {
  return (
    <div className={styles.brandShader}>
      <img 
        src="/svg/Playne_Logo_Black_RGB.svg" 
        alt="PLAYNE Logo"
        className={styles.logo}
      />
    </div>
  )
}

