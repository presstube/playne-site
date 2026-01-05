'use client'

import { useState, useEffect } from 'react'
import { usePathDrawing } from '@/lib/pathDrawing/usePathDrawing'
import { useLandingTheme, THEME_COLORS } from '@/contexts/LandingThemeContext'

const BRAND_COLORS = [
  '#FC555B', // red
  '#FCDC4A', // yellow
  '#FB6DCB', // pink
  '#A9ECD4', // blue
  '#231f20', // black
]

const COLOR_STORAGE_KEY = 'landing1-path-color-index'

export default function PathDrawingOverlay() {
  const {
    isDrawingMode,
    rawPoints,
    processedPath,
    strokeWidth,
    pageHeight,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = usePathDrawing()

  const { theme, toggleTheme } = useLandingTheme()
  const [colorIndex, setColorIndex] = useState(0)

  // Load saved path color on mount
  useEffect(() => {
    const saved = localStorage.getItem(COLOR_STORAGE_KEY)
    if (saved) {
      const index = parseInt(saved, 10)
      if (!isNaN(index) && index >= 0 && index < BRAND_COLORS.length) {
        setColorIndex(index)
      }
    }
  }, [])

  const handlePathClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent background click from also firing
    const newIndex = (colorIndex + 1) % BRAND_COLORS.length
    setColorIndex(newIndex)
    localStorage.setItem(COLOR_STORAGE_KEY, newIndex.toString())
  }

  return (
    <>
      {/* Clickable background - toggles between black and beige */}
      {!isDrawingMode && pageHeight > 0 && (
        <div
          onClick={toggleTheme}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${pageHeight}px`,
            zIndex: -2, // Behind the path
            backgroundColor: THEME_COLORS[theme].bg,
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        />
      )}

      {/* Background path - scrolls with content */}
      {!isDrawingMode && processedPath && pageHeight > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${pageHeight}px`,
            zIndex: -1,
            pointerEvents: 'none' // Container is non-interactive
          }}
        >
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none' // SVG is non-interactive
            }}
          >
            <path
              d={processedPath}
              fill="none"
              stroke={BRAND_COLORS[colorIndex]}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              opacity={1.0}
              style={{
                pointerEvents: 'auto', // Only the path itself is clickable
                cursor: 'pointer'
              }}
              onClick={handlePathClick}
            />
          </svg>
        </div>
      )}
      
      {/* Drawing mode overlay - fixed fullscreen for drawing */}
      {isDrawingMode && (
        <svg
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            pointerEvents: 'auto',
            cursor: 'crosshair'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {rawPoints.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={3}
              fill="#FC555B"
            />
          ))}
        </svg>
      )}
    </>
  )
}

