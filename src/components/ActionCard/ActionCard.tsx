import { ReactNode } from 'react'
import Link from 'next/link'
import ContentCard from '../ContentCard/ContentCard'
import styles from './ActionCard.module.css'

interface ActionCardProps {
  title: string
  description?: string | ReactNode
  icon?: ReactNode
  variant?: 'default' | 'bordered' | 'accent-border'
  textAlign?: 'left' | 'center'
  
  // Action props
  actionType?: 'link' | 'button'
  actionText?: string
  actionHref?: string
  actionOnClick?: () => void
  actionDisabled?: boolean
  
  // Additional content
  children?: ReactNode
  className?: string
}

export default function ActionCard({ 
  title,
  description,
  icon,
  variant = 'default',
  textAlign = 'center',
  actionType = 'link',
  actionText,
  actionHref,
  actionOnClick,
  actionDisabled = false,
  children,
  className 
}: ActionCardProps) {
  const renderAction = () => {
    if (!actionText) return null

    if (actionType === 'link' && actionHref) {
      return (
        <Link href={actionHref} className={styles.actionLink}>
          {actionText}
        </Link>
      )
    }

    if (actionType === 'button') {
      return (
        <button 
          className={styles.actionButton}
          onClick={actionOnClick}
          disabled={actionDisabled}
        >
          {actionText}
        </button>
      )
    }

    return null
  }

  return (
    <ContentCard
      title={title}
      description={description}
      icon={icon}
      variant={variant}
      textAlign={textAlign}
      className={className}
    >
      {children}
      {renderAction()}
    </ContentCard>
  )
}
