# Proposal: Eliminate Stroke Kinks (Inner-Edge Angular Corners)

## Problem
Thick strokes (50-80px) on tight curves create visible "kinks"—harsh angles on the inner radius. Occurs when curve radius < strokeWidth, making inner edge collapse into sharp corners.

## Root Cause
Catmull-Rom interpolation through closely-spaced waypoints with large perpendicular offsets creates tight radii. When `radius_of_curvature < strokeWidth / 2`, inner stroke edge becomes angular.

## Solution: Minimum Radius Enforcement

### Approach
1. **Calculate local curvature** at waypoints using three consecutive points (p0, p1, p2)
2. **Detect tight curves**: `radius < 2 × strokeWidth`
3. **Widen the arc** by:
   - Moving waypoint outward along perpendicular (increase spacing)
   - Or inserting intermediate "relief" point to split tight bend into two gentle ones
4. **Fallback**: Drop to `lobes=0` (single-sided curve) if geometry can't be fixed

### Implementation Priority
- Measure curvature via circle-fit through consecutive waypoint triplets
- If `κ > threshold`, inject midpoint or reduce amplitude locally
- Guarantee: `min_radius ≥ 2.5 × strokeWidth` everywhere

### Alternative (Simpler)
Force all exaggerated paths to use:
- `lobes ≤ 1` (max one S-bend)
- `tVals` spacing ≥ 0.4 (waypoints never closer than 40% along path)
- `amplitude ≤ 0.45` hard cap

This sacrifices some drama but guarantees smoothness.

## Expected Outcome
Zero visible kinks. All curves display smooth inner/outer edges like the green example. Paths remain bold and sweeping but geometrically gentle.

