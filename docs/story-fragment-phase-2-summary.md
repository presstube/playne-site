# Story Fragment - Phase 2 Summary

**Implemented:** January 2, 2026  
**Feature:** Hand-drawn path capture with toolbar

---

## What Was Built

### UI Components
1. **Toolbar** - Fixed to bottom of screen with PATH button
2. **Path Drawing System** - Click and drag to capture spline
3. **Visual Feedback** - Red dots show captured points in real-time

### State Machine
```
idle → (click PATH) → ready → (mousedown) → drawing → (mouseup) → idle
```

- **idle**: PATH button enabled, can click images
- **ready**: PATH button greyed, cursor = crosshair, waiting for draw
- **drawing**: Capturing points from mousemove

### Features Implemented
✅ PATH button in dark toolbar  
✅ Button disables (greys out) when clicked  
✅ Cursor changes to crosshair in draw mode  
✅ Click and drag draws red dots  
✅ Dots persist after drawing  
✅ New path replaces old path  
✅ Path clears when switching images  
✅ Image clicking disabled during drawing  
✅ Arrow keys still work (and clear path)  

---

## Code Stats

**Modified Files:**
- `StoryFragment.tsx`: +70 lines
- `StoryFragment.module.css`: +62 lines

**Total:** 132 new lines (estimate was 160)

**Complexity:** Low-Medium
- Simple state machine (3 states)
- Straightforward event handlers
- Basic dot rendering (map over array)

---

## How It Works

### PATH Button Click
```typescript
handlePathButtonClick() {
  setPathMode('ready')     // Enable drawing
  setCurrentPath([])       // Clear old path
}
```

### Drawing Capture
```typescript
mouseDown → Start capturing (add first point)
mouseMove → Add point to array for each event
mouseUp   → Stop capturing, return to idle
```

### Dot Rendering
```tsx
{currentPath.map((point, i) => (
  <div style={{ left: point.x, top: point.y }} />
))}
```

Simple, performant, works with 500-1000 points.

---

## Testing Checklist

Visit `http://localhost:3000/story-fragment` and verify:

- [ ] PATH button visible at bottom
- [ ] Button greys when clicked
- [ ] Cursor becomes crosshair
- [ ] Dragging draws red dots
- [ ] Dots render smoothly
- [ ] Mouse up re-enables button
- [ ] Dots stay visible
- [ ] New path clears old dots
- [ ] Arrow keys clear path and change image
- [ ] No lag or console errors

---

## Next Steps: Phase 3

### Goal: Convert Dots to Smooth Curves

**What to implement:**
1. Smoothing algorithm (Catmull-Rom or Bezier)
2. Render as SVG path instead of dots
3. Choose path color (from brand palette)
4. Choose path thickness (40-80px strokes)

**Reuse existing code:**
- `/src/components/Path/math.ts` has the smoothing functions:
  - `catmullRomToBeziers()`
  - `buildPathFromCubics()`
  - `smoothstep()`

**New challenges:**
- Converting screen coordinates to relative positions
- Making paths "stick" to images (not absolute positioning)
- Ensuring smooth curves honor hand-drawn intent

---

## Key Design Decisions

### Why One-Shot Mode?
User has full control - each PATH click is deliberate. No accidental multiple paths.

### Why Clear on Image Change?
Clean slate for each image. Paths are image-specific (at least for now).

### Why Red Dots?
High contrast, clearly shows what's being captured. Will be replaced by smooth colored curves in Phase 3.

### Why Crosshair Cursor?
Universal "drawing" indicator. Considered pencil emoji but crosshair is clearer.

### Why Fixed Overlay?
Keeps paths independent of image. Will need to change in Phase 3 when paths should "attach" to images.

---

## Known Limitations (To Address Later)

- ❌ No touch support (desktop only for now)
- ❌ No path editing (can't move points after drawing)
- ❌ No undo (must redraw)
- ❌ Only one path at a time
- ❌ Path doesn't scale with viewport resize
- ❌ Raw dots (not smooth curves yet)

These are all intentional deferrals for Phase 3+.

---

*Phase 2 complete. Ready for Phase 3 planning.*

