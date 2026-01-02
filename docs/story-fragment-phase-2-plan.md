# Story Fragment - Phase 2: Hand-Drawn Paths (StoryFragPath)

**Goal:** Add ability to draw custom paths with mouse, capturing a spline of points

---

## User Flow

### The Experience
1. Click **PATH** button in toolbar (bottom of screen)
2. PATH button **greys out** (disabled state)
3. Cursor changes to **pencil** (if available, else crosshair)
4. Click and drag to draw → **red dots** appear along mouse path
5. Release mouse (mouseup) → path is captured, dots remain visible
6. PATH button **comes back online** (enabled again)
7. Click PATH again → draw a new path (replaces previous)

### Key Behaviors
- **One-shot mode**: Each PATH click sets up for ONE path drawing
- **Single path visible**: New path replaces old path
- **Drawing disables other interactions**: While drawing, image clicks are disabled
- **Visual feedback**: Red dots show the raw captured spline

---

## Technical Plan

### Files to Create/Modify

```
src/app/story-fragment/
  StoryFragment.tsx          # Add path state and mode logic
  StoryFragment.module.css   # Add toolbar and path dot styles
  StoryFragPath.tsx          # NEW: Path drawing component
  StoryFragPath.module.css   # NEW: Path-specific styles
```

---

## Implementation Details

### 1. State Management (StoryFragment.tsx)

**New State Variables:**
```typescript
const [pathMode, setPathMode] = useState<'idle' | 'ready' | 'drawing'>('idle')
const [currentPath, setCurrentPath] = useState<Array<{x: number, y: number}>>([])
```

**State Machine:**
- `idle` - No path drawing, PATH button enabled
- `ready` - PATH clicked, waiting for mousedown, PATH button disabled
- `drawing` - Currently drawing (mousedown fired), capturing points

**Why these states:**
- `idle`: Default state, PATH button clickable
- `ready`: PATH clicked, button greyed, waiting for user to start drawing
- `drawing`: Active drawing in progress, capturing mousemove events

---

### 2. Toolbar Component (in StoryFragment.tsx)

**JSX Structure:**
```tsx
<div className={styles.toolbar}>
  <button 
    className={styles.toolbarButton}
    onClick={handlePathButtonClick}
    disabled={pathMode !== 'idle'}
  >
    PATH
  </button>
</div>
```

**Styling:**
- Fixed to bottom of screen
- Small, clean, non-intrusive
- Button has clear enabled/disabled states

---

### 3. Path Button Handler

```typescript
const handlePathButtonClick = () => {
  setPathMode('ready')        // Enable drawing mode
  setCurrentPath([])          // Clear any previous path
}
```

**Effect:**
- Button greys out (disabled)
- Next mousedown will start capturing

---

### 4. Mouse Event Handlers

**Mouse Down - Start Recording:**
```typescript
const handleMouseDown = (e: React.MouseEvent) => {
  if (pathMode === 'ready') {
    setPathMode('drawing')
    const point = { x: e.clientX, y: e.clientY }
    setCurrentPath([point])
  }
}
```

**Mouse Move - Record Points:**
```typescript
const handleMouseMove = (e: React.MouseEvent) => {
  if (pathMode === 'drawing') {
    const point = { x: e.clientX, y: e.clientY }
    setCurrentPath(prev => [...prev, point])
  }
}
```

**Mouse Up - Finish Path:**
```typescript
const handleMouseUp = () => {
  if (pathMode === 'drawing') {
    setPathMode('idle')  // PATH button comes back online
  }
}
```

---

### 5. Cursor Styling

**CSS Approach:**
```css
.container {
  cursor: pointer; /* Default */
}

.containerDrawReady {
  cursor: crosshair; /* When pathMode === 'ready' */
}

.containerDrawing {
  cursor: crosshair; /* When pathMode === 'drawing' */
}
```

**Pencil cursor (if available):**
```css
.containerDrawReady,
.containerDrawing {
  cursor: url('data:image/svg+xml;utf8,<svg>...</svg>'), crosshair;
}
```

**Fallback:** If pencil SVG doesn't work, `crosshair` is the fallback

---

### 6. Path Dot Rendering

**Component Structure:**
```tsx
{currentPath.length > 0 && (
  <div className={styles.pathOverlay}>
    {currentPath.map((point, i) => (
      <div
        key={i}
        className={styles.pathDot}
        style={{
          left: point.x,
          top: point.y,
        }}
      />
    ))}
  </div>
)}
```

**Dot Styling:**
```css
.pathOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none; /* Don't block mouse events */
  z-index: 10;
}

.pathDot {
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: #FF0000; /* Bright red */
  border-radius: 50%;
  transform: translate(-3px, -3px); /* Center on point */
}
```

**Why this structure:**
- Fixed overlay sits on top of everything
- `pointer-events: none` so dots don't interfere with mouse
- Individual dots positioned absolutely at captured coordinates
- Small transform to center dot on actual mouse position

---

### 7. Toolbar Styling

