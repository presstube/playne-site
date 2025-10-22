"use client"
import { useState } from 'react'
import Shape from '@/components/Shape/Shape'
import styles from './page.module.css'

export default function Page() {
  const [key, setKey] = useState(0)
  
  const handleClick = () => {
    setKey(k => k + 1)
  }
  
  return (
    <div className={styles.page}>
      <div 
        className={styles.card}
        onClick={handleClick}
        role="button"
        aria-label="Click to generate new shape"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        <Shape key={key} />
      </div>
    </div>
  )
}

