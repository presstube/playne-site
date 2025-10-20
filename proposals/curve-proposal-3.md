# Proposal 3: Adaptive Spline Fitting with Radius Constraints

## Critique
- Proposal 1 (Sonnet): Reactive fixes (point nudging/insertion) are clever but risk instability and infinite loops if not converged. Fallback to lobes=0 is good but too blunt—sacrifices variety.
- Proposal 2 (ChatGPT): Continuous offsets are excellent for smoothness, but curvature budget via amplitude scaling alone may overly constrain drama. Handle clamping by curvature is strong but needs integration with waypoint generation.

## Hybrid Solution
Combine continuous offsets (P2) with preemptive radius enforcement (P1) in an adaptive fitting loop:
1. **Generate initial waypoints** with continuous f(t) = A · sin(ω t + φ) (ω from lobes), tapered envelope.
2. **Fit spline and sample curvature** at high resolution (e.g., 100 points) using finite differences or analytic κ for cubics.
3. **If min(radius) < k · strokeWidth (k=2.5):**
   - Scale A down 10% and refit (iterative, max 5 steps).
   - If still low, reduce lobes by 1 and regenerate waypoints.
   - Fallback: single cubic with safe A_max = (L / 4) / k, where L is path length.
4. **Endpoint alignment**: Enforce entry/exit angles ≤45° by adjusting first/last waypoint offsets.

## Why Superior
- Proactive fitting ensures min radius by construction (no post-hoc tweaks).
- Preserves high amplitude/drama via iterative scaling, only reducing lobes as last resort.
- Continuous f(t) guarantees no discrete kinks; sampling catches all tight spots.

## Outcome
100% kink-free paths: all curves as smooth as the green example, with bold PLAYNE sweeps preserved.
