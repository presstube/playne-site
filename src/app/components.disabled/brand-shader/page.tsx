import styles from './page.module.css'
import BrandShader from '@/components/BrandShader/BrandShader'

export default function Page() {
  return (
    <div className={styles.centered}>
      <BrandShader />
    </div>
  )
}

