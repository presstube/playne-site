# Story Fragment - Path Smoothing Analysis: Multi-Stage Approach

**Goal:** Design a robust, professional-grade path smoothing system for hand-drawn input

---

## The Problem with Current Approach

### What We Have Now
```
Raw Points → RDP Simplification → Simple Bezier Fitting → Result
  (1000)         (30-50 points)      (tangent-based)
```

### Limitations
1. **Uneven spacing** - Simplified points cluster where you drew slowly
2. **Simple tangent calculation** - Doesn't account for curvature
3. **No speed variation handling** - Fast vs slow strokes treated equally
4. **Single smoothing pass** - Can't layer different effects

---

## Proposed Multi-Stage Pipeline

### Stage 1: Point Reduction (Geometric)
**Algorithm:** Ramer-Douglas-Peucker (keep this - it's good)
**Purpose:** Remove redundant points, preserve shape
**Input:** 1000 raw points
**Output:** 30-50 key points

**Controls:**
- `Simplify Tolerance` (0-10) - How aggressive to reduce

---

### Stage 2: Resampling (Even Spacing)
**Algorithm:** Arc-length parameterization
**Purpose:** Create evenly-spaced points along the simplified path

**Why this matters:**
- Hand-drawn paths have uneven point density (cluster where you pause)
- Even spacing = better interpolation in next stages
- Makes smoothing more predictable and uniform

**Process:**
1. Calculate total path length from simplified points
2. Decide sample count (or sample distance)
3. Walk along path, interpolating points at regular intervals

**Controls:**
- `Sample Distance` (5-50px) - Spacing between resampled points
  - OR `Sample Count` (10-100) - Total number of points to generate

**Input:** 30-50 simplified points (unevenly spaced)
**Output:** 20-60 resampled points (evenly spaced)

**Example:**
```
Before: •  •••     •        ••  •
After:  •   •   •   •   •   •   •
        (evenly spaced along same path)
```

---

### Stage 3: Smoothing (Curve Fitting)
**Algorithm:** Cubic Bezier with Intelligent Control Point Placement

#### Option A: Cardinal/Catmull-Rom (What Path component uses)
**Pros:**
- Guaranteed to pass through all points
- Well-tested math
- Predictable results

**Cons:**
- Can overshoot on sharp turns
- Limited control over "flow"

#### Option B: Hobby's Algorithm (MetaPost/TikZ style)
**Pros:**
- Optimal smooth curves through points
- Minimizes "tension energy"
- Beautiful, natural-looking results
- Used in professional typography

**Cons:**
- More complex math
- Global solution (changing one point affects whole path)

#### Option C: Hybrid Approach (Recommended)
**Process:**
1. Calculate curvature at each point
2. Classify segments (straight, gentle curve, sharp turn)
3. Apply different control point strategies per segment type:
   - **Straight sections**: Minimal curve influence
   - **Gentle curves**: Maximum smoothing
   - **Sharp corners**: Preserve angle, short control arms

**Controls:**
- `Smoothness` (0-1) - Overall curve vs straight
- `Tension` (0-1) - How tight curves are
- `Corner Threshold` (0-180°) - Angle below which to preserve sharpness
- `Corner Sharpness` (0-1) - How much to preserve detected corners

---

### Stage 4: Post-Smoothing (Optional)
**Algorithm:** Gaussian smoothing on control points

**Purpose:** Further soften the result without changing key points

**Process:**
1. Take the bezier control points from Stage 3
2. Apply lightweight averaging/blurring
3. Rebuild curves with smoothed controls

**Controls:**
- `Post-Smooth Amount` (0-1) - Additional softening pass

---

## Complete Control Panel Design

### Basic Mode (Simple - Current)
```
PATH: [NEW]

SIMPLIFY:  [slider 0-10]  = 3.0
SMOOTH:    [slider 0-1]   = 0.70
TENSION:   [slider 0-1]   = 0.60

[✓] Dots    [✓] Path
```

### Advanced Mode (All Stages Exposed)
```
PATH: [NEW]  [v Advanced]

━━━ STAGE 1: REDUCTION ━━━
Simplify:    [slider 0-10]  = 3.0

━━━ STAGE 2: RESAMPLING ━━━
[ ] Enable Resampling
Sample Dist: [slider 5-50]  = 15px
  (or: Sample Count: [slider 10-100] = 30)

━━━ STAGE 3: SMOOTHING ━━━
Algorithm:   [Cardinal ▼]  (Cardinal | Hobby | Hybrid)
Smoothness:  [slider 0-1]   = 0.70
Tension:     [slider 0-1]   = 0.60

[Advanced: Hybrid Algorithm]
Corner Detect: [slider 0-180°] = 45°
Corner Sharp:  [slider 0-1]     = 0.80

━━━ STAGE 4: POST-SMOOTH ━━━
[ ] Enable Post-Smooth
Amount:      [slider 0-1]   = 0.20

━━━━━━━━━━━━━━━━━━━━━━━━━━
[✓] Show Dots    [✓] Show Path
```

---

## Detailed Algorithm: Resampling

### Arc-Length Parameterization

**Goal:** Given simplified points, create evenly-spaced samples

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
  
  // Generate evenly-spaced samples
  const samples: Point[] = [points[0]] // Always include first point
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
    const t = (currentLength - segmentStart) / (segmentEnd - segmentStart)
    
    const interpolated = {
      x: p0.x + (p1.x - p0.x) * t,
      y: p0.y + (p1.y - p0.y) * t
    }
    
    samples.push(interpolated)
    currentLength += sampleDistance
  }
  
  samples.push(points[points.length - 1]) // Always include last point
  
  return samples
}
```

**Why this helps:**
- Consistent spacing → consistent smoothing behavior
- No clustering artifacts
- Better curvature calculation (needs even spacing)

---

## Detailed Algorithm: Hybrid Smoothing

### Intelligent Control Point Placement

```typescript
function hybridSmoothing(
  points: Point[], 
  smoothness: number,
  tension: number,
  cornerThreshold: number,  // degrees
  cornerSharpness: number
): string {
  if (points.length < 2) return ''
  
  // Step 1: Calculate angles at each point
  const angles: number[] = []
  for (let i = 1; i < points.length - 1; i++) {
    const v1 = { 
      x: points[i].x - points[i-1].x, 
      y: points[i].y - points[i-1].y 
    }
    const v2 = { 
      x: points[i+1].x - points[i].x, 
      y: points[i+1].y - points[i].y 
    }
    
    // Calculate angle between vectors
    const dot = v1.x * v2.x + v1.y * v2.y
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y)
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y)
    const angle = Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI)
    
    angles.push(angle)
  }
  
  // Step 2: Classify segments
  const isCorner: boolean[] = angles.map(a => a < cornerThreshold)
  
  // Step 3: Build bezier path with adaptive control points
  let path = `M ${points[0].x} ${points[0].y}`
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    
    // Determine if this is a corner segment
    const isCornerSegment = (i > 0 && isCorner[i - 1]) || 
                            (i < points.length - 2 && isCorner[i])
    
    // Calculate base tangents
    const pPrev = i > 0 ? points[i - 1] : p0
    const pNext = i < points.length - 2 ? points[i + 2] : p1
    
    const t0x = (p1.x - pPrev.x) * smoothness
    const t0y = (p1.y - pPrev.y) * smoothness
    const t1x = (pNext.x - p0.x) * smoothness
    const t1y = (pNext.y - p0.y) * smoothness
    
    // Adjust control point distance based on corner
    let controlDistance = tension * 0.33
    if (isCornerSegment) {
      // Shorten control arms for corners
      controlDistance *= (1 - cornerSharpness * 0.7)
    }
    
    const cp1x = p0.x + t0x * controlDistance
    const cp1y = p0.y + t0y * controlDistance
    const cp2x = p1.x - t1x * controlDistance
    const cp2y = p1.y - t1y * controlDistance
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`
  }
  
  return path
}
```

