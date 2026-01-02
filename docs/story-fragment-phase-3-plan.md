# Story Fragment - Phase 3: Square Home Base Frame

**Goal**: Establish a fixed square frame (800×800px) as the bounded canvas for story fragments, with frame-relative coordinate system and visual masking.

---

## Objectives

1. Create a visible, fixed-size square frame centered in the viewport
2. Convert all coordinates from viewport-based to frame-relative
3. Size images relative to frame dimensions (not viewport)
4. Clip/mask all paths to frame boundaries
5. Add subtle visual frame boundary
6. Maintain all existing functionality (drawing, smoothing, styling)

---

## Why Square First?

- **Simplest aspect ratio** - width = height, no complexity
- **Home base reference** - All other ratios will extend from this
- **Social media standard** - 1:1 works for Instagram posts
- **Clear boundaries** - Easy to visualize what will export
- **Foundation for collage** - Story components need defined dimensions

---

## Technical Approach

### **1. Frame Container Structure**

```tsx
<div className={styles.workspace}>
  {/* Full viewport workspace */}
  
  <div className={styles.frame} data-aspect="square">
    {/* Fixed 800×800px frame */}
    
    <div className={styles.frameContent}>
      {/* Image positioned within frame */}
      <img />
    </div>
    
    {/* SVG overlay for paths - sized to frame */}
    <svg className={styles.frameSvg} viewBox="0 0 800 800">
      <path />
    </svg>
  </div>
  
  {/* Toolbar (unchanged) */}
  <div className={styles.toolbar}>...</div>
</div>
```

**Layout:**
```
┌────────────────────────────────────┐
│         Workspace (100vw/vh)       │
│                                    │
│        ┌──────────────┐            │
│        │              │            │
│        │    Frame     │            │
│        │  800×800px   │            │
│        │              │            │
│        └──────────────┘            │
│                                    │
└────────────────────────────────────┘
           [Toolbar]
```

---

### **2. CSS Layout**

```css
.workspace {
  /* Full viewport canvas */
  width: 100vw;
  height: 100vh;
  background-color: var(--brand-offwhite);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  padding-bottom: 100px; /* Space for toolbar */
  overflow: hidden;
}

.frame {
  /* Fixed square frame */
  position: relative;
  width: 800px;
  height: 800px;
  background-color: white;
  border: 1px solid rgba(35, 31, 32, 0.1);
  box-shadow: 0 4px 20px rgba(35, 31, 32, 0.1);
  overflow: hidden; /* Clip content */
  cursor: pointer;
}

.frame[data-drawing="true"] {
  cursor: crosshair;
}

.frameContent {
  /* Container for image */
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.image {
  /* Image sized to frame */
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
}

.frameSvg {
  /* SVG overlay matching frame dimensions */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}
```

---

### **3. Coordinate Transformation**

**Problem**: Mouse events give viewport coordinates. We need frame-relative coordinates.

**Solution**: Transform through frame bounds.

```typescript
// Utility functions
interface FrameBounds {
  left: number
  top: number
  width: number
  height: number
}

function getFrameBounds(frameElement: HTMLElement): FrameBounds {
  const rect = frameElement.getBoundingClientRect()
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height
  }
}

function viewportToFrame(
  clientX: number, 
  clientY: number, 
  bounds: FrameBounds
): Point {
  return {
    x: clientX - bounds.left,
    y: clientY - bounds.top
  }
}

function isPointInFrame(point: Point, bounds: FrameBounds): boolean {
  return point.x >= 0 && 
         point.x <= bounds.width && 
         point.y >= 0 && 
         point.y <= bounds.height
}
```

**Usage in mouse handlers**:
```typescript
const handleMouseDown = useCallback((e: React.MouseEvent) => {
  if (pathMode !== 'ready') return
  
  const bounds = getFrameBounds(frameRef.current!)
  const framePoint = viewportToFrame(e.clientX, e.clientY, bounds)
  
  if (isPointInFrame(framePoint, bounds)) {
    setPathMode('drawing')
    setCurrentPath([framePoint])  // Store frame coords
  }
}, [pathMode])
```

---

### **4. SVG viewBox**

**Key Insight**: SVG `viewBox` creates its own coordinate system.

```tsx
<svg 
  className={styles.frameSvg}
  viewBox="0 0 800 800"  // Frame coordinate space
  preserveAspectRatio="xMidYMid meet"
>
  <path d={smoothPath} />  // Path in frame coords (0-800)
</svg>
```

- `viewBox="0 0 800 800"` means SVG coordinate space is 0-800
- Points stored in frame coords (0-800) render directly
- No scaling math needed - SVG handles it automatically
- Paths clip to 800×800 automatically

---

### **5. State Updates**

**New State:**
```typescript
// Frame reference for bounds calculation
const frameRef = useRef<HTMLDivElement>(null)

// Frame dimensions (constant for square)
const FRAME_SIZE = 800

// Current path now stores frame-relative coords (0-800)
const [currentPath, setCurrentPath] = useState<Point[]>([])
```

