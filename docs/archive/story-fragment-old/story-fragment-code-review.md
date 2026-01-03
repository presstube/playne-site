# Story Fragment System - Code Review

**Date**: January 2, 2026  
**Current State**: Phase 2.8 Complete - Path Drawing & Smoothing

---

## Overview

The `/story-fragment` system is a creative content generation tool for building micro-collages centered around gallery images with hand-drawn path overlays. Currently implements image browsing and sophisticated path drawing/smoothing.

---

## Architecture Review

### **File Structure**
```
/src/app/story-fragment/
  ├── page.tsx              (Server component - data fetching)
  ├── StoryFragment.tsx     (Client component - all interactive logic)
  └── StoryFragment.module.css (Co-located styles)
```

**✅ Strengths:**
- Clean separation: server-side data fetch vs client-side interaction
- Component co-location pattern matches project conventions
- Single client component keeps state management simple

**⚠️ Considerations for Next Phase:**
- Component is 589 lines - will need modularization as features grow
- Path smoothing algorithms (lines 39-256) could extract to utilities
- No state persistence yet (will need for save/export)

---

## Current Features

### **1. Image Management**
- Fetches all gallery images from Sanity via `allGalleryImagesQuery`
- Keyboard navigation: Arrow Left/Right
- Button navigation: RANDOM, PREV, NEXT
- Images sized to max 50vw × 50vh (preserves aspect ratio)

**✅ Strengths:**
- Simple, effective image browsing
- Aspect ratio preservation via Sanity CDN
- Clean keyboard + button controls

**⚠️ Issues for Framing:**
- Images are **viewport-relative** (50vw/50vh) not **frame-relative**
- No bounding container - images float in space
- Centering is flex-based, not coordinate-based
- Path coordinates are **viewport-absolute** (clientX/clientY)

**🔴 Critical for Frame System:**
All sizing and positioning is currently viewport-based. To support aspect ratio frames:
1. Need fixed-size frame container (e.g., 800×800px for square)
2. Image sizing must be relative to frame, not viewport
3. Path coordinates must be relative to frame, not viewport

---

### **2. Path Drawing System**

**Path Modes:**
- `idle`: No active drawing
- `ready`: Click "NEW PATH" button, cursor becomes crosshair
- `drawing`: Mouse down → captures points → mouse up finalizes

**Drawing Features:**
- Mouse tracking on `mousemove` during draw
- Global `mouseup` + `onMouseLeave` handlers prevent "stuck" state
- Paths persist until "NEW PATH" or image change

**✅ Strengths:**
- Robust event handling (no stuck states)
- Clear state machine (idle → ready → drawing → idle)
- Single-path-at-a-time keeps UI simple

**⚠️ Issues for Framing:**
- Paths use `clientX/clientY` (viewport coordinates)
- SVG overlay is `100vw × 100vh` (full viewport)
- No coordinate transformation system for frames

**🔴 Critical for Frame System:**
Paths must be drawn/stored in frame-relative coordinates, not viewport coordinates. Need:
1. Frame container with known position/size
2. Transform viewport mouse coords → frame-relative coords
3. Transform frame coords → viewport coords for display
4. Store paths in frame-relative coords for portability across aspect ratios

---

### **3. Path Smoothing Pipeline**

**4-Stage Algorithm:**
1. **Simplification** (RDP) - Reduces point count (tolerance: 9)
2. **Resampling** - Even point spacing (distance: 50px)
3. **Hybrid Bezier Smoothing** - Smooth curves with corner detection
   - Smoothness: 2.3
   - Tension: 0.3
   - Corner threshold: 180° (no corners)
   - Corner sharpness: 0.35
4. **Multi-pass** - Re-applies smoothing 13 times for ultra-smooth result

**✅ Strengths:**
- Produces beautiful, ultra-smooth paths from rough input
- Hardcoded defaults work well (no UI clutter)
- Memoized for performance

**✅ Ready for Framing:**
Path smoothing is coordinate-agnostic - will work regardless of coordinate system

---

### **4. Path Styling**

**Controls:**
- Color picker: 6 PLAYNE brand colors (36px swatches)
- Width slider: 1-100px
- Stroke style: Hard cap (`butt`), miter join

**✅ Strengths:**
- Brand-integrated color palette
- Wide width range for expressive marks
- Clean, focused UI

**✅ Ready for Framing:**
Styling system is separate from coordinates - will work with any frame system

---

## UI & Layout

### **Current Layout:**
```
┌─────────────────────────────────┐
│                                 │
│     [Full Viewport Canvas]      │
│                                 │
│      Image (centered, 50vw/vh)  │
│                                 │
│      Path SVG (100vw/vh)        │
│                                 │
└─────────────────────────────────┘
       [Dark Toolbar - Bottom]
```

**⚠️ Issues:**
- No visual frame/boundary for the "output area"
- Image + paths exist in infinite canvas
- Unclear what the "final export" will look like
- No aspect ratio constraints

**🎯 Goal:**
```
┌─────────────────────────────────┐
│                                 │
│    ┌─────────────────┐          │
│    │                 │          │
│    │  [Frame Area]   │          │
│    │   (800×800px)   │          │
│    │                 │          │
│    │  Image + Paths  │          │
│    │                 │          │
│    └─────────────────┘          │
│                                 │
└─────────────────────────────────┘
       [Dark Toolbar - Bottom]
```

---

## Critical Issues for Frame System

### **1. Coordinate System Mismatch**
- **Current**: Viewport-absolute coordinates (0,0 = top-left of browser window)
- **Needed**: Frame-relative coordinates (0,0 = top-left of frame)

