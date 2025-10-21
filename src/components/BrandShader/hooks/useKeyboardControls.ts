import { useState, useEffect } from 'react'

export type DisplayMode = 'masked' | 'fullscreen' | 'background'

export function useKeyboardControls(maxShaderIndex: number) {
  const [shaderIndex, setShaderIndex] = useState(0)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('masked')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys 1-9 for shader selection
      const num = parseInt(e.key)
      if (!isNaN(num) && num >= 1 && num <= 9) {
        const newIndex = num - 1
        if (newIndex < maxShaderIndex) {
          setShaderIndex(newIndex)
        }
      }
      
      // Spacebar to cycle through display modes
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault() // Prevent page scroll
        setDisplayMode(prev => {
          if (prev === 'masked') return 'fullscreen'
          if (prev === 'fullscreen') return 'background'
          return 'masked'
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [maxShaderIndex])

  return { shaderIndex, displayMode }
}

