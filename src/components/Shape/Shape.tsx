"use client"
import { useMemo, useState, useEffect } from 'react'
import styles from './Shape.module.css'
import { generateShape } from './shapeGenerator'

// Brand colors (excluding offwhite)
const BRAND_COLORS = [
  '#231f20', // black
  '#FC555B', // red
  '#FCDC4A', // yellow
  '#FB6DCB', // pink
  '#A9ECD4', // blue
]

function pickRandomBrandColor(): string {
  return BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)]
}

export interface ShapeProps {
  shapeType?: 'blob' | 'spike' | 'random'
  width?: number
  height?: number
  color?: string
  lobes?: number
  rotation?: number
  seed?: number
  className?: string
}

export default function Shape({
  shapeType = 'random',
  width = 800,
  height = 480,
  color,
  lobes,
  rotation,
  seed,
  className
}: ShapeProps) {
  
  const [mounted, setMounted] = useState(false)
  
  // Only generate shape on client side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const shape = useMemo(() => {
    if (!mounted) return null
    
    const actualType = shapeType === 'random' 
      ? (Math.random() < 0.6 ? 'blob' : 'spike')
      : shapeType
    
    const actualSeed = seed !== undefined ? seed : Math.floor(Math.random() * 100000)
      
    return generateShape({
      width: width || 800,
      height: height || 480,
      shapeType: actualType,
      seed: actualSeed,
      lobes,
      rotation
    })
  }, [mounted, shapeType, width, height, lobes, rotation, seed])

  const shapeColor = useMemo(() => {
    if (!mounted) return '#231f20'
    return color || pickRandomBrandColor()
  }, [mounted, color])

  const cx = (...args: Array<string | false | null | undefined>) => args.filter(Boolean).join(' ')

  if (!mounted || !shape) {
    return (
      <div className={cx(styles.shapeContainer, className)}>
        <svg 
          viewBox={`0 0 ${width} ${height}`}
          className={styles.svg}
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    )
  }

  return (
    <div className={cx(styles.shapeContainer, className)}>
      <svg 
        viewBox={`0 0 ${shape.width} ${shape.height}`}
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto' }}
      >
        <g transform={`translate(${shape.width / 2}, ${shape.height / 2}) rotate(${shape.rotation})`}>
          <path
            d={shape.pathData}
            fill={shapeColor}
            transform={`translate(${-shape.width / 2}, ${-shape.height / 2})`}
          />
        </g>
      </svg>
    </div>
  )
}

