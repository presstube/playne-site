import { TextareaHTMLAttributes } from 'react'
import FormField from '@/components/FormField/FormField'
import styles from './TextArea.module.css'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  required?: boolean
  error?: string
}

export default function TextArea({ 
  label, 
  required = false, 
  error,
  id,
  name,
  className,
  rows = 4,
  ...props 
}: TextAreaProps) {
  const inputId = id || name || label.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <FormField className={className}>
      <label htmlFor={inputId} className={styles.label}>
        {label} {required && '*'}
      </label>
      <textarea
        id={inputId}
        name={name || inputId}
        required={required}
        rows={rows}
        className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
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