**Benefits:**
- Preserves intentional corners
- Smooths gentle curves more aggressively
- User can tune corner vs smooth behavior

---

## UI/UX Considerations

### Progressive Disclosure

**Default:** Simple 3-slider interface (like now)

**Advanced Toggle:** Reveals multi-stage pipeline

**Presets:**
```
[Sketchy]   - Low smoothing, preserve detail
[Natural]   - Balanced (default)
[Flowing]   - High smoothing, very fluid
[Technical] - Precise, preserve corners
[Custom]    - Show all controls
```

### Real-time Preview States

1. **Raw dots** (red) - Always available
2. **Simplified** (yellow dots) - Show result of Stage 1
3. **Resampled** (green dots) - Show result of Stage 2
4. **Final path** (red curve) - Show result of Stage 3+4

**Toggle layers independently to see each transformation**

---

## Performance Considerations

### Current: ~1ms for 1000 points
- RDP: Fast (recursive but efficient)
- Simple bezier: Trivial math

### With Full Pipeline: ~5-10ms
- RDP: 1ms (same)
- Resampling: 2-3ms (arc length calc + interpolation)
- Hybrid smoothing: 2-4ms (angle calculation + classification)
- Post-smooth: 1ms (lightweight averaging)

**Still real-time!** useMemo ensures recalc only on control change.

---

## Recommendation

### Phase 2.7: Add Resampling + Hybrid Smoothing

**Implement:**
1. ✅ Keep existing RDP (Stage 1)
2. ➕ Add arc-length resampling (Stage 2)
3. ➕ Add corner detection (enhance Stage 3)
4. ➕ Add hybrid control point placement (Stage 3)
5. ⏸️ Skip post-smooth for now (diminishing returns)

**Controls:**
```
SIMPLIFY:      [slider 0-10]    = 3.0
RESAMPLE:      [slider 5-50px]  = 15
SMOOTH:        [slider 0-1]     = 0.70
TENSION:       [slider 0-1]     = 0.60
CORNER SENSE:  [slider 0-180°]  = 45
CORNER SHARP:  [slider 0-1]     = 0.75

[Advanced ▼]  (collapse/expand)

[✓] Show Dots    [✓] Show Simplified    [✓] Show Resampled    [✓] Show Path
```

**Benefits:**
- Professional-quality results
- Handles all drawing styles (loose to precise)
- Educational (see each transformation stage)
- Future-proof (can add more stages)

---

## Alternative: Keep It Simple

### If Complexity Not Worth It

Current system (2.6) is pretty good! Consider:
- Most users won't tune 6+ sliders
- Current 3-slider system is intuitive
- Resampling helps but adds complexity

**Middle Ground:**
- Add resampling (hidden, auto-enabled)
- Add corner detection (auto, not exposed as slider)
- Keep 3 main sliders (Simplify, Smooth, Tension)
- "It just works" with smart defaults

---

*What direction feels right? Full pipeline with all controls, or smart automation with simple interface?*

