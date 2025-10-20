'use client'

import { useEffect, useState, useRef } from 'react'
import styles from './Path2.module.css'

type Side = 'top' | 'bottom' | 'left' | 'right'

interface Point {
  x: number
  y: number
}

export const BRAND_COLORS = [
  '#FC555B', // red
  '#FCDC4A', // yellow
  '#FB6DCB', // pink
  '#A9ECD4', // blue
  '#EAEADA', // offwhite (for dark backgrounds)
]

interface Path2Props {
  color?: string
  strokeWidth?: number
  lobes?: 0 | 1 | 2
  amplitude?: number // 0-1 of min(width,height)
  bias?: 'left' | 'right' | 'auto'
}

export default function Path2({ 
  color: colorProp, 
  strokeWidth = 60, 
  lobes = 1, 
  amplitude = 0.4,
  bias = 'auto'
}: Path2Props = {}) {
  const [pathData, setPathData] = useState<string>('')
  const [color, setColor] = useState<string>('')
  const containerRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const generatePath = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      if (width === 0 || height === 0) return

      // Choose random entry and exit sides
      const sides: Side[] = ['top', 'bottom', 'left', 'right']
      const entrySide = sides[Math.floor(Math.random() * sides.length)]
      let exitSide = sides[Math.floor(Math.random() * sides.length)]
      
      while (exitSide === entrySide) {
        exitSide = sides[Math.floor(Math.random() * sides.length)]
      }

      const entry = getPointOnSide(entrySide, width, height, strokeWidth)
      const exit = getPointOnSide(exitSide, width, height, strokeWidth)

      const path = generateExplicitBeziers({ 
        start: entry, 
        end: exit, 
        width, 
        height, 
        lobes, 
        amplitude, 
        strokeWidth,
        bias 
      })
      
      setPathData(path)

      const chosen = colorProp || BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)]
      setColor(chosen)
    }

    const timer = setTimeout(() => {
      generatePath()
    }, 100)

    const handleResize = () => generatePath()
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [lobes, amplitude, bias, colorProp, strokeWidth])

  if (!pathData || !color) {
    return <svg ref={containerRef} className={styles.path2} xmlns="http://www.w3.org/2000/svg" />
  }

  return (
    <svg ref={containerRef} className={styles.path2} xmlns="http://www.w3.org/2000/svg">
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}

function getPointOnSide(side: Side, width: number, height: number, strokeWidth: number): Point {
  const margin = 0.2
  const min = margin
  const max = 1 - margin
  const overhang = strokeWidth * 3

  switch (side) {
    case 'top':
      return { x: width * (min + Math.random() * (max - min)), y: -overhang }
    case 'bottom':
      return { x: width * (min + Math.random() * (max - min)), y: height + overhang }
    case 'left':
      return { x: -overhang, y: height * (min + Math.random() * (max - min)) }
    case 'right':
      return { x: width + overhang, y: height * (min + Math.random() * (max - min)) }
  }
}

interface BezierOptions {
  start: Point
  end: Point
  width: number
  height: number
  lobes: 0 | 1 | 2
  amplitude: number
  strokeWidth: number
  bias: 'left' | 'right' | 'auto'
}

function generateExplicitBeziers(opts: BezierOptions): string {
  const { start, end, width, height, lobes, amplitude, strokeWidth, bias } = opts

  // Calculate minimum safe radius based on stroke width
  const minRadius = 2.5 * strokeWidth
  
  // Direction vector
  const dx = end.x - start.x
  const dy = end.y - start.y
  const pathLength = Math.hypot(dx, dy)
  const dirX = dx / pathLength
  const dirY = dy / pathLength
  
  // Perpendicular vector
  const perpX = -dirY
  const perpY = dirX
  
  // Determine bias direction
  const biasSign = bias === 'left' ? 1 : bias === 'right' ? -1 : (Math.random() < 0.5 ? 1 : -1)
  
  // Calculate safe amplitude that respects minimum radius
  const requestedAmp = Math.min(width, height) * amplitude
  const maxSafeAmp = Math.min(requestedAmp, pathLength / 4) // Ensure reasonable proportion
  
  if (lobes === 0) {
    // Single gentle curve to one side
    return generateSingleCurve(start, end, dirX, dirY, perpX, perpY, biasSign, maxSafeAmp, minRadius)
  } else if (lobes === 1) {
    // S-curve: two cubic Béziers with opposite offsets
    return generateSCurve(start, end, dirX, dirY, perpX, perpY, biasSign, maxSafeAmp, minRadius, pathLength)
  } else {
    // Double S-curve: three cubic Béziers
    return generateDoubleSCurve(start, end, dirX, dirY, perpX, perpY, biasSign, maxSafeAmp, minRadius, pathLength)
  }
}

