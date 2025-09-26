import { ReactNode } from 'react'
import styles from './FormField.module.css'

interface FormFieldProps {
  children: ReactNode
  className?: string
}

export default function FormField({ children, className }: FormFieldProps) {
  const classNames = [styles.formGroup, className].filter(Boolean).join(' ')
  
  return (
    <div className={classNames} suppressHydrationWarning>
      {children}
    </div>
  )
}
