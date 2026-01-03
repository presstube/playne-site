# Story Fragment Simplification Plan v3
## Static Content, Dynamic Viewport (The Camera Model)

**Core concept:** Content never scales. You're just moving a "camera" (viewport) around fixed content.

---

## The Paradigm Shift

### ❌ OLD THINKING (Scaling/Responsive)
```
Viewport changes → Content scales/reflows
Small viewport   → Content shrinks
Large viewport   → Content grows
Export           → Scale content to target size
```

### ✅ NEW THINKING (Camera/Matte)
```
Viewport changes → Camera moves/crops
Small viewport   → Shows less content (tighter crop)
Large viewport   → Shows more content (wider crop)
Export           → Capture current camera view at target PPI
```

**Analogy:** Like shooting a movie
- The scene exists at a fixed size
- Camera/frame shows different portions
- Different aspect ratios = different crops of same scene
- Film resolution (PPI) is independent of scene size

---

## Architecture (Static Content Model)

```
         Infinite Canvas (conceptual)
        
    ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
           
           [Image 800px]           
              at (0,0)              
                                    
          Path coordinates          
         in absolute pixels         
         relative to (0,0)          
                                    
    ┌─────────────────┐             
    │   Viewport      │  ← Browser window
    │   "Camera"      │     (resizable)
    │                 │     Shows portion of canvas
    └─────────────────┘             
    
    Guides show:                    
    "If you export at 1080×1080,    
     this is what will be captured" 
```

---

## Coordinate System (SIMPLIFIED)

### Absolute Pixels, Center Origin
```typescript
type Point = { 
  x: number  // Actual pixels from center
  y: number  // Positive = right/down, negative = left/up
}

// Example:
const point = { x: 250, y: -100 }
// Means: 250 pixels right, 100 pixels up from center
// No scaling, no conversion, just pixels
```

### Coordinate Transform (TRIVIAL)
```typescript
function viewportToCanvas(clientX: number, clientY: number): Point {
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  
  return {
    x: clientX - centerX,  // That's it. Just subtract.
    y: clientY - centerY
  }
}

// No scaling factor, no reference size, no normalization
// 1 viewport pixel = 1 canvas pixel
```

### SVG Rendering (TRIVIAL)
```typescript
// SVG viewBox centered at viewport size
<svg 
  width={window.innerWidth}
  height={window.innerHeight}
  viewBox={`${-window.innerWidth/2} ${-window.innerHeight/2} ${window.innerWidth} ${window.innerHeight}`}
>
  {/* Paths use their stored pixel coordinates directly */}
  <path d={pathData} stroke={color} strokeWidth={width} />
</svg>
```

---

## Content Sizing

### Image (Smart Aspect Ratio Handling)
- Constrained to **800px on longest dimension**
- Maintains original aspect ratio
- Examples:
  - Landscape 1920×1080 → 800×450
  - Portrait 1080×1920 → 450×800  
  - Square 1080×1080 → 800×800
- Positioned at center (0,0)
- **Never scales** - stays at loaded size regardless of viewport

### Sanity Image CDN (Elegant Solution)
```typescript
// Current code already has urlFor, just update parameters:
const currentImageUrl = currentIndex !== null && images[currentIndex]
  ? urlFor(images[currentIndex].imageAsset)
      .width(800)     // Max width
      .height(800)    // Max height  
      .fit('max')     // Constrain longest dimension, preserve aspect ratio
      .quality(90)    // High quality
      .url()
  : null
```

**How Sanity's `.fit('max')` works:**
- Takes both width and height constraints (800×800 box)
- Returns image that fits inside box
- Preserves aspect ratio
- Constrains longest dimension to 800px

**Result:** Every image loads at appropriate size, no client-side calculation needed!

### CSS (Static Positioning)
```css
.image {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* No width/height - use intrinsic dimensions from Sanity */
  /* No max-width/max-height - Sanity already constrained it */
  object-fit: contain;  /* Safety net */
  user-select: none;
  pointer-events: none;
}
```

### Why This Works Perfectly
- ✅ **Sanity does the math** - no client-side aspect ratio calculation
- ✅ **Consistent sizing** - all images fit in 800×800 box
- ✅ **Maintains quality** - high-quality JPEGs at exact needed size
- ✅ **Fast loading** - smaller files than full-resolution
- ✅ **Static size** - browser renders at intrinsic dimensions, no CSS scaling

### Paths
- Drawn in actual pixels
- Width = actual pixels (e.g., 25px = 25px, always)
- Coordinates = actual pixels from center
- **Never scales** - a 25px line stays 25px

