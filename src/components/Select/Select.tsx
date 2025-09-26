import { SelectHTMLAttributes, ReactNode } from 'react'
import FormField from '@/components/FormField/FormField'
import styles from './Select.module.css'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  error?: string
  children?: ReactNode
}

export default function Select({ 
  label, 
  options,
  placeholder = "Select an option",
  required = false, 
  error,
  id,
  name,
  className,
  children,
  ...props 
}: SelectProps) {
  const inputId = id || name || label.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <FormField className={className}>
      <label htmlFor={inputId} className={styles.label}>
        {label} {required && '*'}
      </label>
      <select
        id={inputId}
        name={name || inputId}
        required={required}
        className={`${styles.select} ${error ? styles.selectError : ''}`}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      {error && (
        <div id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </div>
      )}
    </FormField>
  )
}
