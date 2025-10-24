'use client'

import { useEffect, useState, useRef } from 'react'
import seedrandom from 'seedrandom'
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
  onClick?: (e: React.MouseEvent) => void
  seed?: number // Seed for reproducible paths
}

export default function Path2({ 
  color: colorProp, 
  strokeWidth = 60, 
  lobes = 1, 
  amplitude = 0.4,
  bias = 'auto',
  wildness = 0.9,
  onClick,
  seed
}: Path2Props = {}) {
  console.log('Path2 rendering with props:', { colorProp, strokeWidth, lobes, amplitude, bias, wildness })
  const [pathData, setPathData] = useState<string>('')
  const [color, setColor] = useState<string>('')
  const [hasOnScreenEndpoint, setHasOnScreenEndpoint] = useState(false)
  const containerRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    console.log('Path2 useEffect fired')
    const generatePath = () => {
      console.log('generatePath called, containerRef.current:', containerRef.current)
      if (!containerRef.current) {
        console.log('No container ref yet, returning')
        return
      }

      const rect = containerRef.current.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      if (width === 0 || height === 0) {
        console.log('Container has zero dimensions:', { width, height })
        return
      }

      console.log('Container bounds:', { width, height, x: rect.x, y: rect.y })

      // Create seeded random generator if seed provided, otherwise use Math.random
      const rng = seed !== undefined ? seedrandom(seed.toString()) : Math.random

      // 1 in 7 chance (~14%) to have one endpoint on-screen
      const hasOnScreenEndpoint = rng() < (1/7)
      const startOnScreen = hasOnScreenEndpoint && rng() < 0.5 // 50/50 which end if true
      const endOnScreen = hasOnScreenEndpoint && !startOnScreen

      let entry: Point
      let exit: Point

      if (startOnScreen) {
        // Start somewhere in the middle of the container
        entry = {
          x: width * (0.2 + rng() * 0.6), // 20-80% across
          y: height * (0.2 + rng() * 0.6) // 20-80% down
        }
        console.log('Path starting ON-SCREEN:', entry)
      } else {
        // Start from a random side (off-screen)
        const sides: Side[] = ['top', 'bottom', 'left', 'right']
        const entrySide = sides[Math.floor(rng() * sides.length)]
        entry = getPointOnSide(entrySide, width, height, strokeWidth, rng)
        console.log('Path entry:', entry, 'from side:', entrySide)
      }

      if (endOnScreen) {
        // End somewhere in the middle of the container
        exit = {
          x: width * (0.2 + rng() * 0.6),
          y: height * (0.2 + rng() * 0.6)
        }
        console.log('Path ending ON-SCREEN:', exit)
      } else {
        // Exit from a random side (off-screen)
        const sides: Side[] = ['top', 'bottom', 'left', 'right']
        let exitSide = sides[Math.floor(rng() * sides.length)]
        
        // If starting off-screen, ensure exit is from a different side
        if (!startOnScreen) {
          const entrySide = sides.find(s => {
            const testPoint = getPointOnSide(s, width, height, strokeWidth, rng)
            return Math.abs(testPoint.x - entry.x) < 10 && Math.abs(testPoint.y - entry.y) < 10
          })
          while (exitSide === entrySide) {
            exitSide = sides[Math.floor(rng() * sides.length)]
          }
        }
        
        exit = getPointOnSide(exitSide, width, height, strokeWidth, rng)
        console.log('Path exit:', exit, 'from side:', exitSide)
      }

      // Safety check: if both points are off-screen, ensure the line between them crosses the container
      if (!startOnScreen && !endOnScreen) {
        const lineIntersectsContainer = doesLineIntersectRect(entry, exit, width, height)
        if (!lineIntersectsContainer) {
          // Force one endpoint to be on-screen to ensure visibility
          console.log('Path would be completely off-screen, forcing one endpoint on-screen')
          entry = {
            x: width * (0.2 + rng() * 0.6),
            y: height * (0.2 + rng() * 0.6)
          }
        }
      }

      const path = generateExplicitBeziers({ 
        start: entry, 
        end: exit, 
        width, 
        height, 
        lobes, 
        amplitude, 
        strokeWidth,
        bias,
        wildness,
        rng
      })
      
      setPathData(path)

      const chosen = colorProp || BRAND_COLORS[Math.floor(rng() * BRAND_COLORS.length)]
      setColor(chosen)
      
      // Store whether this path has an on-screen endpoint for rendering
      setHasOnScreenEndpoint(startOnScreen || endOnScreen)
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
  }, [lobes, amplitude, bias, colorProp, strokeWidth, wildness, seed])

  if (!pathData || !color) {
    console.log('Path2 not rendering path yet:', { hasPathData: !!pathData, hasColor: !!color })
    return <svg ref={containerRef} className={styles.path2} xmlns="http://www.w3.org/2000/svg" />
  }

  console.log('Path2 rendering full path with color:', color)
  return (
    <svg ref={containerRef} className={styles.path2} xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}>
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        onClick={onClick}
        style={{ cursor: 'pointer', pointerEvents: 'auto' }}
      />
    </svg>
  )
}

function getPointOnSide(side: Side, width: number, height: number, strokeWidth: number, rng: () => number = Math.random): Point {
  const margin = 0.2
  const min = margin
  const max = 1 - margin
  const overhang = strokeWidth * 0.75 // Reduced from 3x to 0.75x for better visibility

  switch (side) {
    case 'top':
      return { x: width * (min + rng() * (max - min)), y: -overhang }
    case 'bottom':
      return { x: width * (min + rng() * (max - min)), y: height + overhang }
    case 'left':
      return { x: -overhang, y: height * (min + rng() * (max - min)) }
    case 'right':
      return { x: width + overhang, y: height * (min + rng() * (max - min)) }
  }
}

// Check if a line segment from p1 to p2 intersects with a rectangle (0,0,width,height)
function doesLineIntersectRect(p1: Point, p2: Point, width: number, height: number): boolean {
  // If either point is inside the rectangle, the line intersects
  if ((p1.x >= 0 && p1.x <= width && p1.y >= 0 && p1.y <= height) ||
      (p2.x >= 0 && p2.x <= width && p2.y >= 0 && p2.y <= height)) {
    return true
  }

  // Check if line intersects any of the four edges of the rectangle
  const rectEdges = [
    { x1: 0, y1: 0, x2: width, y2: 0 },       // top edge
    { x1: width, y1: 0, x2: width, y2: height }, // right edge
    { x1: width, y1: height, x2: 0, y2: height }, // bottom edge
    { x1: 0, y1: height, x2: 0, y2: 0 }       // left edge
  ]

  for (const edge of rectEdges) {
    if (doLinesIntersect(
      p1.x, p1.y, p2.x, p2.y,
      edge.x1, edge.y1, edge.x2, edge.y2
    )) {
      return true
    }
  }

  return false
}

// Check if two line segments intersect using cross product method
function doLinesIntersect(
  x1: number, y1: number, x2: number, y2: number,
  x3: number, y3: number, x4: number, y4: number
): boolean {
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
  
  if (Math.abs(denom) < 1e-10) {
    return false // Lines are parallel
  }

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom

  return t >= 0 && t <= 1 && u >= 0 && u <= 1
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
  rng: () => number
}

function generateExplicitBeziers(opts: BezierOptions): string {
  const { start, end, width, height, lobes, amplitude, strokeWidth, bias, wildness, rng } = opts

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
  const biasSign = bias === 'left' ? 1 : bias === 'right' ? -1 : (rng() < 0.5 ? 1 : -1)
  
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