### Guides
- Specified in actual export pixels (e.g., 1080×1080)
- Rendered as overlays at actual size
- Show "this is what will fit in the export"

---

## Guide System

### Format Definitions (Export Dimensions)
```typescript
const SOCIAL_FORMATS = {
  'instagram-square': { 
    width: 1080, 
    height: 1080,
    ppi: 72  // Screen resolution
  },
  'instagram-square-hires': { 
    width: 2160,  // 2x for retina
    height: 2160,
    ppi: 144
  },
  // etc.
}
```

### Visual Rendering
- Draw rectangle at actual pixel dimensions
- Centered at (0,0)
- 1px stroke, semi-transparent
- If guide is larger than viewport, it extends off-screen (you see partial border)

```typescript
// Guide for 1080×1080 Instagram post
<rect 
  x={-540}  // Half of 1080
  y={-540}
  width={1080}
  height={1080}
  stroke="rgba(252, 220, 74, 0.6)"  // Yellow
  strokeWidth={1}
  fill="none"
/>
```

---

## Workflow Example

### 1. User creates composition at comfortable viewport (e.g., 1920×1080)
- Image: 800px wide, centered
- Draws paths around it in actual pixels
- Everything visible in large viewport

### 2. User toggles Instagram 1:1 guide (1080×1080)
- Yellow rectangle appears, centered
- Shows what will fit in 1080×1080 export
- User adjusts composition to fit guide

### 3. User resizes browser to 1080×1080
- Content doesn't move or scale
- Viewport now matches guide exactly
- Some content may be cropped out (intentional)

### 4. User exports
- Captures current viewport at target PPI
- E.g., screen is 72 PPI, export at 144 PPI → 2x pixel dimensions
- Content at 1080×1080 becomes 2160×2160 in export

---

## PPI/Export Handling

### Screen Resolution (Working Resolution)
- Default: **72 PPI** (standard screen resolution)
- User works at this resolution
- Comfortable for on-screen drawing

### Export Resolution Options
```typescript
const EXPORT_PRESETS = {
  'screen': { ppi: 72, multiplier: 1 },
  'web-hires': { ppi: 144, multiplier: 2 },    // Retina
  'print-low': { ppi: 150, multiplier: 2.08 },
  'print-high': { ppi: 300, multiplier: 4.17 }
}
```

### Export Process (Phase 3, future)
```typescript
async function exportAtPPI(targetPPI: number) {
  const multiplier = targetPPI / 72  // Assuming 72 PPI working resolution
  
  // Scale up viewport content by multiplier
  const exportWidth = window.innerWidth * multiplier
  const exportHeight = window.innerHeight * multiplier
  
  // Render to canvas at higher resolution
  // (content stays same logical size, more pixels)
  
  // Or: Use CSS transform: scale(multiplier) + capture
}
```

---

## What This Simplifies

### ✅ Coordinate Math
- **Before:** viewport → normalized → reference → pixel → export (5 transforms)
- **After:** viewport → canvas pixels (1 subtract operation)

### ✅ SVG Rendering
- **Before:** Convert normalized coords to viewBox, scale stroke width
- **After:** Use pixel coords directly, viewBox matches viewport

### ✅ Path Storage
- **Before:** Store in normalized 0-1 units, convert on render
- **After:** Store in pixels, render as-is

### ✅ Resizing Behavior
- **Before:** Content scales, paths reflow, complex recalculation
- **After:** Content stays put, viewport shows different portion

### ✅ Export Logic (Future)
- **Before:** Scale content to target size, map coordinates
- **After:** Apply PPI multiplier to viewport dimensions, done

---

## Implementation Plan (REVISED)

### Phase 1: Rip Out Complexity (30 min)
- Remove frame div, frameContent, overlays
- Remove frameRef, getFrameBounds
- Remove all normalization/scaling code
- Remove dead PathControls fields
- Remove console.logs

**Result:** ~200 lines removed

### Phase 2: Implement Static Coordinates (30 min)

1. **Update Point type** (already correct - just pixels)
   ```typescript
   type Point = { x: number; y: number }  // Pixels from center
   ```

2. **Simplify coordinate transform**
   ```typescript
   function viewportToCanvas(clientX: number, clientY: number): Point {
     return {
       x: clientX - window.innerWidth / 2,
       y: clientY - window.innerHeight / 2
     }
   }
   ```

3. **Update mouse handlers**
   ```typescript
   const handleMouseMove = (e: React.MouseEvent) => {
     if (pathMode === 'drawing') {
       const point = viewportToCanvas(e.clientX, e.clientY)
       setCurrentPath(prev => [...prev, point])
     }
   }
   ```