**Impact:**
- Paths drawn at viewport coords won't survive viewport resize
- Can't export just the frame area
- Can't switch aspect ratios without breaking paths

**Solution:**
Transform all coordinates through frame bounds:
```javascript
// Drawing: viewport → frame
const frameX = mouseEvent.clientX - frameLeft
const frameY = mouseEvent.clientY - frameTop

// Display: frame → viewport  
const displayX = frameX + frameLeft
const displayY = frameY + frameTop
```

---

### **2. Image Sizing Logic**
- **Current**: `max-width: 50vw; max-height: 50vh`
- **Needed**: Size relative to frame dimensions

**Impact:**
- Image size changes with viewport, not frame
- Can't guarantee consistent export dimensions
- Aspect ratios won't work predictably

**Solution:**
```css
/* Inside frame container */
.image {
  max-width: 100%;   /* 100% of frame width */
  max-height: 100%;  /* 100% of frame height */
  object-fit: contain;
}
```

---

### **3. No Frame Container**
- **Current**: Single div with centered image
- **Needed**: Explicit frame container with fixed aspect ratio

**Impact:**
- No boundary for the "output area"
- Can't mask/crop to final export dimensions
- Can't visualize what will be exported

**Solution:**
```jsx
<div className={styles.workspace}>
  <div className={styles.frame} data-aspect="square">
    <img />
    <svg className={styles.frameSvg}>
      {/* Paths here */}
    </svg>
  </div>
</div>
```

---

## State Management Review

**Current State:**
```typescript
// Image
currentIndex: number | null
mounted: boolean

// Path drawing
pathMode: 'idle' | 'ready' | 'drawing'
currentPath: Point[]              // ⚠️ Viewport coords
pathControls: PathControls        // Smoothing settings
pathStyle: { color, width }       // Styling
```

**✅ Clean & Simple** - But missing:
- Frame dimensions/aspect ratio
- Frame position (for coordinate transform)
- Multiple paths (currently single path only)
- Text blocks, shapes (future features)
- Fragment metadata (for save/export)

---

## Code Quality

**✅ Strengths:**
- Well-organized, readable code
- Good use of React hooks (`useMemo`, `useCallback`, `useEffect`)
- Clear function names and comments
- Proper event handler cleanup
- TypeScript interfaces for type safety

**⚠️ Areas for Improvement:**
- Main component is large (589 lines) - could extract:
  - Path algorithms → `/lib/path-smoothing.ts`
  - Mouse handlers → custom hook `usePathDrawing()`
  - Image navigation → custom hook `useImageNav()`
- Some magic numbers (e.g., smoothing defaults) - could move to constants
- No error handling for image loading failures

---

## Readiness for Frame System

| Feature | Status | Notes |
|---------|--------|-------|
| Path Drawing | 🟡 Partial | Works, but uses viewport coords |
| Path Smoothing | ✅ Ready | Coordinate-agnostic |
| Path Styling | ✅ Ready | Independent of frame |
| Image Loading | 🟡 Partial | Works, but viewport-sized |
| UI/Toolbar | ✅ Ready | Can add frame controls |
| Coordinate Transform | ❌ Missing | Core requirement |
| Frame Container | ❌ Missing | Core requirement |
| Aspect Ratio Logic | ❌ Missing | Core requirement |

---

## Next Phase Requirements

### **Immediate (Square Home Base):**
1. ✅ Fixed-size frame container (e.g., 800×800px)
2. ✅ Frame-relative coordinate system
3. ✅ Image sizing within frame
4. ✅ Visual frame boundary/mask
5. ✅ SVG clipping to frame bounds

### **Soon (Aspect Ratio System):**
1. Frame aspect ratio state (`square`, `landscape-4:3`, `portrait-3:4`)
2. Responsive frame sizing (fit to viewport while maintaining ratio)
3. Toolbar controls for aspect ratio switching
4. Path coordinate scaling when switching ratios

### **Later (Export & Save):**
1. Multiple paths support
2. Fragment serialization (image + paths + metadata)
3. Export to image files (PNG/SVG)
4. Save to Sanity (for use in story collages)

---

## Recommendations

### **Before Implementing Frame:**
1. **Extract path algorithms** → `/lib/path-smoothing.ts`
   - Makes main component more focused
   - Algorithms are stable, don't need to change
   
2. **Add coordinate transform utilities** → `/lib/coordinates.ts`
   ```typescript
   viewportToFrame(point, frameBounds): Point
   frameToViewport(point, frameBounds): Point
   ```

3. **Define frame constants** → Top of file
   ```typescript
   const FRAME_SIZES = {
     square: { width: 800, height: 800 },
     landscape: { width: 800, height: 600 },
     portrait: { width: 600, height: 800 }
   }
   ```

### **Implementation Strategy:**
1. Start with **fixed 800×800px square** (simplest)
2. Center frame in viewport (flex)
3. Convert all mouse events through coordinate transform
4. Add visual frame border
5. Clip SVG paths to frame bounds
6. Test extensively before adding aspect ratio switching

---

## Summary

**Current State**: Solid foundation with excellent path drawing/smoothing.

**Core Issue**: Everything is viewport-based. Needs frame-based coordinate system.

**Path Forward**: 
1. Implement fixed square frame as "home base"
2. Build coordinate transformation layer
3. Adapt image sizing and path rendering to frame
4. Add visual boundaries
5. Then extend to other aspect ratios

The existing path smoothing, styling, and UI are production-ready. The frame system is purely additive - won't require rewriting existing logic, just wrapping it in a new coordinate system.

