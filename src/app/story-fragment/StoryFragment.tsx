'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { urlFor } from '@/sanity/lib/image'
import { GalleryImage } from '@/lib/image-hat'
import styles from './StoryFragment.module.css'

interface StoryFragmentProps {
  images: GalleryImage[]
}

type Point = { x: number; y: number }  // Now represents normalized coords (0-1)
type PathMode = 'idle' | 'ready' | 'drawing'

interface FrameBounds {
  left: number
  top: number
  width: number
  height: number
}

interface PathControls {
  // Stage 1: Simplification
  simplifyTolerance: number       // 0-30 (extended)
  
  // Stage 2: Resampling
  enableResampling: boolean
  sampleDistance: number          // 5-50px
  
  // Stage 3: Smoothing
  smoothness: number              // 0-3 (extended)
  tension: number                 // 0-2 (extended)
  cornerThreshold: number         // 0-180 degrees
  cornerSharpness: number         // 0-1
  
  // Stage 4: Multi-pass smoothing (new)
  smoothPasses: number            // 1-5
  
  // Visualization
  showDots: boolean
  showSimplified: boolean
  showResampled: boolean
  showPath: boolean
}

// ============================================================================
// COORDINATE TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Get frame bounds from DOM element
 */
function getFrameBounds(frameElement: HTMLElement): FrameBounds {
  const rect = frameElement.getBoundingClientRect()
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height
  }
}

/**
 * Convert viewport mouse coordinates to normalized frame coordinates (0-1)
 * This makes paths resolution-independent for export
 */
function viewportToNormalized(
  clientX: number,
  clientY: number,
  bounds: FrameBounds
): Point {
  const frameX = clientX - bounds.left
  const frameY = clientY - bounds.top
  
  return {
    x: frameX / bounds.width,   // Normalize to 0-1
    y: frameY / bounds.height
  }
}

/**
 * Check if normalized point is within frame bounds (0-1 range)
 */
function isPointInFrame(point: Point): boolean {
  return point.x >= 0 && 
         point.x <= 1 && 
         point.y >= 0 && 
         point.y <= 1
}

// ============================================================================
// PATH SMOOTHING ALGORITHMS
// ============================================================================

// Ramer-Douglas-Peucker algorithm for path simplification
function simplifyPath(points: Point[], tolerance: number): Point[] {
  if (points.length <= 2) return points
  
  const sqTolerance = tolerance * tolerance
  
  function getSquareDistance(p1: Point, p2: Point): number {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    return dx * dx + dy * dy
  }
  
  function getSquareSegmentDistance(p: Point, p1: Point, p2: Point): number {
    let x = p1.x
    let y = p1.y
    let dx = p2.x - x
    let dy = p2.y - y
    
    if (dx !== 0 || dy !== 0) {
      const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy)
      
      if (t > 1) {
        x = p2.x
        y = p2.y
      } else if (t > 0) {
        x += dx * t
        y += dy * t
      }
    }
    
    dx = p.x - x
    dy = p.y - y
    
    return dx * dx + dy * dy
  }
  
  function simplifyDPStep(points: Point[], first: number, last: number, sqTolerance: number, simplified: Point[]): void {
    let maxSqDist = sqTolerance
    let index = 0
    
    for (let i = first + 1; i < last; i++) {
      const sqDist = getSquareSegmentDistance(points[i], points[first], points[last])
      
      if (sqDist > maxSqDist) {
        index = i
        maxSqDist = sqDist
      }
    }
    
    if (maxSqDist > sqTolerance) {
      if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified)
      simplified.push(points[index])
      if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified)
    }
  }
  
  const last = points.length - 1
  const simplified = [points[0]]
  simplifyDPStep(points, 0, last, sqTolerance, simplified)
  simplified.push(points[last])
  
  return simplified
}

