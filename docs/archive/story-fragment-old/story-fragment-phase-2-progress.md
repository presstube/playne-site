# Story Fragment - Phase 2 Implementation Progress

**Started:** January 2, 2026  
**Goal:** Hand-drawn path capture with red dot visualization

---

## Implementation Checklist

### Core Components
- [x] State management (pathMode, currentPath)
- [x] PATH button in toolbar
- [x] Mouse event handlers (down, move, up)
- [x] Path dot rendering overlay
- [x] Toolbar styling
- [x] Cursor changes for draw mode
- [x] Clear path on image change

### Testing
- [ ] PATH button greys out when clicked
- [ ] Cursor changes to crosshair
- [ ] Red dots appear while drawing
- [ ] Mouse up re-enables button
- [ ] Dots persist after drawing
- [ ] New path replaces old path
- [ ] Path clears when switching images
- [ ] No performance issues

---

## Implementation Log

### ✅ Phase 2 Complete

**Files Modified:**
- `src/app/story-fragment/StoryFragment.tsx` (+70 lines)
- `src/app/story-fragment/StoryFragment.module.css` (+62 lines)

**Total New LOC:** 132 lines (close to 160 estimate)

### Implementation Details

**State Management Added:**
```typescript
type Point = { x: number; y: number }
type PathMode = 'idle' | 'ready' | 'drawing'

const [pathMode, setPathMode] = useState<PathMode>('idle')
const [currentPath, setCurrentPath] = useState<Point[]>([])
```

**State Machine:**
- `idle`: Default state, PATH button enabled
- `ready`: PATH clicked, button greyed, waiting for mousedown
- `drawing`: Actively capturing points from mousemove

**Mouse Event Handlers:**
- `handleMouseDown`: Starts drawing when in 'ready' mode
- `handleMouseMove`: Captures points while in 'drawing' mode
- `handleMouseUp`: Completes path and returns to 'idle'

**PATH Button Handler:**
- Clears previous path
- Sets mode to 'ready'
- Button disables automatically (pathMode !== 'idle')

**Integration Points:**
- Image click disabled when pathMode !== 'idle'
- Arrow keys clear path and reset mode
- Path dots render as fixed overlay (doesn't block mouse events)

**Styling Highlights:**
- Dark toolbar (95% opacity black) at bottom
- PATH button: offwhite background, yellow on hover
- Disabled state: 40% opacity, no hover
- Red dots: 6px diameter, centered on capture points
- Crosshair cursor in draw mode

### 🔧 Bug Fix: Event Conflict

**Issue:** mouseup after path drawing triggered image click handler

**Solution:** Removed click-to-change-image. Added explicit toolbar buttons.

**New Toolbar:**
```
IMAGE: [RANDOM] [PREV] [NEXT]  |  PATH: [NEW]
```

**Changes:**
- Removed `onClick` from container
- Added `handleRandomImage`, `handleNextImage`, `handlePrevImage`
- Arrow keys call same handlers (DRY)
- All image controls clear path and reset mode
- Visual sections with labels and divider

**Files Modified:**
- `StoryFragment.tsx`: +30 lines (new handlers + toolbar JSX)
- `StoryFragment.module.css`: +20 lines (section/label/divider styles)

**Result:** No more event conflicts, clearer UI, room for future tools.

---
- ✅ No linter errors
- ✅ Clean state machine pattern
- ✅ Proper TypeScript types
- ✅ useCallback for handlers (prevents re-renders)
- ✅ Keyboard integration (clears path on image change)
- ✅ Follows project architecture patterns

---

## Ready for Testing

### How to Test

1. **Navigate to**: `http://localhost:3000/story-fragment`

2. **Load an image**: Click anywhere or use arrow keys

3. **Test PATH drawing**:
   - Click PATH button (should grey out)
   - Cursor should become crosshair
   - Click and drag on the image
   - Red dots should appear along your mouse path
   - Release mouse (dots persist, PATH button re-enables)

4. **Test multiple paths**:
   - Click PATH again (old dots disappear)
   - Draw new path
   - New red dots should appear

5. **Test image switching**:
   - Draw a path
   - Press arrow keys to change image
   - Path should clear
   - PATH button should return to idle state

### Expected Behavior

**Visual:**
- Dark toolbar at bottom (semi-transparent black)
- PATH button: offwhite default, yellow on hover
- Greyed/disabled PATH button when in draw mode
- Crosshair cursor when drawing
- Bright red dots (6px) tracing mouse path
- Dots centered on actual mouse position

**Interaction:**
- PATH button disabled during drawing
- No image switching during drawing
- Smooth dot rendering (no lag)
- Arrow keys clear path and change image

### Performance Notes
- Raw dot count may reach 500-1000 for detailed drawings
- This is acceptable for Phase 2 (show what we're capturing)
- Phase 3 will convert to smooth curves (reduce DOM elements)

---

## Testing Results

*To be filled in after manual testing*

### What Works
- [ ] PATH button appears in toolbar
- [ ] Button greys out when clicked
- [ ] Cursor changes to crosshair
- [ ] Click and drag draws red dots
- [ ] Dots appear smoothly in real-time
- [ ] Mouse up re-enables PATH button
- [ ] Dots persist after drawing
- [ ] Clicking PATH again clears old path
- [ ] Arrow keys clear path
- [ ] Arrow keys still navigate images
- [ ] Drawing doesn't switch images
- [ ] No console errors
- [ ] Performance is smooth

### What Needs Adjustment
*To be filled in if issues found*

### Next Steps
- If all works: Plan Phase 3 (curve smoothing)
- If issues: Document and fix

---

*Last updated: January 2, 2026*

