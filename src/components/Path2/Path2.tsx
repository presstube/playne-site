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
  wildness?: number // 0-1, controls how dramatic the curve bodies are (default 0.9)
}

export default function Path2({ 
  color: colorProp, 
  strokeWidth = 60, 
  lobes = 1, 
  amplitude = 0.4,
  bias = 'auto',
  wildness = 0.9
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
        bias,
        wildness
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
  }, [lobes, amplitude, bias, colorProp, strokeWidth, wildness])

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
  wildness: number
}

function generateExplicitBeziers(opts: BezierOptions): string {
  const { start, end, width, height, lobes, amplitude, strokeWidth, bias, wildness } = opts

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
    return generateSingleCurve(start, end, dirX, dirY, perpX, perpY, biasSign, maxSafeAmp, minRadius, wildness)
  } else if (lobes === 1) {
    // S-curve: two cubic Béziers with opposite offsets
    return generateSCurve(start, end, dirX, dirY, perpX, perpY, biasSign, maxSafeAmp, minRadius, pathLength, strokeWidth, wildness)
  } else {
    // Double S-curve: three cubic Béziers
    return generateDoubleSCurve(start, end, dirX, dirY, perpX, perpY, biasSign, maxSafeAmp, minRadius, pathLength, strokeWidth, wildness)
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
  minRadius: number,
  wildness: number
): string {
  // Single cubic Bézier with control points offset perpendicular
  // Wildness scales the perpendicular offset
  
  const dx = end.x - start.x
  const dy = end.y - start.y
  
  const cp1x = start.x + dx * 0.33 + perpX * amp * sign * wildness
  const cp1y = start.y + dy * 0.33 + perpY * amp * sign * wildness
  
  const cp2x = start.x + dx * 0.67 + perpX * amp * sign * wildness
  const cp2y = start.y + dy * 0.67 + perpY * amp * sign * wildness
  
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
  pathLength: number,
  strokeWidth: number,
  wildness: number
): string {
  // Two cubic Béziers meeting at midpoint with C1 continuity
  const midX = (start.x + end.x) / 2
  const midY = (start.y + end.y) / 2
  
  // Push amplitude into curve bodies - wildness scales the drama
  const cp1x = start.x + (midX - start.x) * 0.4 + perpX * amp * sign * wildness
  const cp1y = start.y + (midY - start.y) * 0.4 + perpY * amp * sign * wildness
  
  // Junction control points: positioned AWAY from midpoint along path, with moderate perpendicular offset
  // This ensures smooth flow through the transition, not a straight segment
  // Junction offset stays fixed for smoothness regardless of wildness
  const junctionOffset = Math.min(amp * 0.25, strokeWidth * 0.8)
  
  // cp2: approach the junction from first curve side
  const cp2x = midX - (midX - start.x) * 0.15 + perpX * junctionOffset * sign
  const cp2y = midY - (midY - start.y) * 0.15 + perpY * junctionOffset * sign
  
  // cp3: exit the junction toward second curve side
  const cp3x = midX + (end.x - midX) * 0.15 - perpX * junctionOffset * sign
  const cp3y = midY + (end.y - midY) * 0.15 - perpY * junctionOffset * sign
  
  // Second curve body: full amplitude scaled by wildness
  const cp4x = end.x - (end.x - midX) * 0.4 - perpX * amp * sign * wildness
  const cp4y = end.y - (end.y - midY) * 0.4 - perpY * amp * sign * wildness
  
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
  pathLength: number,
  strokeWidth: number,
  wildness: number
): string {
  // Three cubic Béziers at t=[0, 0.33, 0.67, 1.0] with alternating offsets
  const dx = end.x - start.x
  const dy = end.y - start.y
  
  const p1x = start.x + dx * 0.33
  const p1y = start.y + dy * 0.33
  
  const p2x = start.x + dx * 0.67
  const p2y = start.y + dy * 0.67
  
  // Junction offsets: moderate, with upstream/downstream positioning
  // Keep fixed for smoothness
  const junctionOffset = Math.min(amp * 0.25, strokeWidth * 0.8)
  
  // First segment: body gets amplitude scaled by wildness
  const cp1x = start.x + dx * 0.16 + perpX * amp * sign * wildness
  const cp1y = start.y + dy * 0.16 + perpY * amp * sign * wildness
  
  // cp2: approach p1 junction from upstream
  const cp2x = p1x - dx * 0.1 + perpX * junctionOffset * sign
  const cp2y = p1y - dy * 0.1 + perpY * junctionOffset * sign
  
  // cp3: exit p1 junction downstream
  const cp3x = p1x + dx * 0.1 - perpX * junctionOffset * sign
  const cp3y = p1y + dy * 0.1 - perpY * junctionOffset * sign
  
  // cp4: approach p2 junction from upstream
  const cp4x = p2x - dx * 0.1 - perpX * junctionOffset * sign
  const cp4y = p2y - dy * 0.1 - perpY * junctionOffset * sign
  
  // cp5: exit p2 junction downstream
  const cp5x = p2x + dx * 0.1 + perpX * junctionOffset * sign
  const cp5y = p2y + dy * 0.1 + perpY * junctionOffset * sign
  
  // Final segment: amplitude scaled by wildness
  const cp6x = end.x - dx * 0.16 + perpX * amp * sign * wildness
  const cp6y = end.y - dy * 0.16 + perpY * amp * sign * wildness
  
  return `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1x} ${p1y} C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${p2x} ${p2y} C ${cp5x} ${cp5y}, ${cp6x} ${cp6y}, ${end.x} ${end.y}`
}