**No changes needed:**
- `pathMode` - same state machine
- `pathControls` - smoothing is coordinate-agnostic
- `pathStyle` - styling is coordinate-agnostic
- `currentIndex` - image navigation unchanged

---

### **6. Mouse Event Updates**

**Old (viewport coords)**:
```typescript
const handleMouseMove = useCallback((e: React.MouseEvent) => {
  if (pathMode === 'drawing') {
    const point = { x: e.clientX, y: e.clientY }  // Viewport
    setCurrentPath(prev => [...prev, point])
  }
}, [pathMode])
```

**New (frame coords)**:
```typescript
const handleMouseMove = useCallback((e: React.MouseEvent) => {
  if (pathMode === 'drawing' && frameRef.current) {
    const bounds = getFrameBounds(frameRef.current)
    const framePoint = viewportToFrame(e.clientX, e.clientY, bounds)
    
    // Only add points inside frame
    if (isPointInFrame(framePoint, bounds)) {
      setCurrentPath(prev => [...prev, framePoint])
    }
  }
}, [pathMode])
```

---

### **7. Image Sizing**

**Old**: 
```css
.image {
  max-width: 50vw;   /* Viewport-based */
  max-height: 50vh;
}
```

**New**:
```css
.image {
  max-width: 100%;   /* Frame-based */
  max-height: 100%;
  object-fit: contain;
}
```

Images now size to fill the 800×800 frame while preserving aspect ratio.

---

## Implementation Steps

### **Step 1: Add Frame Container** (Structure)
1. Wrap existing image in `.workspace` > `.frame` > `.frameContent`
2. Add `frameRef` to frame div
3. Update CSS for new layout structure
4. Verify image still displays centered

### **Step 2: Coordinate Utilities** (Transform Layer)
1. Add `getFrameBounds()` helper
2. Add `viewportToFrame()` helper  
3. Add `isPointInFrame()` helper
4. Add to top of component (or extract to utils file)

### **Step 3: Update Mouse Handlers** (Coordinate Transform)
1. `handleMouseDown` - transform to frame coords
2. `handleMouseMove` - transform to frame coords, check bounds
3. `handleMouseUp` - unchanged (just sets mode)
4. `handleMouseLeave` - unchanged (just sets mode)

### **Step 4: Update SVG** (viewBox)
1. Move SVG inside `.frame` container
2. Add `viewBox="0 0 800 800"`
3. Remove fixed positioning CSS
4. Update to `position: absolute` inside frame

### **Step 5: Visual Polish** (Frame Styling)
1. Add subtle border to frame
2. Add drop shadow for depth
3. Ensure frame stands out from workspace background
4. Test with various images (landscape, portrait, square)

### **Step 6: Testing** (Validation)
1. Draw paths across entire frame - should work edge-to-edge
2. Try to draw outside frame - should ignore
3. Release mouse outside frame - should complete path
4. Change images - paths should clear
5. Resize viewport - frame should stay centered, paths should stay correct

---

## Expected Behavior

**Before (Viewport-based)**:
- Image floats in center of screen
- Paths exist anywhere in viewport
- Resizing viewport changes everything
- No clear boundary for "output area"

**After (Frame-based)**:
- Image contained in 800×800 frame
- Paths only exist within frame
- Resizing viewport doesn't affect frame content
- Clear visual boundary shows what will export

---

## Files to Modify

1. **`StoryFragment.tsx`**
   - Add coordinate utilities
   - Add `frameRef`
   - Update JSX structure
   - Update mouse handlers
   - Update SVG

2. **`StoryFragment.module.css`**
   - Rename `.container` → `.workspace`
   - Add `.frame` styles
   - Add `.frameContent` styles
   - Update `.image` styles
   - Update `.frameSvg` styles (was `.pathSvg`)
   - Remove `.containerDrawMode` (use data attribute on frame)

---

## Success Criteria

- ✅ Frame is fixed 800×800px, centered in viewport
- ✅ Frame has subtle visible border
- ✅ Image sizes to fill frame (max 800×800), preserves aspect ratio
- ✅ Paths can be drawn anywhere in frame
- ✅ Paths cannot be drawn outside frame
- ✅ Paths stay correctly positioned when viewport resizes
- ✅ All existing features still work (navigation, styling, smoothing)
- ✅ Cursor changes to crosshair only inside frame during ready mode

---

## Next Steps After Square

Once square frame is working:

1. **Add aspect ratio state**: `'square' | 'landscape-4:3' | 'portrait-3:4'`
2. **Dynamic frame sizing**: Calculate frame dimensions from aspect ratio
3. **Toolbar aspect ratio picker**: Buttons to switch between ratios
4. **Coordinate scaling**: Transform paths when switching aspect ratios
5. **Export system**: Render frame contents to PNG/SVG

---

## Notes

- Keep it simple: Fixed 800px for now, no responsive sizing
- Frame is always 800×800 in this phase (square only)
- Paths stored in frame coords (0-800 range)
- No need to handle aspect ratio switching yet
- Focus on getting coordinate system right first

This establishes the foundation. Once working, all other aspect ratios follow the same pattern.

