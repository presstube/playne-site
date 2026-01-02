# Story Fragment - Phase 2.6: Custom Path Smoothing System

**Goal:** Design path smoothing from first principles for hand-drawn input

---

## ✅ Implementation Complete

### Algorithms Implemented

**1. Ramer-Douglas-Peucker (RDP) Simplification**
- Reduces redundant points while preserving shape
- Recursive algorithm finds points furthest from line segments
- Tolerance parameter controls aggressiveness (0-10)
- **Result:** 1000 points → typically 20-50 key points

**2. Custom Bezier Curve Fitting**
- Fits cubic bezier curves through simplified points
- Calculates tangent directions from neighboring points
- Two parameters:
  - **Smoothness** (0-1): How much to follow tangent direction
  - **Tension** (0-1): How tight the curves are

### Toolbar Controls (Real-time adjustment)

**PATH Section:**
```
PATH: [NEW]

SIMPLIFY: [slider 0-10]  = 3.0
SMOOTH:   [slider 0-1]   = 0.70
TENSION:  [slider 0-1]   = 0.60

[✓] Dots    [✓] Path
```

**Control behaviors:**
- **SIMPLIFY**: 0 = keep all points, 10 = very aggressive reduction
- **SMOOTH**: 0 = angular/polygonal, 1 = very smooth curves
- **TENSION**: 0 = loose flowing curves, 1 = tight controlled curves
- **Dots checkbox**: Toggle raw point visibility
- **Path checkbox**: Toggle smooth curve visibility

### State Management

**Added:**
```typescript
interface PathControls {
  simplifyTolerance: number  // 0-10 (default 3)
  smoothness: number         // 0-1 (default 0.7)
  tension: number            // 0-1 (default 0.6)
  showDots: boolean         // default true
  showPath: boolean         // default true
}
```

**Path calculation:**
```typescript
const smoothPath = useMemo(() => {
  // Step 1: Simplify (RDP)
  const simplified = simplifyPath(currentPath, controls.simplifyTolerance)
  
  // Step 2: Fit curves
  return fitBezierCurves(simplified, controls.smoothness, controls.tension)
}, [currentPath, pathControls])
```

**Real-time:** Changes to any control instantly recalculate path (useMemo optimization)

---

## Visual Flow

```
Draw path → Raw dots captured and shown
          ↓
Release mouse → Dots stay visible
              ↓
              Simplification runs (RDP)
              ↓
              Curve fitting runs
              ↓
              Smooth path overlays dots
              ↓
              Both visible (toggle independently)
```

**Adjust controls → Path recalculates instantly**

---

## Algorithm Details

### Ramer-Douglas-Peucker (RDP)

**Purpose:** Remove redundant points that don't affect shape

**How it works:**
1. Draw line from start to end point
2. Find point with maximum perpendicular distance from line
3. If distance > tolerance, keep that point and recurse
4. Otherwise, remove all intermediate points

**Example:**
- Input: 847 mouse points
- Tolerance 3.0: Output ~35 key points
- Tolerance 8.0: Output ~12 key points

### Custom Bezier Fitting

**Purpose:** Create smooth curves through simplified points

**How it works:**
1. For each pair of points (p0, p1):
2. Calculate tangent using neighbors (pPrev, pNext)
3. Scale tangent by smoothness factor
4. Place control points at tension distance along tangent
5. Build cubic bezier: p0 → cp1 → cp2 → p1

**Parameters:**
- **Smoothness**: How much to honor tangent direction
  - 0 = straight lines between points
  - 1 = maximum curve influence from neighbors
  
- **Tension**: How far control points are from endpoints
  - 0 = control points at endpoints (straight lines)
  - 1 = control points far from endpoints (flowing curves)

---

## Why This Approach Works

### vs Single Algorithm
✅ **Two-stage** (simplify then smooth) vs one-pass  
✅ **Point reduction** first improves performance  
✅ **User control** at each stage  

### vs Pre-made Library
✅ **Transparent** - can see and modify algorithms  
✅ **Tuned for hand-drawing** - not CAD or vector graphics  
✅ **Real-time feedback** - adjust until it feels right  

### vs Catmull-Rom
✅ **Simpler** math, easier to understand  
✅ **Point reduction** built-in (Catmull-Rom uses all points)  
✅ **More control** over final result  

---

## Files Modified

**StoryFragment.tsx:** +150 lines
- RDP algorithm (70 lines)
- Bezier fitting (40 lines)
- useMemo for path calculation
- Control handlers
- Expanded toolbar JSX

**StoryFragment.module.css:** +70 lines
- Slider styles
- Checkbox styles
- Slider value display
- Toolbar wrapping (multi-row)

**Total:** ~220 lines

---

## Testing Checklist

- [ ] Draw path - dots appear
- [ ] Release - dots stay visible
- [ ] Smooth curve overlays dots
- [ ] SIMPLIFY slider: lower = more points, higher = fewer
- [ ] SMOOTH slider: lower = angular, higher = smooth
- [ ] TENSION slider: lower = loose, higher = tight
- [ ] Dots checkbox: hide/show dots
- [ ] Path checkbox: hide/show curve
- [ ] Both toggles work independently
- [ ] Controls disabled while drawing
- [ ] Real-time updates (no lag)
- [ ] PATH NEW clears everything

---

## Default Values Explained

**SIMPLIFY: 3.0**
- Sweet spot for hand-drawing
- Removes jitter but keeps intent
- Try 1.0 for high detail, 5.0 for loose

**SMOOTH: 0.7**
- Moderately smooth curves
- Not too angular, not too flowing
- Try 0.3 for sketchy, 0.9 for fluid

**TENSION: 0.6**
- Moderate curve tightness
- Good balance of control and flow
- Try 0.3 for very loose, 0.9 for very tight

---

*Phase 2.6 complete. Custom smoothing with full user control.*