// Arc-length resampling - creates evenly-spaced points
function resamplePath(points: Point[], sampleDistance: number): Point[] {
  if (points.length < 2) return points
  
  // Calculate cumulative arc length
  const lengths = [0]
  let totalLength = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i-1].x
    const dy = points[i].y - points[i-1].y
    const segmentLength = Math.sqrt(dx * dx + dy * dy)
    totalLength += segmentLength
    lengths.push(totalLength)
  }
  
  if (totalLength === 0) return points
  
  // Generate evenly-spaced samples
  const samples: Point[] = [points[0]]
  let currentLength = sampleDistance
  
  while (currentLength < totalLength) {
    // Find segment containing this arc length
    let segmentIndex = 0
    for (let i = 0; i < lengths.length - 1; i++) {
      if (currentLength >= lengths[i] && currentLength <= lengths[i + 1]) {
        segmentIndex = i
        break
      }
    }
    
    // Interpolate within segment
    const p0 = points[segmentIndex]
    const p1 = points[segmentIndex + 1]
    const segmentStart = lengths[segmentIndex]
    const segmentEnd = lengths[segmentIndex + 1]
    const segmentLength = segmentEnd - segmentStart
    
    if (segmentLength > 0) {
      const t = (currentLength - segmentStart) / segmentLength
      samples.push({
        x: p0.x + (p1.x - p0.x) * t,
        y: p0.y + (p1.y - p0.y) * t
      })
    }
    
    currentLength += sampleDistance
  }
  
  samples.push(points[points.length - 1])
  return samples
}

// Calculate angle between three points (returns degrees)
function calculateAngle(p0: Point, p1: Point, p2: Point): number {
  const v1 = { x: p1.x - p0.x, y: p1.y - p0.y }
  const v2 = { x: p2.x - p1.x, y: p2.y - p1.y }
  
  const dot = v1.x * v2.x + v1.y * v2.y
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y)
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y)
  
  if (mag1 === 0 || mag2 === 0) return 180
  
  const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)))
  return Math.acos(cosAngle) * (180 / Math.PI)
}

// Fit bezier curves through simplified points
function fitBezierCurves(points: Point[], smoothness: number, tension: number): string {
  if (points.length < 2) return ''
  
  let path = `M ${points[0].x} ${points[0].y}`
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    
    // Get neighboring points for tangent calculation
    const pPrev = i > 0 ? points[i - 1] : p0
    const pNext = i < points.length - 2 ? points[i + 2] : p1
    
    // Calculate tangent directions
    const t0x = (p1.x - pPrev.x) * smoothness
    const t0y = (p1.y - pPrev.y) * smoothness
    const t1x = (pNext.x - p0.x) * smoothness
    const t1y = (pNext.y - p0.y) * smoothness
    
    // Control points based on tension
    const cp1x = p0.x + t0x * tension * 0.33
    const cp1y = p0.y + t0y * tension * 0.33
    const cp2x = p1.x - t1x * tension * 0.33
    const cp2y = p1.y - t1y * tension * 0.33
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`
  }
  
  return path
}

// Hybrid smoothing with corner detection
function hybridSmoothing(
  points: Point[],
  smoothness: number,
  tension: number,
  cornerThreshold: number,
  cornerSharpness: number
): string {
  if (points.length < 2) return ''
  
  // Calculate angles at each interior point
  const angles: number[] = []
  for (let i = 1; i < points.length - 1; i++) {
    angles.push(calculateAngle(points[i-1], points[i], points[i+1]))
  }
  
  // Classify corners
  const isCorner: boolean[] = angles.map(a => a < cornerThreshold)
  
  // Build path with adaptive control points
  let path = `M ${points[0].x} ${points[0].y}`
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    
    // Check if near a corner
    const nearCorner = (i > 0 && isCorner[i - 1]) || (i < points.length - 2 && isCorner[i])
    
    // Calculate tangents
    const pPrev = i > 0 ? points[i - 1] : p0
    const pNext = i < points.length - 2 ? points[i + 2] : p1
    
    const t0x = (p1.x - pPrev.x) * smoothness
    const t0y = (p1.y - pPrev.y) * smoothness
    const t1x = (pNext.x - p0.x) * smoothness
    const t1y = (pNext.y - p0.y) * smoothness
    
    // Adjust tension for corners
    let effectiveTension = tension
    if (nearCorner) {
      effectiveTension *= (1 - cornerSharpness * 0.7)
    }
    
    const cp1x = p0.x + t0x * effectiveTension * 0.33
    const cp1y = p0.y + t0y * effectiveTension * 0.33
    const cp2x = p1.x - t1x * effectiveTension * 0.33
    const cp2y = p1.y - t1y * effectiveTension * 0.33
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`
  }
  
  return path
}

