'use client'

import { useState, useEffect } from 'react'
import styles from './PasswordGate.module.css'
import { PLAYNE_LOGO_PATH } from '@/components/shared/playne-logo-path'

interface PasswordGateProps {
  children: React.ReactNode
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if password protection is enabled
    const isEnabled = process.env.NEXT_PUBLIC_SITE_PASSWORD_ENABLED === 'true'
    const savedPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD
    
    if (!isEnabled || !savedPassword) {
      setIsAuthenticated(true)
      return
    }

    // Check if already authenticated
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('site-auth='))
      ?.split('=')[1]

    if (authCookie === savedPassword) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD

    if (password === correctPassword) {
      // Set cookie (7 days)
      document.cookie = `site-auth=${correctPassword}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    )
  }

  // Authenticated - show content
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Not authenticated - show password form
  return (
    <div className={styles.gate}>
      <div className={styles.modal}>
        <svg className={styles.logo} viewBox="0 0 4000 1393.81" xmlns="http://www.w3.org/2000/svg">
          <path fill="#EAEADA" d={PLAYNE_LOGO_PATH} />
        </svg>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className={styles.input}
            autoFocus
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}