**Toolbar CSS:**
```css
.toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: rgba(35, 31, 32, 0.95); /* Semi-transparent black */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 100;
  border-top: 1px solid rgba(234, 234, 218, 0.2);
}

.toolbarButton {
  padding: 0.5rem 1.5rem;
  background-color: var(--brand-offwhite);
  color: var(--brand-black);
  border: 1px solid var(--brand-black);
  border-radius: 4px;
  font-family: var(--font-family-sans);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toolbarButton:hover:not(:disabled) {
  background-color: var(--brand-yellow);
  transform: translateY(-1px);
}

.toolbarButton:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}
```

**Design notes:**
- Dark semi-transparent background (doesn't obscure image too much)
- Buttons use brand colors
- Clear disabled state (40% opacity, no hover effects)
- Subtle hover animation on enabled buttons

---

## Interaction Flow Details

### Scenario 1: First Path
```
1. User clicks PATH button
   → pathMode: 'idle' → 'ready'
   → button disables (greys out)
   → cursor: crosshair

2. User clicks and drags
   → mouseDown: pathMode 'ready' → 'drawing'
   → mouseMove: points added to currentPath array
   → red dots render in real-time

3. User releases mouse
   → mouseUp: pathMode 'drawing' → 'idle'
   → PATH button re-enables
   → dots remain visible
```

### Scenario 2: Drawing Another Path
```
1. User clicks PATH button again
   → setCurrentPath([]) clears previous dots
   → pathMode: 'idle' → 'ready'
   → button disables

2. Draw new path (same as above)
   → New dots replace old dots
```

### Scenario 3: Switching Images
```
1. Path is drawn and visible
2. User presses arrow key (switches image)
   → Image changes
   → Path dots remain (absolute positioning, independent of image)
   
Note: This might look weird. Consider:
- Option A: Clear path when image changes
- Option B: Keep path (allows drawing on multiple images)
```

**Recommendation for Phase 2:** Clear path when image changes. Add this:

```typescript
// In useEffect that handles keyboard
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      setCurrentPath([])  // Clear path on image change
      setPathMode('idle')  // Reset mode
      // ... rest of arrow key logic
    }
  }
  // ...
}, [/* deps */])
```

---

## Performance Considerations

### Mouse Event Frequency
- `mousemove` fires very frequently (potentially 100+ events per second)
- Recording every point might create 500-1000 point arrays for complex paths
- Rendering 1000 DOM elements (dots) might be slow

**Phase 2 approach:** Record everything, don't optimize yet
- Modern browsers can handle 1000 divs fine
- We'll see real-world performance with actual drawing
- Can optimize later if needed (sampling, canvas rendering, etc.)

### Why Not Optimize Now?
- Premature optimization is the enemy
- Need real data to know if it's a problem
- Simple array is easier to work with for Phase 3 (curve smoothing)

---

## What's NOT in Phase 2

Explicitly deferred:
- ❌ Curve smoothing (dots → smooth bezier)
- ❌ Path colors (other than red)
- ❌ Path thickness control
- ❌ Multiple simultaneous paths
- ❌ Undo/redo
- ❌ Path export/save
- ❌ Path editing (moving points)
- ❌ Touch support (mobile)

**Why defer:** Get the basic capture working first. Raw dots show us what we're capturing, which is essential for designing the smoothing algorithm in Phase 3.

---

## Testing Checklist

### Before Moving to Phase 3
- [ ] PATH button appears at bottom of screen
- [ ] Clicking PATH disables the button (greys out)
- [ ] Cursor changes to crosshair (or pencil)
- [ ] Click and drag draws red dots
- [ ] Dots appear in real-time during drawing
- [ ] Releasing mouse re-enables PATH button
- [ ] Dots remain visible after drawing
- [ ] Clicking PATH again clears old path
- [ ] New path can be drawn
- [ ] Path clears when switching images
- [ ] Drawing doesn't interfere with arrow key navigation
- [ ] No console errors
- [ ] Performance is smooth (no lag while drawing)

---

## Code Complexity Estimate

**New lines of code:**
- State management: ~15 lines
- Event handlers: ~40 lines
- Toolbar JSX: ~10 lines
- Path dots rendering: ~15 lines
- CSS (toolbar + dots): ~80 lines

**Total: ~160 lines**

**Actual complexity:** Low-medium
- State machine is simple (3 states)
- Event handlers are straightforward
- Rendering is basic (map over array)
- Most complexity is in CSS positioning

---

## Architecture Notes for Future Phases

### Path Data Structure
```typescript
type Point = { x: number, y: number }
type PathData = Point[]
```

**Why simple array:**
- Easy to work with
- Can be serialized to JSON for saving
- Can be post-processed (smoothing, simplification)
- Maps cleanly to SVG path commands later

### Phase 3 Preview: Smoothing Algorithm
```typescript
// Future: Convert raw points to smooth curve
function smoothPath(points: Point[]): string {
  // Use Catmull-Rom or Bezier interpolation
  // Same math as existing Path component
  // Returns SVG path string
}
```

The existing `Path` component already has this math (`catmullRomToBeziers`, `buildPathFromCubics`). We can reuse it.

---

## Success Criteria

**Phase 2 is ready to move on when:**
1. You can draw multiple paths (one at a time) smoothly
2. The red dots clearly show the captured spline
3. The interaction feels responsive (no lag)
4. The toolbar doesn't interfere with viewing the image
5. Switching images cleanly resets the drawing state

**Time estimate:** 2-3 hours
**Risk:** Low (straightforward event handling)

---

*Ready to implement when you give the word.*

