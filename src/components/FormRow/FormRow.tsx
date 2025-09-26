import { ReactNode } from 'react'
import styles from './FormRow.module.css'

interface FormRowProps {
  children: ReactNode
  className?: string
}

export default function FormRow({ children, className }: FormRowProps) {
  return (
    <div className={`${styles.formRow} ${className || ''}`}>
      {children}
    </div>
  )
}
