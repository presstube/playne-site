import styles from './page.module.css'
import BrandHero from '@/components/BrandHero/BrandHero'

export default function Page() {
  return (
    <div className={styles.centered}>
      <BrandHero />
    </div>
  )
}


