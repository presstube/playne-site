# Proposal 2: Curvature‑Constrained Spline (No‑Kink Guarantee)

## Critique of Proposal 1
- 👍 Minimum‑radius check is correct diagnosis.
- ⚠️ Reactive fixes (nudging points, inserting relief points) add instability and can fight the spline, causing shape jitter across resizes.
- ⚠️ Hard caps on lobes/amplitude reduce expressiveness instead of guaranteeing smoothness by design.

## Core Idea
Design the path so a kink cannot occur: generate a curve whose radius of curvature is constrained everywhere at construction time.

## Method (Deterministic, Stable)
1. **Continuous offset function (no sign jumps)**
   - Offset along line using a band‑limited function f(t) with ≤2 lobes (e.g., single or double cosine), not discrete sign flips.
   - f(t) = A · cos(π·t) or A · sin(2π·t+φ) with smooth envelope E(t) (e.g., raised‑cosine) → zero at ends, max in middle.
2. **Curvature budget from stroke width**
   - Compute allowable max curvature κ_max = 1 / (k · strokeWidth) with k≈2.5.
   - Convert to an amplitude cap A_max given segment length L: A ≤ g(L, κ_max). If requested A exceeds A_max, scale it down.
3. **Centripetal Catmull–Rom → Cubic with handle clamp by curvature**
   - Keep centripetal CR, but clamp Bézier handles by local κ_max instead of a fixed ratio.
4. **Adaptive lobe policy**
   - If A near A_max, auto‑reduce lobes to 0–1 and widen spacing (t in [0.3, 0.7]).
   - If A well below A_max, allow 2 lobes with t in [0.2, 0.5, 0.8].
5. **Endpoint tangency and overscan**
   - Use ghost points + tangent alignment so entry/exit angles are ≤ 45°; overscan ≥ 3× strokeWidth.

## Why This Works
- No discrete sign flips → no forced reversals → no inner‑edge corners.
- Amplitude derived from curvature bound → radius never drops below brand threshold.
- Curvature‑aware handle clamp keeps Bézier segments consistent with the bound.
- Deterministic reductions (not reactive nudges) → stability across rerenders/resizes.

## Acceptance Criteria
- min(radius_of_curvature) ≥ 2.5 × strokeWidth across entire path.
- No inner‑edge angular corners at any zoom level.
- Supports big, sweeping motions (pink reference) with 0–2 lobes depending on amplitude budget.

## Implementation Notes (follow‑up)
- Precompute κ and A_max from L, expose `curvatureFactor` (defaults 2.5) for tuning.
- Replace waypoint sign arrays with analytic f(t) + envelope; keep seed for phase/phase‑jitter only.