function generateSingleCurve(
  start: Point, 
  end: Point, 
  dirX: number, 
  dirY: number, 
  perpX: number, 
  perpY: number, 
  sign: number, 
  amp: number,
  minRadius: number
): string {
  // Single cubic Bézier with control points offset perpendicular
  // Place controls at 1/3 and 2/3 along the path, offset by amplitude
  
  const dx = end.x - start.x
  const dy = end.y - start.y
  
  const cp1x = start.x + dx * 0.33 + perpX * amp * sign
  const cp1y = start.y + dy * 0.33 + perpY * amp * sign
  
  const cp2x = start.x + dx * 0.67 + perpX * amp * sign
  const cp2y = start.y + dy * 0.67 + perpY * amp * sign
  
  return `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`
}

function generateSCurve(
  start: Point,
  end: Point,
  dirX: number,
  dirY: number,
  perpX: number,
  perpY: number,
  sign: number,
  amp: number,
  minRadius: number,
  pathLength: number
): string {
  // Two cubic Béziers meeting at midpoint with C1 continuity
  const midX = (start.x + end.x) / 2
  const midY = (start.y + end.y) / 2
  
  // First curve bends one way
  const cp1x = start.x + (midX - start.x) * 0.5 + perpX * amp * sign
  const cp1y = start.y + (midY - start.y) * 0.5 + perpY * amp * sign
  
  const cp2x = midX + perpX * amp * sign * 0.3
  const cp2y = midY + perpY * amp * sign * 0.3
  
  // Second curve bends opposite way with smooth transition
  const cp3x = midX - perpX * amp * sign * 0.3
  const cp3y = midY - perpY * amp * sign * 0.3
  
  const cp4x = end.x - (end.x - midX) * 0.5 - perpX * amp * sign
  const cp4y = end.y - (end.y - midY) * 0.5 - perpY * amp * sign
  
  return `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${midX} ${midY} C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${end.x} ${end.y}`
}

function generateDoubleSCurve(
  start: Point,
  end: Point,
  dirX: number,
  dirY: number,
  perpX: number,
  perpY: number,
  sign: number,
  amp: number,
  minRadius: number,
  pathLength: number
): string {
  // Three cubic Béziers at t=[0, 0.33, 0.67, 1.0] with alternating offsets
  const dx = end.x - start.x
  const dy = end.y - start.y
  
  const p1x = start.x + dx * 0.33
  const p1y = start.y + dy * 0.33
  
  const p2x = start.x + dx * 0.67
  const p2y = start.y + dy * 0.67
  
  // First segment: positive offset
  const cp1x = start.x + dx * 0.16 + perpX * amp * sign * 0.8
  const cp1y = start.y + dy * 0.16 + perpY * amp * sign * 0.8
  
  const cp2x = p1x + perpX * amp * sign * 0.5
  const cp2y = p1y + perpY * amp * sign * 0.5
  
  // Second segment: negative offset
  const cp3x = p1x - perpX * amp * sign * 0.5
  const cp3y = p1y - perpY * amp * sign * 0.5
  
  const cp4x = p2x - perpX * amp * sign * 0.8
  const cp4y = p2y - perpY * amp * sign * 0.8
  
  // Third segment: positive offset again
  const cp5x = p2x + perpX * amp * sign * 0.5
  const cp5y = p2y + perpY * amp * sign * 0.5
  
  const cp6x = end.x - dx * 0.16 + perpX * amp * sign * 0.8
  const cp6y = end.y - dy * 0.16 + perpY * amp * sign * 0.8
  
  return `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1x} ${p1y} C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${p2x} ${p2y} C ${cp5x} ${cp5y}, ${cp6x} ${cp6y}, ${end.x} ${end.y}`
}

