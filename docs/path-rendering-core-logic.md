# Path Drawing & Smoothing System

## Overview

This document explains the core path rendering logic extracted from the story-fragment implementation. The system takes raw mouse-drawn paths and applies a multi-stage processing pipeline to create smooth, aesthetically pleasing curves.

## Coordinate System

All points use a **center-origin coordinate system**:
- Origin `(0, 0)` is at the screen center
- Positive X = right, Positive Y = down
- Points are stored as pixel offsets from center

```typescript
type Point = { x: number; y: number }  // Pixels from center (0,0)

function viewportToCanvas(clientX: number, clientY: number): Point {
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  
  return {
    x: clientX - centerX,
    y: clientY - centerY
  }
}
```

## Multi-Stage Processing Pipeline

### Stage 1: Simplification (Ramer-Douglas-Peucker)

**Purpose:** Reduce the number of points while preserving the overall shape.

Raw mouse input creates hundreds of closely-spaced points. The RDP algorithm intelligently removes redundant points that don't significantly affect the path's shape.

```typescript
function simplifyPath(points: Point[], tolerance: number): Point[] {
  if (points.length <= 2) return points
  
  const sqTolerance = tolerance * tolerance
  
  // Calculate perpendicular distance from point to line segment
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
  
  // Recursive subdivision
  function simplifyDPStep(
    points: Point[], 
    first: number, 
    last: number, 
    sqTolerance: number, 
    simplified: Point[]
  ): void {
    let maxSqDist = sqTolerance
    let index = 0
    
    // Find point with maximum distance from line
    for (let i = first + 1; i < last; i++) {
      const sqDist = getSquareSegmentDistance(points[i], points[first], points[last])
      
      if (sqDist > maxSqDist) {
        index = i
        maxSqDist = sqDist
      }
    }
    
    // If point is far enough, subdivide
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
```

**Control:** `tolerance` (0-30)
- Low = preserve more detail
- High = aggressive simplification

### Stage 2: Resampling (Arc-Length Parameterization)

**Purpose:** Create evenly-spaced points along the path for consistent smoothing.

After simplification, points may be unevenly distributed. Resampling ensures uniform spacing based on arc length.

```typescript
function resamplePath(points: Point[], sampleDistance: number): Point[] {
  if (points.length < 2) return points
  
  // Calculate cumulative arc length at each point
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
  
  // Generate evenly-spaced samples along the arc
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
```

**Controls:**
- `enableResampling` (boolean)
- `sampleDistance` (5-50px) - spacing between resampled points

### Stage 3: Corner Detection

**Purpose:** Identify sharp corners to apply different smoothing strategies.

Calculate angles at each interior point to detect corners:

```typescript
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
```

**Control:** `cornerThreshold` (0-180 degrees)
- Angles below threshold are classified as corners
- 180° = no corner detection (smooth everything)

### Stage 4: Bezier Curve Fitting with Adaptive Tension

**Purpose:** Convert simplified points into smooth Bezier curves with corner-aware control.

This is the heart of the smoothing system. It uses cubic Bezier curves with control points calculated from tangent vectors:

```typescript
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
  
  // Build SVG path with adaptive control points
  let path = `M ${points[0].x} ${points[0].y}`
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    
    // Check if near a corner
    const nearCorner = (i > 0 && isCorner[i - 1]) || (i < points.length - 2 && isCorner[i])
    
    // Calculate tangents from neighboring points
    const pPrev = i > 0 ? points[i - 1] : p0
    const pNext = i < points.length - 2 ? points[i + 2] : p1
    
    const t0x = (p1.x - pPrev.x) * smoothness
    const t0y = (p1.y - pPrev.y) * smoothness
    const t1x = (pNext.x - p0.x) * smoothness
    const t1y = (pNext.y - p0.y) * smoothness
    
    // Reduce tension at corners for sharper turns
    let effectiveTension = tension
    if (nearCorner) {
      effectiveTension *= (1 - cornerSharpness * 0.7)
    }
    
    // Calculate Bezier control points
    const cp1x = p0.x + t0x * effectiveTension * 0.33
    const cp1y = p0.y + t0y * effectiveTension * 0.33
    const cp2x = p1.x - t1x * effectiveTension * 0.33
    const cp2y = p1.y - t1y * effectiveTension * 0.33
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`
  }
  
  return path
}
```

**Controls:**
- `smoothness` (0-3) - scale of tangent vectors
- `tension` (0-2) - how far control points extend
- `cornerSharpness` (0-1) - how much to reduce tension at corners

### Stage 5: Multi-Pass Smoothing (Optional)

**Purpose:** Apply smoothing multiple times for ultra-smooth results.

For maximum smoothness, the entire pipeline can be run multiple times:

```typescript
function applyMultiPassSmoothing(
  rawPoints: Point[], 
  controls: PathControls,
  passes: number
): string {
  let points = rawPoints
  
  for (let pass = 0; pass < passes; pass++) {
    // Stage 1: Simplify
    points = simplifyPath(points, controls.simplifyTolerance)
    
    // Stage 2: Resample (optional)
    if (controls.enableResampling) {
      points = resamplePath(points, controls.sampleDistance)
    }
  }
  
  // Stage 3-4: Final smoothing with corner detection
  return hybridSmoothing(
    points,
    controls.smoothness,
    controls.tension,
    controls.cornerThreshold,
    controls.cornerSharpness
  )
}
```

**Control:** `smoothPasses` (1-20)

## Rendering to SVG

The final path string is rendered as an SVG path element:

```typescript
<svg
  style={{
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none'
  }}
  viewBox={`${-viewportSize.width/2} ${-viewportSize.height/2} ${viewportSize.width} ${viewportSize.height}`}
>
  <path
    d={smoothedPathString}
    fill="none"
    stroke="#000000"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
```

## Default Parameters (Tested & Tuned)

```typescript
const DEFAULT_CONTROLS = {
  simplifyTolerance: 9,
  enableResampling: true,
  sampleDistance: 50,
  smoothness: 2.3,
  tension: 0.3,
  cornerThreshold: 180,  // No corner detection by default
  cornerSharpness: 0.35,
  smoothPasses: 1
}
```

## Key Insights

1. **Order Matters:** RDP simplification must come before resampling
2. **Arc-Length Resampling:** Ensures consistent spacing for smooth curves
3. **Corner Detection:** Preserves intentional sharp turns
4. **Tangent Vectors:** Using neighboring points creates natural-looking curves
5. **Adaptive Tension:** Reduces "overshoot" at corners
6. **Multi-Pass:** Each pass progressively smooths the result

## Performance Considerations

- RDP is O(n log n) on average, O(n²) worst case
- Resampling is O(n²) due to segment search (could optimize with binary search)
- Bezier fitting is O(n)
- Overall pipeline is suitable for paths with 100-500 points
- For longer paths, increase `simplifyTolerance` to reduce point count

## References

- **Ramer-Douglas-Peucker Algorithm:** [Wikipedia](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm)
- **Cubic Bezier Curves:** [Primer on Bezier Curves](https://pomax.github.io/bezierinfo/)
- **Arc-Length Parameterization:** Used for uniform sampling in computer graphics

