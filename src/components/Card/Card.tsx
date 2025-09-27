import { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'bordered' | 'accent-border'
  hover?: boolean
  className?: string
}

export default function Card({ 
  children, 
  variant = 'default',
  hover = true,
  className 
}: CardProps) {
  const classNames = [
    styles.card,
    styles[variant],
    hover && styles.hover,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={classNames}>
      {children}
    </div>
  )
}
