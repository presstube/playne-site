import { ReactNode } from 'react'
import Button from '../Button/Button'
import styles from './Card.module.css'

interface CardProps {
  title?: string
  body?: string | ReactNode
  cta?: {
    text: string
    onClick?: () => void
    href?: string
    external?: boolean
    color?: 'red' | 'yellow' | 'pink' | 'blue' | 'black'
  }
  variant?: 'default' | 'bordered' | 'accent'
  children?: ReactNode
  className?: string
}

export default function Card({ 
  title,
  body,
  cta,
  variant = 'default',
  children,
  className 
}: CardProps) {
  const classNames = [
    styles.card,
    styles[`variant-${variant}`],
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={classNames}>
      {children ? (
        children
      ) : (
        <>
          {title && <h3 className={styles.title}>{title}</h3>}
          {body && (
            <div className={styles.body}>
              {typeof body === 'string' ? <p>{body}</p> : body}
            </div>
          )}
          {cta && (
            <div className={styles.cta}>
              <Button
                href={cta.href}
                onClick={cta.onClick}
                external={cta.external}
                color={cta.color}
              >
                {cta.text}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
