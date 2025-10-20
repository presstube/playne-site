// Geometry and curve utilities for smooth path generation

export interface Point { x: number; y: number }

// Simple seeded PRNG (Mulberry32)
export function createRng(seed: number) {
  let t = seed >>> 0
  return function rand() {
    t += 0x6D2B79F5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function hashSeed(input: string | number | undefined): number {
  if (typeof input === 'number') return input
  const s = String(input ?? 'path')
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Smoothstep easing (clamped)
export function smoothstep(x: number): number {
  const t = Math.min(1, Math.max(0, x))
  return t * t * (3 - 2 * t)
}

// Band-limited 1D noise using a small sum of low-frequency sines (deterministic)
export function lowFreqNoise(t: number, rng: () => number, octaves = 1): number {
  let value = 0
  let amp = 1
  let totalAmp = 0
  for (let i = 0; i < octaves; i++) {
    const freq = 1 + i * 0.5 // very low frequency
    const phase = rng() * Math.PI * 2
    value += Math.sin(t * Math.PI * 2 * freq + phase) * amp
    totalAmp += amp
    amp *= 0.5
  }
  return value / (totalAmp || 1)
}

// Centripetal Catmull–Rom (alpha=0.5) to Cubic Bezier conversion
// Returns array of tuples: [cp1, cp2, p2]
export function catmullRomToBeziers(points: Point[], alpha = 0.5, clampRatio = 0.35): Array<[Point, Point, Point]> {
  if (points.length < 2) return []
  const result: Array<[Point, Point, Point]> = []
  const pts = points

  const tj = (pi: Point, pj: Point, tPrev: number) => {
    const dx = pj.x - pi.x
    const dy = pj.y - pi.y
    const d = Math.sqrt(dx * dx + dy * dy)
    return tPrev + Math.pow(d, alpha)
  }

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = i === 0 ? pts[i] : pts[i - 1]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = i + 2 < pts.length ? pts[i + 2] : pts[i + 1]

    // Parameterization
    const t0 = 0
    const t1 = tj(p0, p1, t0)
    const t2 = tj(p1, p2, t1)
    const t3 = tj(p2, p3, t2)

    // Tangents (centripetal, chord-length): m1 = (p2 - p0)/(t2 - t0), m2 = (p3 - p1)/(t3 - t1)
    const m1x = (p2.x - p0.x) / (t2 - t0)
    const m1y = (p2.y - p0.y) / (t2 - t0)
    const m2x = (p3.x - p1.x) / (t3 - t1)
    const m2y = (p3.y - p1.y) / (t3 - t1)

    // Convert to cubic Bezier control points
    const dt1 = t2 - t1
    let cp1: Point = { x: p1.x + (m1x * dt1) / 3, y: p1.y + (m1y * dt1) / 3 }
    let cp2: Point = { x: p2.x - (m2x * dt1) / 3, y: p2.y - (m2y * dt1) / 3 }

    // Clamp handle lengths to avoid kinks/overshoot
    const clampHandles = (pA: Point, cp: Point, pB: Point, maxRatio: number) => {
      const segLen = Math.hypot(pB.x - pA.x, pB.y - pA.y)
      const maxLen = segLen * maxRatio
      const vx = cp.x - pA.x
      const vy = cp.y - pA.y
      const len = Math.hypot(vx, vy)
      if (len > maxLen && len > 0) {
        const scale = maxLen / len
        return { x: pA.x + vx * scale, y: pA.y + vy * scale }
      }
      return cp
    }

    // Softly bias handles to be more tangential (smoother) by blending toward the straight direction
    const blend = 0.2 // higher = rounder
    const blendPoint = (a: Point, b: Point, t: number): Point => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
    const p1Dir: Point = { x: p1.x + (p2.x - p0.x) * 0.25, y: p1.y + (p2.y - p0.y) * 0.25 }
    const p2Dir: Point = { x: p2.x - (p3.x - p1.x) * 0.25, y: p2.y - (p3.y - p1.y) * 0.25 }
    cp1 = blendPoint(cp1, p1Dir, blend)
    cp2 = blendPoint(cp2, p2Dir, blend)

    cp1 = clampHandles(p1, cp1, p2, clampRatio)
    cp2 = clampHandles(p2, cp2, p1, clampRatio)
    result.push([cp1, cp2, p2])
  }
  return result
}

export function buildPathFromCubics(start: Point, cubics: Array<[Point, Point, Point]>): string {
  let d = `M ${start.x} ${start.y}`
  for (const [cp1, cp2, p] of cubics) {
    d += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p.x} ${p.y}`
  }
  return d
}


