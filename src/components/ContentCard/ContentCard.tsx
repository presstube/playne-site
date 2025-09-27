import { ReactNode } from 'react'
import Card from '../Card/Card'
import styles from './ContentCard.module.css'

interface ContentCardProps {
  title: string
  description?: string | ReactNode
  icon?: ReactNode
  variant?: 'default' | 'bordered' | 'accent-border'
  textAlign?: 'left' | 'center'
  children?: ReactNode
  className?: string
}

export default function ContentCard({ 
  title,
  description,
  icon,
  variant = 'default',
  textAlign = 'left',
  children,
  className 
}: ContentCardProps) {
  const contentClassNames = [
    styles.content,
    styles[`align-${textAlign}`]
  ].filter(Boolean).join(' ')

  return (
    <Card variant={variant} className={className}>
      <div className={contentClassNames}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <h3 className={styles.title}>{title}</h3>
        {description && (
          <div className={styles.description}>
            {typeof description === 'string' ? <p>{description}</p> : description}
          </div>
        )}
        {children}
      </div>
    </Card>
  )
}
