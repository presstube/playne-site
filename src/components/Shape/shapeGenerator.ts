// Shape generation algorithms ported from brand-spike/spike-1

export interface Point {
  x: number
  y: number
}

export type RandomFn = () => number

// Seeded PRNG (Mulberry32) for reproducible randomness
export function createSeededRandom(seed: number): RandomFn {
  let state = seed
  return () => {
    state += 0x6d2b79f5
    state = Math.imul(state ^ (state >>> 15), state | 1)
    state ^= state + Math.imul(state ^ (state >>> 7), state | 61)
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296
  }
}

// Add random jitter to a value
function jitter(rand: RandomFn, amount: number): number {
  return (rand() * 2 - 1) * amount
}

// Convert closed Catmull-Rom spline through points to SVG path string
function catmullRomClosedToPath(points: Point[], tension: number = 0.5): string {
  const n = points.length
  if (n < 3) return ''
  
  const path: string[] = []
  const p = (i: number) => points[(i + n) % n]
  
  path.push(`M ${p(0).x} ${p(0).y}`)
  
  for (let i = 0; i < n; i += 1) {
    const p0 = p(i - 1)
    const p1 = p(i)
    const p2 = p(i + 1)
    const p3 = p(i + 2)
    
    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension * 2
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension * 2
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension * 2
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension * 2
    
    path.push(`C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`)
  }
  
  path.push('Z')
  return path.join(' ')
}

interface LobeParams {
  rand: RandomFn
  center: Point
  lobes: number
  rOuter: number
  rInner: number
  jitterOuter?: number
  jitterInner?: number
  sharpen: 'inner' | 'outer'
}

// Build points for a lobed shape (blob or spike)
function buildLobedPoints({
  rand,
  center,
  lobes,
  rOuter,
  rInner,
  jitterOuter = 0.08,
  jitterInner = 0.06,
  sharpen = 'inner'
}: LobeParams): Point[] {
  const pts: Point[] = []
  const total = lobes * 2
  const phase = rand() * Math.PI * 2
  
  for (let i = 0; i < total; i += 1) {
    const isOuter = i % 2 === 0
    const angle = phase + (i / total) * Math.PI * 2
    const baseR = isOuter ? rOuter : rInner
    const r = baseR * (1 + jitter(rand, isOuter ? jitterOuter : jitterInner))
    const pt: Point = {
      x: center.x + Math.cos(angle) * r,
      y: center.y + Math.sin(angle) * r
    }
    pts.push(pt)
    
    // Duplicate points to keep them sharper after smoothing
    if ((sharpen === 'inner' && !isOuter) || (sharpen === 'outer' && isOuter)) {
      pts.push(pt)
    }
  }
  
  return pts
}

// Generate blob path (rounded arms, cuspy valleys)
function generateBlobPath(rand: RandomFn, width: number, height: number): string {
  const center: Point = { x: width / 2, y: height / 2 }
  const lobes = 5 + Math.floor(rand() * 4) // 5-8 arms
  const rOuter = Math.min(width, height) * (0.42 + rand() * 0.05)
  const rInner = rOuter * (0.45 + rand() * 0.1)
  const points = buildLobedPoints({
    rand,
    center,
    lobes,
    rOuter,
    rInner,
    jitterOuter: 0.06,
    jitterInner: 0.04,
    sharpen: 'inner'
  })
  // Higher roundness to keep outer arms puffy
  return catmullRomClosedToPath(points, 0.95)
}

// Generate spike path (pointy tips, rounded valleys)
function generateSpikePath(rand: RandomFn, width: number, height: number): string {
  const center: Point = { x: width / 2, y: height / 2 }
  const lobes = 5 + Math.floor(rand() * 4) // 5-8 spikes
  const rOuter = Math.min(width, height) * (0.45 + rand() * 0.06)
  const rInner = rOuter * (0.30 + rand() * 0.08)
  const points = buildLobedPoints({
    rand,
    center,
    lobes,
    rOuter,
    rInner,
    jitterOuter: 0.12,
    jitterInner: 0.06,
    sharpen: 'outer'
  })
  // Slightly lower roundness to keep outer tips pointier
  return catmullRomClosedToPath(points, 0.7)
}

export interface ShapeConfig {
  width: number
  height: number
  shapeType: 'blob' | 'spike'
  seed: number
  lobes?: number
  rotation?: number
}

export interface ShapeResult {
  pathData: string
  width: number
  height: number
  rotation: number
  shapeType: 'blob' | 'spike'
}

// Main shape generation orchestrator
export function generateShape(config: ShapeConfig): ShapeResult {
  const { width, height, shapeType, seed, rotation } = config
  
  const rand = createSeededRandom(seed)
  
  const pathData = shapeType === 'blob'
    ? generateBlobPath(rand, width, height)
    : generateSpikePath(rand, width, height)
  
  const finalRotation = rotation !== undefined ? rotation : Math.floor(rand() * 360)
  
  return {
    pathData,
    width,
    height,
    rotation: finalRotation,
    shapeType
  }
}

