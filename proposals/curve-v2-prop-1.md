# Path2 Kink Elimination Proposal

## The Remaining Issue
Path2 uses explicit Bézier control points, but subtle kinks still appear because:
1. **Control points are too close to junction points** relative to stroke width
2. **Perpendicular offsets at junctions create discontinuous curvature** (C1 but not C2)
3. **No relationship between control point distance and stroke width**

## Root Cause
When control points (cp2 and cp3) bracket a junction point with perpendicular offsets in opposite directions, the curvature changes abruptly. Even with C1 continuity (shared tangent), the rate of curvature change creates visible inner-edge angles at thick stroke widths.

Example from S-curve:
```
cp2 at: midpoint + perp * amp * 0.3
cp3 at: midpoint - perp * amp * 0.3
```
This 60% amplitude swing across the junction is too tight for 50-80px strokes.

## Solution: Handle Length Proportional to Stroke Width

### Core Principle
Control point distance from endpoints must be ≥ strokeWidth to ensure the radius of curvature stays large enough. The "lever arm" of the Bézier handle needs breathing room.

### Implementation

1. **Calculate safe handle distance:**
   ```
   minHandleDistance = strokeWidth * 1.5
   ```

2. **For single curve (0 lobes):**
   - Place cp1 and cp2 at least `minHandleDistance` from start/end
   - Current: `dx * 0.33` — should be `max(dx * 0.33, minHandleDistance)`

3. **For S-curve (1 lobe):**
   - Control points near midpoint should be ≥ `minHandleDistance` away
   - Reduce perpendicular offset at junction from `amp * 0.3` to `amp * 0.15`
   - Shift more curvature into the curve bodies, less at transition

4. **For double S-curve (2 lobes):**
   - Each junction needs clearance
   - Reduce offsets at p1 and p2 from `amp * 0.5/0.8` to `amp * 0.2/0.4`
   - Spread amplitude more gradually

### Specific Fix for S-Curve (Priority)
```typescript
// Current problem:
const cp2x = midX + perpX * amp * sign * 0.3  // TOO MUCH
const cp3x = midX - perpX * amp * sign * 0.3  // TOO MUCH

// Fixed:
const junctionOffset = Math.min(amp * 0.1, strokeWidth * 0.5)
const cp2x = midX + perpX * junctionOffset * sign
const cp3x = midX - perpX * junctionOffset * sign
```

The junction offset should never exceed half the stroke width, ensuring the inner edge has room to round smoothly.

## Expected Outcome
- Zero kinks at any stroke width
- Curvature changes gradually (C2-like behavior)
- Paths maintain drama via amplitude in curve bodies, not at junctions
- All curves as smooth as the green reference in paths.png

## Implementation Priority
1. Fix S-curve junction offsets (most common, most visible)
2. Add minHandleDistance constraint to all curves
3. Test with strokeWidth range 50-120px to verify

