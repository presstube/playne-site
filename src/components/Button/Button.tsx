import { ReactNode, ButtonHTMLAttributes } from 'react'
import Link from 'next/link'
import styles from './Button.module.css'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  children: ReactNode
  onClick?: () => void
  href?: string
  external?: boolean
  color?: 'red' | 'yellow' | 'pink' | 'blue' | 'black'
  variant?: 'filled' | 'outlined'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  className?: string
  loading?: boolean
}

export default function Button({ 
  children,
  onClick,
  href,
  external = false,
  color = 'black',
  variant = 'filled',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className,
  loading = false,
  ...rest 
}: ButtonProps) {
  const classNames = [
    styles.button,
    styles[`color-${color}`],
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ')

  // If href is provided, render as link
  if (href) {
    if (external) {
      return (
        <a 
          href={href}
          className={classNames}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      )
    }
    
    return (
      <Link href={href} className={classNames}>
        {children}
      </Link>
    )
  }

  // Otherwise render as button
  return (
    <button 
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}