export default function StoryFragment({ images }: StoryFragmentProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  
  // Frame reference for coordinate transforms
  const frameRef = useRef<HTMLDivElement>(null)
  
  // Path drawing state
  const [pathMode, setPathMode] = useState<PathMode>('idle')
  const [currentPath, setCurrentPath] = useState<Point[]>([])  // Now stores normalized coords (0-1)
  const [pathControls, setPathControls] = useState<PathControls>({
    // Stage 1 - Back to pixel-based tolerance
    simplifyTolerance: 9,
    // Stage 2
    enableResampling: true,
    sampleDistance: 50,
    // Stage 3
    smoothness: 2.3,
    tension: 0.3,
    cornerThreshold: 180,
    cornerSharpness: 0.35,
    // Stage 4
    smoothPasses: 13,
    // Visualization
    showDots: false,
    showSimplified: false,
    showResampled: false,
    showPath: true
  })

  // Path styling (using PLAYNE brand colors)
  const [pathStyle, setPathStyle] = useState({
    color: '#231f20', // brand-black
    width: 4
  })

  // Calculate smooth path from current points (multi-stage pipeline with multi-pass)
  const { simplifiedPath, resampledPath, smoothPath } = useMemo(() => {
    if (currentPath.length < 2 || !frameRef.current) {
      return { simplifiedPath: null, resampledPath: null, smoothPath: null }
    }
    
    // Get frame bounds to convert normalized coords to pixels for smoothing
    const bounds = getFrameBounds(frameRef.current)
    
    // Convert normalized (0-1) to pixel coordinates for smoothing algorithms
    const pixelPath = currentPath.map(p => ({
      x: p.x * bounds.width,
      y: p.y * bounds.height
    }))
    
    // Stage 1: Simplify (in pixel space)
    const simplified = simplifyPath(pixelPath, pathControls.simplifyTolerance)
    console.log('Simplified:', pixelPath.length, '→', simplified.length, 'points')
    
    // Stage 2: Resample (in pixel space, optional)
    let processed = pathControls.enableResampling
      ? resamplePath(simplified, pathControls.sampleDistance)
      : simplified
    
    // Stage 3: Multi-pass smoothing (in pixel space)
    let smooth = ''
    for (let pass = 0; pass < pathControls.smoothPasses; pass++) {
      smooth = hybridSmoothing(
        processed,
        pathControls.smoothness,
        pathControls.tension,
        pathControls.cornerThreshold,
        pathControls.cornerSharpness
      )
      
      if (pass < pathControls.smoothPasses - 1) {
        processed = resamplePath(processed, pathControls.sampleDistance)
      }
    }
    
    // Convert pixel-based SVG path to normalized (0-1) coordinates
    // Parse the path and convert all numbers
    const normalizedPath = smooth.replace(/(\d+\.?\d*)/g, (match) => {
      const pixelValue = parseFloat(match)
      // Alternate between x and y - this is a simplification
      // For proper implementation we'd parse the path commands
      const normalizedValue = pixelValue / bounds.width  // Approximate
      return normalizedValue.toString()
    })
    
    console.log('Smoothed path ready')
    
    return {
      simplifiedPath: simplified,
      resampledPath: processed,
      smoothPath: normalizedPath
    }
  }, [currentPath, pathControls])
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle PATH button click
  const handlePathButtonClick = useCallback(() => {
    console.log('NEW PATH - Ready to draw')
    setPathMode('ready')
    setCurrentPath([])
  }, [])

  // Image control handlers
  const handleRandomImage = useCallback(() => {
    if (images.length === 0) return
    const randomIndex = Math.floor(Math.random() * images.length)
    setCurrentIndex(randomIndex)
    setCurrentPath([])
    setPathMode('idle')
  }, [images.length])

  const handleNextImage = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev === null) return 0
      return (prev + 1) % images.length
    })
    setCurrentPath([])
    setPathMode('idle')
  }, [images.length])

  const handlePrevImage = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev === null) return 0
      return (prev - 1 + images.length) % images.length
    })
    setCurrentPath([])
    setPathMode('idle')
  }, [images.length])

  // Handle keyboard navigation
  useEffect(() => {
    if (!mounted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextImage()
      }
      
      if (e.key === 'ArrowLeft') {
        handlePrevImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mounted, handleNextImage, handlePrevImage])

  // Get current image URL
  const currentImageUrl = currentIndex !== null && images[currentIndex]
    ? urlFor(images[currentIndex].imageAsset)
        .width(1600)  // Request high quality, aspect ratio will be preserved
        .fit('max')   // Don't crop, just constrain max dimension
        .quality(90)
        .url()
    : null

  const currentImage = currentIndex !== null ? images[currentIndex] : null

  // Mouse handlers for path drawing (using normalized coordinates)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (pathMode === 'ready' && frameRef.current) {
      const bounds = getFrameBounds(frameRef.current)
      const normalizedPoint = viewportToNormalized(e.clientX, e.clientY, bounds)
      
      console.log('START PATH:', normalizedPoint)
      
      setPathMode('drawing')
      setCurrentPath([normalizedPoint])
    }
  }, [pathMode])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (pathMode === 'drawing' && frameRef.current) {
      const bounds = getFrameBounds(frameRef.current)
      const normalizedPoint = viewportToNormalized(e.clientX, e.clientY, bounds)
      
      setCurrentPath(prev => {
        const newPath = [...prev, normalizedPoint]
        if (newPath.length % 10 === 0) {
          console.log('Points captured:', newPath.length)
        }
        return newPath
      })
    }
  }, [pathMode])

  const handleMouseUp = useCallback(() => {
    if (pathMode === 'drawing') {
      console.log('PATH COMPLETE - Total points:', currentPath.length)
      setPathMode('idle')
    }
  }, [pathMode, currentPath.length])

  const handleMouseLeave = useCallback(() => {
    if (pathMode === 'drawing') {
      console.log('PATH COMPLETE (mouse left) - Total points:', currentPath.length)
      setPathMode('idle')
    }
  }, [pathMode, currentPath.length])

  // Add global mouseup and mouseleave listeners for path drawing
  useEffect(() => {
    if (pathMode !== 'drawing') return

    const handleGlobalMouseUp = () => {
      setPathMode('idle')
    }

    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [pathMode])

  // Determine container class based on mode
  const containerClass = pathMode === 'idle' 
    ? styles.container 
    : `${styles.container} ${styles.containerDrawMode}`

  return (
    <>
      {/* Full viewport workspace - handles all mouse events */}
      <div 
        className={styles.workspace}
        data-drawing={pathMode !== 'idle'}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Responsive square frame */}
        <div 
          ref={frameRef}
          className={styles.frame}
        >
          {/* Frame content - image */}
          <div className={styles.frameContent}>
            {mounted && currentImageUrl && currentImage && (
              <img
                src={currentImageUrl}
                alt={currentImage.altText || 'Gallery image'}
                className={styles.image}
              />
            )}
          </div>
        </div>

        {/* Dimming overlays - 4 divs covering areas outside frame */}
        {frameRef.current && (() => {
          const bounds = getFrameBounds(frameRef.current)
          
          return (
            <>
              {/* Top overlay */}
              <div className={styles.dimOverlay} style={{
                top: 0,
                left: 0,
                right: 0,
                height: bounds.top
              }} />
              
              {/* Bottom overlay */}
              <div className={styles.dimOverlay} style={{
                top: bounds.top + bounds.height,
                left: 0,
                right: 0,
                bottom: 0
              }} />
              
              {/* Left overlay */}
              <div className={styles.dimOverlay} style={{
                top: bounds.top,
                left: 0,
                width: bounds.left,
                height: bounds.height
              }} />
              
              {/* Right overlay */}
              <div className={styles.dimOverlay} style={{
                top: bounds.top,
                left: bounds.left + bounds.width,
                right: 0,
                height: bounds.height
              }} />
            </>
          )
        })()}

        {/* SVG path rendering - positioned relative to workspace for full bleed */}
        {smoothPath && frameRef.current && (() => {
          const bounds = getFrameBounds(frameRef.current)
          const strokeWidth = pathStyle.width / bounds.width
          
          return (
            <svg 
              className={styles.pathSvgFullBleed}
              style={{
                left: bounds.left,
                top: bounds.top,
                width: bounds.width,
                height: bounds.height
              }}
              viewBox="0 0 1 1" 
              preserveAspectRatio="none"
            >
              <path
                d={smoothPath}
                stroke={pathStyle.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="butt"
                strokeLinejoin="miter"
              />
            </svg>
          )
        })()}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        {/* Image controls */}
        <div className={styles.toolbarSection}>
          <span className={styles.toolbarLabel}>IMAGE:</span>
          <button className={styles.toolbarButton} onClick={handleRandomImage} disabled={pathMode !== 'idle'}>
            RANDOM
          </button>
          <button className={styles.toolbarButton} onClick={handlePrevImage} disabled={pathMode !== 'idle'}>
            PREV
          </button>
          <button className={styles.toolbarButton} onClick={handleNextImage} disabled={pathMode !== 'idle'}>
            NEXT
          </button>
        </div>
        
        <div className={styles.toolbarDivider}></div>
        
        {/* Path controls */}
        <div className={styles.toolbarSection}>
          <span className={styles.toolbarLabel}>PATH:</span>
          <button className={styles.toolbarButton} onClick={handlePathButtonClick} disabled={pathMode !== 'idle'}>
            NEW
          </button>
        </div>
        
        {/* Path styling - only show if path exists */}
        {currentPath.length > 0 && (
          <>
            <div className={styles.toolbarDivider}></div>
            
            <div className={styles.toolbarSection}>
              <span className={styles.toolbarLabel}>COLOR:</span>
              <div className={styles.colorSwatches}>
                <button
                  className={styles.colorSwatch}
                  style={{ backgroundColor: '#231f20' }}
                  onClick={() => setPathStyle(prev => ({ ...prev, color: '#231f20' }))}
                  data-active={pathStyle.color === '#231f20'}
                  title="Black"
                />
                <button
                  className={styles.colorSwatch}
                  style={{ backgroundColor: '#EAEADA' }}
                  onClick={() => setPathStyle(prev => ({ ...prev, color: '#EAEADA' }))}
                  data-active={pathStyle.color === '#EAEADA'}
                  title="Offwhite"
                />
                <button
                  className={styles.colorSwatch}
                  style={{ backgroundColor: '#FC555B' }}
                  onClick={() => setPathStyle(prev => ({ ...prev, color: '#FC555B' }))}
                  data-active={pathStyle.color === '#FC555B'}
                  title="Red"
                />
                <button
                  className={styles.colorSwatch}
                  style={{ backgroundColor: '#FCDC4A' }}
                  onClick={() => setPathStyle(prev => ({ ...prev, color: '#FCDC4A' }))}
                  data-active={pathStyle.color === '#FCDC4A'}
                  title="Yellow"
                />
                <button
                  className={styles.colorSwatch}
                  style={{ backgroundColor: '#FB6DCB' }}
                  onClick={() => setPathStyle(prev => ({ ...prev, color: '#FB6DCB' }))}
                  data-active={pathStyle.color === '#FB6DCB'}
                  title="Pink"
                />
                <button
                  className={styles.colorSwatch}
                  style={{ backgroundColor: '#A9ECD4' }}
                  onClick={() => setPathStyle(prev => ({ ...prev, color: '#A9ECD4' }))}
                  data-active={pathStyle.color === '#A9ECD4'}
                  title="Blue"
                />
              </div>
            </div>
            
            <div className={styles.toolbarDivider}></div>
            
            <div className={styles.toolbarSection}>
              <span className={styles.toolbarLabel}>WIDTH:</span>
              <input
                type="range"
                min="1"
                max="100"
                step="0.5"
                value={pathStyle.width}
                onChange={(e) => setPathStyle(prev => ({ ...prev, width: parseFloat(e.target.value) }))}
                className={styles.slider}
              />
              <span className={styles.sliderValue}>{pathStyle.width.toFixed(1)}px</span>
            </div>
          </>
        )}
      </div>
    </>
  )
}

