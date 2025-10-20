# Path2 Kink Elimination: Hybrid Euler-Bézier with Radius Guard

## Read-in and Critique
- **curve-v2-prop-1.md (Sonnet)**: Spot-on diagnosis of junction offsets causing abrupt curvature changes. Proposing min handle distances and reduced perpendicular offsets tied to stroke width is practical and low-complexity. Strength: Immediate, tunable fix without overhauling the Bézier structure. Weakness: Still C1-only; may not fully eliminate subtle curvature jumps in high-amplitude cases—treats symptom but not root (discontinuous curvature).
  
- **curve-v2-prop-2.md (ChatGPT)**: Excellent push for G2 continuity via Hobby splines, plus a curvature-guard loop (tension → amplitude → lobes). Strength: Addresses root cause (curvature discontinuities) systematically; guard ensures brand-safe radii. Weakness: Hobby implementation adds math/code complexity (~30-50 lines); solving the system might be overkill for our simple 0-2 lobe paths, and sampling κ(s) could be perf-heavy if done naively.

Folding in: Combine prop-1's simple offset/handle tweaks for junctions with prop-2's radius guard, but swap Hobby for a lighter G2 approximation using Euler spirals at transitions.

## Diagnosis (The Last Subtle Kink)
- As both note, it's a curvature continuity issue: Our C1 junctions have tangent continuity but sudden curvature shifts, visible as "joints" on thick inner edges (50-80px+ strokes).
- From screenshot: Kinks appear at lobe transitions where offset signs flip, creating tight inner radii < strokeWidth/2.
- Brand goal (paths.png pink path): Linear or smooth curvature ramps for flowing, organic ribbons without any angular inner edges.

## Proposal: Euler-Bézier Hybrid with Guard
Build G2 transitions using Euler spirals (clothoids: linear curvature) approximated as cubics, integrated into our explicit Bézier framework. Add prop-2's radius guard for safety.

Why Euler?
- Linear curvature change = perfect G2 at junctions without solving systems.
- Ideal for roads/ribbons: Smooth acceleration into/out of curves, no abrupt "joints."
- Approximation to cubic is standard (error <0.1% for our scales).

## Method
1. **Anchors & Base Structure**: Keep Path2's anchors along start→end with sinusoidal offsets (amplitude A, lobes 0-2, bias). Use prop-1 reduced perpendiculars at junctions (≤ strokeWidth * 0.5).

2. **Euler Transitions at Junctions**:
   - For each lobe transition (e.g., sign flip), insert an Euler segment:
     - Euler params: entry curvature κ0=0 (straight), exit κ1=1/R where R ≥ k*strokeWidth (k=2.5).
     - Length L_euler = |Δθ| / ((κ0 + κ1)/2) for turning angle Δθ at junction.
     - Approximate Euler as 1-2 cubics using standard factors (e.g., control points at 0.89, 0.56 offsets).
   - Connect with standard cubics for straight/constant-curve sections.

3. **Curvature Guard (from prop-2, simplified)**:
   - Post-generate: Sample min radius over path (analytic for cubics: κ(t) = |x'y'' - y'x''| / (x'^2 + y'^2)^{3/2}).
   - If minR < k*strokeWidth:
     - Scale junction Euler κ1 down (soften turns).
     - If needed, reduce A * 0.9 and rebuild.
     - Fallback: Drop lobes.
   - 3-5 iterations max.

4. **Endpoint Handling**: Prop-1 minHandleDistance for entry/exit; overscan ≥3*strokeWidth; entry angle ≤45°.

## Implementation Sketch (Lightweight, ~20-30 lines added)
- Function `approxEuler(start, end, κ0, κ1, L)`: Returns 1-2 cubics mimicking the clothoid.
- In generate functions:
  - For S-curve: Cubic1 (entry to junction start) + Euler (transition) + Cubic2 (junction end to exit).
- Analytic κ sampling: For each cubic, compute max κ over t∈[0,1] using quadratic formula on κ'(t)=0.

## Acceptance Criteria
- G2 continuity: Curvature plot is smooth/linear at junctions (no jumps).
- minRadius ≥2.5*strokeWidth everywhere.
- Visual: No inner-edge angles at 200% zoom; matches pink path's fluid sweeps.
- Perf: Generation <10ms; no new deps.

## Migration for Path2
- Augment generateSCurve/etc. with Euler inserts at midpoints/junctions.
- Add guard loop and analytic minR computation.
- Tune: Start with k=3.0; test amplitude 0.3-0.7.

## Why This Squashes It
- Euler ensures linear curvature ramps (true G2, better than Hobby for ramps).
- Guard guarantees no tight spots.
- Simpler than full Hobby (no solver), more robust than prop-1 alone.
- Preserves drama: High A allowed if radii stay safe.

## Fallback
If Euler approx is too fiddly, fall back to prop-1 + basic radius scaling (no G2, but kink-reduced).

## Test Matrix
- As prop-2: Vary stroke, lobes, A, bias, bg.
- Plus: Curvature plots; before/after screenshots at kink spots.
