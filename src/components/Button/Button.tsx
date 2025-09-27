import { ReactNode, ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'hero' | 'submit' | 'danger'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  loading?: boolean
  className?: string
}

export default function Button({ 
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled,
  className,
  ...rest 
}: ButtonProps) {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ')

  return (
    <button 
      className={classNames}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <>
          <span className={styles.spinner}></span>
          {typeof children === 'string' ? 'Loading...' : children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
