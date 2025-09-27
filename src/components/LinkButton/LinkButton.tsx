import { ReactNode, AnchorHTMLAttributes } from 'react'
import Link from 'next/link'
import styles from './LinkButton.module.css'

interface LinkButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  children: ReactNode
  href: string
  variant?: 'primary' | 'secondary' | 'hero' | 'danger'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  external?: boolean
  className?: string
}

export default function LinkButton({ 
  children,
  href,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  external = false,
  className,
  ...rest 
}: LinkButtonProps) {
  const classNames = [
    styles.linkButton,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className
  ].filter(Boolean).join(' ')

  if (external) {
    return (
      <a 
        href={href}
        className={classNames}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classNames} {...rest}>
      {children}
    </Link>
  )
}
