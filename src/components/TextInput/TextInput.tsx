import { InputHTMLAttributes } from 'react'
import FormField from '@/components/FormField/FormField'
import styles from './TextInput.module.css'

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  type?: 'text' | 'email' | 'password' | 'tel'
  required?: boolean
  error?: string
}

export default function TextInput({ 
  label, 
  type = 'text', 
  required = false, 
  error,
  id,
  name,
  className,
  ...props 
}: TextInputProps) {
  const inputId = id || name || label.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <FormField className={className}>
      <label htmlFor={inputId} className={styles.label}>
        {label} {required && '*'}
      </label>
      <input
        type={type}
        id={inputId}
        name={name || inputId}
        required={required}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <div id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </div>
      )}
    </FormField>
  )
}