4. **Update SVG rendering**
   ```typescript
   const vw = window.innerWidth
   const vh = window.innerHeight
   
   <svg 
     width={vw}
     height={vh}
     viewBox={`${-vw/2} ${-vh/2} ${vw} ${vh}`}
     style={{ position: 'absolute', top: 0, left: 0 }}
   >
     <path d={generatePathD(smoothPath)} {...} />
   </svg>
   ```

**Result:** Coordinate system is now trivial

### Phase 3: Static Image Positioning (15 min)

```css
.workspace {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;  /* Content can extend beyond */
}

.image {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* Actual pixel dimensions */
  max-width: 60vw;  /* Initial size guideline */
  max-height: 60vh;
  object-fit: contain;
}
```

### Phase 4: Add Guide System (45 min)

1. **Define social formats**
2. **Add guide toggle state**
3. **Render guide rectangles** (centered, actual pixel dimensions)
4. **Add toolbar controls**

### Phase 5: Path Smoothing Update (15 min)

Path smoothing algorithms work in whatever units you pass them.
Since we're now in pixels, they just work. No changes needed.

Just remove the broken normalization code (lines 392-398).

---

## Updated Timeline

- **Phase 1 (rip out):** 30 min
- **Phase 2 (static coords):** 30 min  
- **Phase 3 (static image):** 15 min
- **Phase 4 (guides):** 45 min
- **Phase 5 (path smoothing):** 15 min
- **Testing:** 30 min

**Total: ~2.5 hours** (faster than before!)

---

## Questions

### 1. Working Resolution
Should the content be authored at:
- **Option A:** 72 PPI (standard screen) - comfortable, smaller files
- **Option B:** 144 PPI (retina) - higher quality, but 2x bigger
- **Option C:** User chooses - adds complexity

**My recommendation:** Option A (72 PPI) - standard web resolution, export multiplier handles high-res

### 2. Image Initial Size
When user loads an image, should it be:
- **Option A:** Sized to 60% of initial viewport (then stays that pixel size)
- **Option B:** Loaded at source dimensions (could be huge)
- **Option C:** User sets size explicitly (slider?)

**My recommendation:** Option A - sensible default, stays visible

### 3. Guide Labels
- **Option A:** Just border (minimal)
- **Option B:** Corner dimension labels ("1080×1080")
- **Option C:** Top label with format name ("Instagram Square • 1080×1080")

**My recommendation:** Option C - informative, not cluttered

### 4. Multiple Guides Simultaneously
- **Option A:** One guide at a time only
- **Option B:** "All Guides" shows 4-5 common formats
- **Option C:** User can toggle multiple on/off

**My recommendation:** Option A initially - keeps it simple, can add multi-select later

---

## Why This Is Better

### Mental Model
- ✅ **Intuitive:** "I'm drawing on a canvas, browser window is just the view"
- ✅ **Familiar:** Like Photoshop, Illustrator, print design tools
- ❌ **Responsive thinking:** Not web-native, but that's OK for this tool

### Technical
- ✅ **Simpler code:** No scaling, no coordinate transforms
- ✅ **No math bugs:** 1 pixel = 1 pixel, always
- ✅ **Predictable:** Content stays put, always looks the same

### Workflow
- ✅ **Professional:** Matches how designers think about social media assets
- ✅ **Export-friendly:** PPI multiplier is clean and predictable
- ✅ **Guide system:** Shows "what fits" without affecting content

---

## The Only Complexity: PPI Export

This can wait for Phase 3, but the approach:

```typescript
// User draws at 72 PPI (screen resolution)
// Exports at 144 PPI (retina) for Instagram

async function exportAtPPI(targetPPI = 144) {
  const multiplier = targetPPI / 72
  
  // Method 1: Scale viewport content
  workspace.style.transform = `scale(${multiplier})`
  const canvas = await html2canvas(workspace)
  workspace.style.transform = ''
  
  // Method 2: Render SVG at higher resolution
  const svg = generateExportSVG(multiplier)
  const canvas = svgToCanvas(svg)
  
  // Download
  downloadCanvas(canvas, 'story-fragment.png')
}
```

---

## Ready to Execute?

This is **radically simpler** than any previous version:
- No scaling/responsive logic
- No coordinate transforms (just subtract center)
- No frame/overlay complexity
- Content is static, viewport is the tool

Just confirm:
1. **Working at 72 PPI?** (standard screen)
2. **Image at 60% viewport initially?** (stays that pixel size)
3. **Guide labels with format name?** (e.g., "Instagram Square • 1080×1080")
4. **One guide at a time?** (simple dropdown)

Or say **"go"** and I'll use my recommendations above.

This is the cleanest architecture yet. 🎯
