'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface LandingThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
}

const LandingThemeContext = createContext<LandingThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'landing1-theme'

export function LandingThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light') // Default to beige

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  return (
    <LandingThemeContext.Provider 
      value={{ 
        theme, 
        toggleTheme, 
        isDark: theme === 'dark' 
      }}
    >
      {children}
    </LandingThemeContext.Provider>
  )
}

export function useLandingTheme() {
  const context = useContext(LandingThemeContext)
  if (!context) {
    throw new Error('useLandingTheme must be used within LandingThemeProvider')
  }
  return context
}

// Color constants
export const THEME_COLORS = {
  dark: {
    bg: '#231f20', // black
    text: '#EAEADA', // beige (PLAYNE offwhite)
  },
  light: {
    bg: '#EAEADA', // beige (PLAYNE offwhite)
    text: '#231f20', // black
  },
}

