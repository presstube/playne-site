import { ReactNode } from 'react'
import styles from './PageSection.module.css'

interface PageSectionProps {
  id?: string
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export default function PageSection({ 
  id, 
  title, 
  description, 
  children, 
  className 
}: PageSectionProps) {
  return (
    <section id={id} className={`${styles.section} ${className || ''}`}>
      <div className={styles.sectionContent}>
        {title && (
          <h2 className={styles.sectionTitle}>{title}</h2>
        )}
        {description && (
          <p className={styles.sectionDescription}>{description}</p>
        )}
        {children}
      </div>
    </section>
  )
}
