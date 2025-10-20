# Path2: Final Kink Removal (G2/Hobby Spline + Radius Guard)

## Read-in and critique
- Read `curve-v2-prop-1.md` (handle distance tied to stroke width; reduce junction offsets). Good immediate mitigation, but local and symptom-focused.
- The remaining “joint” look is fundamentally a curvature continuity issue: C1 (tangent) continuity without G2 (curvature) continuity. At 50–80px strokes, tiny curvature jumps read as kinks on the inner edge.

## Diagnosis (why the tiny kink persists)
- Current explicit Bézier construction alternates perpendicular offsets around junctions. Tangents match, but curvature differs across the join.
- With high stroke widths, curvature discontinuities are amplified visually.

## Proposal
Adopt a curvature‑continuous spline with a hard minimum‑radius constraint:
1. Use a Hobby spline (METAFONT/MetaPost) to convert anchors to cubic Béziers with G2 continuity by design.
2. Enforce a brand radius guard: minRadius ≥ k · strokeWidth (k≈2.5). If violated, deterministically reduce tension/amplitude and, if needed, lobe count.
3. Retain entry/exit overscan and ≤45° approach angles.

Why Hobby?
- Produces cubic Béziers with continuous curvature using local turning angles and a tension parameter.
- Tunable, stable, and avoids ad‑hoc perpendicular flips.

## Method (concise)
- Anchors: generate along start→end using sinusoid + envelope (smooth bias/meander), no sign flips.
- Compute turning angles θi at interior anchors from the polyline.
- Solve Hobby system for unit tangents Ti and handle scales li, ri with global tension τ (default 1.0).
- For segment i (Ai→Ai+1):
  - P0 = Ai, P3 = Ai+1
  - P1 = P0 + (li/3) · Ti
  - P2 = P3 − (ri/3) · Ti+1
- Curvature guard loop:
  - Sample curvature κ(s) over all cubics (64–128 samples total).
  - If 1/max|κ| < k · strokeWidth:
    - τ ← τ · 0.9 and refit (1–2 passes)
    - If still failing, A ← A · 0.9 and refit
    - If still failing, reduce lobes (2→1→0) deterministically
  - Max 5 iterations; guarantee bound.

Notes
- Replaces midpoint cp2/cp3 perpendicular offsets. Junction control points derive from tangents/angles, not hand‑tuned factors.
- For 0‑lobe paths, degenerates to a single smooth arc.

## Minimal math needed (implementation sketch)
- Hobby equations (standard): solve for tangent angles that minimize bending with tension τ (≈30–50 lines of code).
- Practical approximation: with chord length di and turn angles αi, use shape functions f,g to compute li = τ·di·f(αi, αi+1) and ri = τ·di·g(αi, αi+1).

## Acceptance criteria
- No visible joints at any zoom/stroke (50–120px tested).
- minRadius ≥ 2.5× strokeWidth across entire path.
- Supports dramatic “pink‑path” sweeps with 0–2 lobes; reductions happen only to satisfy radius guard.

## Migration plan for Path2
1. Replace `generateSCurve`/`generateDoubleSCurve` with `fitHobbyBezier(anchors, τ)`.
2. Keep current anchor generation (sinusoid + envelope + bias).
3. Add curvature‑guard loop (tension → amplitude → lobes).
4. Preserve overscan and endpoint angle policy.

## Why this will squash the last kink
- G2 continuity removes curvature jumps (root cause of the joint look).
- Radius guard ties geometry to stroke width, preventing tight inner radii.
- Deterministic, parameter‑light, and visually stable.

## Fallback if Hobby is undesirable
- Biarc fitting (two circular arcs per span) with R ≥ k·strokeWidth, then approximate arcs as cubics (0.551915 factor). Biarcs are inherently curvature‑friendly for thick strokes.

## Quick test matrix
- strokeWidth: 50, 70, 90, 120
- lobes: 0, 1, 2
- amplitude: 0.3–0.7 of min(width, height)
- bias: left, right, auto
- backgrounds: light, dark
- Verify min radius and visually inspect junctions at 200% zoom.
