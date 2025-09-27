import { ReactNode } from 'react'
import ContentCard from '../ContentCard/ContentCard'
import Button from '../Button/Button'
import LinkButton from '../LinkButton/LinkButton'

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
        <LinkButton href={actionHref} variant="primary" size="medium">
          {actionText}
        </LinkButton>
      )
    }

    if (actionType === 'button') {
      return (
        <Button 
          variant="primary"
          size="medium"
          onClick={actionOnClick}
          disabled={actionDisabled}
        >
          {actionText}
        </Button>
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
