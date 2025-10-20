'use client'

import { useEffect, useState, useRef } from 'react'
import styles from './Path.module.css'
import { buildPathFromCubics, catmullRomToBeziers, createRng, hashSeed, lowFreqNoise, Point as mathPoint, smoothstep } from './math'

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

type PathStyle = 'gentle' | 'exaggerated'

interface PathProps {
  meander?: number
  color?: string
  strokeWidth?: number
  seed?: string | number
  debug?: boolean
  style?: PathStyle
  lobes?: 0 | 1 | 2
  amplitude?: number // 0..1 of min(width,height)
  bias?: 'left' | 'right' | 'auto'
}

export default function Path({ meander: meanderProp, color: colorProp, strokeWidth = 60, seed, debug = false, style = 'gentle', lobes = 1, amplitude, bias = 'auto' }: PathProps = {}) {
  const [pathData, setPathData] = useState<string>('')
  const [color, setColor] = useState<string>('')
  const [meander] = useState<number>(
    typeof meanderProp === 'number' ? Math.min(1, Math.max(0, meanderProp)) : Math.random()
  ) // 0-1, set once per component instance
  const containerRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const generatePath = () => {
      if (!containerRef.current) {
        console.log('Path: No container ref yet')
        return
      }

      // Get container dimensions
      const rect = containerRef.current.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      console.log('Path: Container dimensions', { width, height, meander })

      if (width === 0 || height === 0) {
        console.log('Path: Container has zero dimensions, skipping')
        return
      }

      // Choose random entry and exit sides
      const sides: Side[] = ['top', 'bottom', 'left', 'right']
      const entrySide = sides[Math.floor(Math.random() * sides.length)]
      let exitSide = sides[Math.floor(Math.random() * sides.length)]
      
      // Ensure exit is different from entry
      while (exitSide === entrySide) {
        exitSide = sides[Math.floor(Math.random() * sides.length)]
      }

      console.log('Path: Entry/Exit', { entrySide, exitSide })

      // Generate entry point
      const entry = getPointOnSide(entrySide, width, height)
      // Generate exit point
      const exit = getPointOnSide(exitSide, width, height)

      console.log('Path: Entry/Exit points', { entry, exit })

      // Generate control points for smooth curve with meander amount
      const path = generateCurvedPath({ start: entry, end: exit, width, height, meander, strokeWidth, seed, debug, style, lobes, amplitude, bias })
      setPathData(path)

      // Pick random brand color
      const chosen = colorProp || BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)]
      setColor(chosen)

      if (debug) console.log('Path: Generated', { path: path.substring(0, 50) + '...', color: chosen, meander })
    }

    // Initial generation with slight delay to ensure container is rendered
    const timer = setTimeout(() => {
      generatePath()
    }, 100)

    // Regenerate on resize
    const handleResize = () => generatePath()
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [meander])

  if (!pathData || !color) {
    console.log('Path: Not rendering path - missing data', { hasPath: !!pathData, hasColor: !!color })
    return <svg ref={containerRef} className={styles.path} xmlns="http://www.w3.org/2000/svg" />
  }

  console.log('Path: Rendering SVG with path')

  return (
    <svg ref={containerRef} className={styles.path} xmlns="http://www.w3.org/2000/svg">
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

function getPointOnSide(side: Side, width: number, height: number): Point {
  const margin = 0.2 // Stay between 20% and 80% of the side
  const min = margin
  const max = 1 - margin
  const overhang = 60 // Extend path outside container to hide stroke caps

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

interface CurveOptions {
  start: Point
  end: Point
  width: number
  height: number
  meander: number
  strokeWidth: number
  seed?: string | number
  debug?: boolean
  style: PathStyle
  lobes: 0 | 1 | 2
  amplitude?: number
  bias: 'left' | 'right' | 'auto'
}

function generateCurvedPath(opts: CurveOptions): string {
  const { start, end, width, height, meander, strokeWidth, seed, debug, style, lobes, amplitude, bias } = opts

  const rng = createRng(hashSeed(seed ?? `${start.x},${start.y}-${end.x},${end.y}-${width}x${height}`))

  const dx = end.x - start.x
  const dy = end.y - start.y
  const baseLen = Math.max(1, Math.hypot(dx, dy))
  const dirX = dx / baseLen
  const dirY = dy / baseLen
  const perpX = -dirY
  const perpY = dirX

  // Base amplitude (fraction of min dimension); allow override and style boost
  const baseAmpFrac = amplitude ?? (style === 'exaggerated' ? 0.7 : 0.18)
  const amp = Math.min(width, height) * baseAmpFrac * (0.6 + 0.4 * meander)

  // Waypoints
  const pts: mathPoint[] = [start]

  if (style === 'exaggerated') {
    // Intelligent lobe/waypoint selection based on amplitude
    // High amplitude needs fewer waypoints and lobes to stay smooth
    let actualLobes = lobes
    let tVals: number[]
    
    if (amp > Math.min(width, height) * 0.45) {
      // High amplitude: restrict to 0-1 lobes max, wide spacing
      actualLobes = Math.min(lobes, 1) as 0 | 1
      tVals = actualLobes === 1 ? [0.35, 0.65] : [0.5]
    } else {
      // Lower amplitude: can handle 2 lobes with moderate spacing
      tVals = lobes === 2 ? [0.25, 0.5, 0.75] : lobes === 1 ? [0.3, 0.7] : [0.5]
    }
    
    const biasSign = bias === 'left' ? 1 : bias === 'right' ? -1 : (rng() < 0.5 ? 1 : -1)
    const signs = actualLobes === 2 ? [biasSign, -biasSign, biasSign] : actualLobes === 1 ? [biasSign, -biasSign] : [biasSign]

    for (let i = 0; i < tVals.length; i++) {
      const t = tVals[i]
      const baseX = start.x + dx * t
      const baseY = start.y + dy * t
      
      // Smoother envelope with wider taper near ends
      const taperWidth = 0.15 // Taper over 15% at each end
      const env = t < taperWidth 
        ? smoothstep(t / taperWidth)
        : t > (1 - taperWidth)
        ? smoothstep((1 - t) / taperWidth)
        : 1.0
      
      const jitter = 0.95 + rng() * 0.1 // Reduced jitter range
      const offset = amp * env * jitter * signs[i]
      pts.push({ x: baseX + perpX * offset, y: baseY + perpY * offset })
    }
  } else {
    // Gentle: a few low-frequency perturbed points
    const minPts = 2
    const maxPts = 5
    const numInterior = Math.floor(minPts + meander * (maxPts - minPts))
    const taper = (t: number) => smoothstep(Math.min(t, 1 - t) * 2)
    for (let i = 1; i <= numInterior; i++) {
      const t = i / (numInterior + 1)
      const baseX = start.x + dx * t
      const baseY = start.y + dy * t
      const n = lowFreqNoise(t, rng, 1)
      const offset = amp * taper(t) * n
      pts.push({ x: baseX + perpX * offset, y: baseY + perpY * offset })
    }
  }

  pts.push(end)

  // Ghost points for endpoint tangents
  const overhang = strokeWidth * (style === 'exaggerated' ? 5 : 2)
  const startGhost: mathPoint = { x: start.x - dirX * overhang, y: start.y - dirY * overhang }
  const endGhost: mathPoint = { x: end.x + dirX * overhang, y: end.y + dirY * overhang }
  const crPoints = [startGhost, ...pts, endGhost]

  const clampRatio = style === 'exaggerated' ? 0.4 : 0.35
  const cubics = catmullRomToBeziers(crPoints, 0.5, clampRatio)
  const trimmed = cubics.slice(1)
  return buildPathFromCubics(start, trimmed)
}

