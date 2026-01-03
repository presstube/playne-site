# Story Fragment - Phase 1: Image Viewer

## Goal
Create the simplest possible image viewer that feels great to use. One route, one component, clean code.

---

## What It Does

### The Experience
1. Visit `/story-fragment`
2. See white background (PLAYNE offwhite: `#EAEADA`)
3. Click anywhere → random image appears
4. Press `→` → next image in sequence
5. Press `←` → previous image in sequence
6. Images are beautifully sized and centered

### Sizing Logic (Simple & Clear)
```
For any image:
- Calculate max dimensions: 50vw wide × 50vh tall
- Fit image within that box while preserving aspect ratio
- Center in viewport
```

**Example Calculations:**
- Landscape 2000×1000 (2:1): Display at 50vw × 25vw (maintains ratio, width-constrained)
- Portrait 1000×2000 (1:2): Display at 25vh × 50vh (maintains ratio, height-constrained)
- Square 1000×1000 (1:1): Display at 50vh × 50vh (fits in both constraints)

---

## Technical Architecture

### File Structure
```
src/app/story-fragment/
  page.tsx              # Route entry point (data fetching)
  StoryFragment.tsx     # Client component (UI + interaction)
  StoryFragment.module.css
```

**Why this structure:**
- Follows existing pattern (see `/about/page.tsx` + `AboutPage/`)
- Data fetching separate from client interaction
- CSS Modules for scoped styles
- One component file = easy to understand

---

## Implementation Plan

### 1. Route Entry Point (`page.tsx`)
**Purpose:** Fetch all gallery images, pass to client component

```typescript
// Pseudocode
export default async function Page() {
  const images = await fetchAllGalleryImages()
  return <StoryFragment images={images} />
}
```

**Data fetching:**
- Use existing `allGalleryImagesQuery` from `/src/sanity/lib/galleries-queries.ts`
- Returns array of `GalleryImage` objects (already has dimensions, LQIP, etc)
- Server-side fetch means images list is ready immediately

**Lines of code:** ~15 lines

---

### 2. Client Component (`StoryFragment.tsx`)
**Purpose:** Handle user interaction, display images

**State (minimal):**
```typescript
const [currentIndex, setCurrentIndex] = useState<number | null>(null)
const [mounted, setMounted] = useState(false)
```

**Why this state:**
- `currentIndex`: Which image in array (null = no image shown yet)
- `mounted`: Client-side flag (prevents hydration mismatch)

**Event handlers:**
```typescript
handleClick() {
  if (currentIndex === null) {
    // First click: pick random
    setCurrentIndex(randomInt(0, images.length))
  } else {
    // Subsequent clicks: also random (or could do next)
    setCurrentIndex(randomInt(0, images.length))
  }
}

handleKeyDown(event) {
  if (event.key === 'ArrowRight') {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }
  if (event.key === 'ArrowLeft') {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }
}
```

**Rendering:**
```typescript
return (
  <div className={styles.container} onClick={handleClick}>
    {currentIndex !== null && (
      <img
        src={imageUrl}
        alt={images[currentIndex].altText}
        className={styles.image}
      />
    )}
  </div>
)
```

**Lines of code:** ~80 lines total

---

### 3. Styling (`StoryFragment.module.css`)
**Purpose:** White background, centered image, sizing constraints

```css
.container {
  width: 100vw;
  height: 100vh;
  background-color: var(--brand-offwhite);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.image {
  max-width: 50vw;
  max-height: 50vh;
  width: auto;
  height: auto;
  object-fit: contain;
}
```

**Why this works:**
- `object-fit: contain` preserves aspect ratio
- `max-width: 50vw` + `max-height: 50vh` enforces size constraint
- `width: auto` + `height: auto` lets browser calculate correct size
- Flexbox centers automatically

**Lines of code:** ~15 lines

---

## Image URL Generation

### Use Existing Sanity Image Pipeline
```typescript
import { urlFor } from '@/sanity/lib/image'

const imageUrl = urlFor(images[currentIndex].imageAsset)
  .width(1200)  // Request reasonable size
  .height(1200)
  .fit('max')   // Don't crop, constrain to box
  .quality(90)
  .url()
```

**Why not use Next Image component:**
- Next Image requires explicit width/height at build time
- We want dynamic sizing based on viewport
- Regular `<img>` with Sanity CDN URLs is simpler for now
- Can add Next Image optimization later if needed

---

## Keyboard Interaction

### useEffect for Global Keyboard Listener
```typescript
useEffect(() => {
  if (!mounted) return
  
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      setCurrentIndex((p) => (p === null ? 0 : (p + 1) % images.length))
    }
    if (e.key === 'ArrowLeft') {
      setCurrentIndex((p) => (p === null ? 0 : (p - 1 + images.length) % images.length))
    }
  }
  
  window.addEventListener('keydown', handleKey)
  return () => window.removeEventListener('keydown', handleKey)
}, [mounted, images.length])
```

**Behavior:**
- First arrow press when no image shown → show first image
- Arrows always work after that
- Wraps around (last → first, first → last)

---

## Export Readiness (Architecture Notes)

### What We're Setting Up for Phase 2
This simple structure makes export easy later because:

**1. Clear image reference**
- `images[currentIndex]` is the source of truth
- Easy to pass to export function

**2. Known dimensions**
- Container is full viewport
- Image is centered and sized
- Can calculate exact render dimensions

**3. Separation of concerns**
- Display logic (this phase)
- Export logic (next phase) will be separate function
- Won't need to refactor display code

### Future Export Function (not implemented yet)
```typescript
// Phase 2 - not now
async function exportCurrentImage(format: ExportFormat) {
  const image = images[currentIndex]
  // Render image + any overlays at specified size
  // Return downloadable file
}
```

---

## Total Code Volume

**Estimated lines:**
- `page.tsx`: 15 lines
- `StoryFragment.tsx`: 80 lines
- `StoryFragment.module.css`: 15 lines
- **Total: ~110 lines**

**Actual complexity:** Very low
- No complex state management
- No API calls after initial fetch
- No animations (yet)
- No overlays (yet)
- Just: array of images, index, keyboard/click handlers

---

## Testing Checklist

### Before Moving to Phase 2
- [ ] White background displays correctly
- [ ] First click shows random image
- [ ] Subsequent clicks show random images
- [ ] Arrow right advances to next image
- [ ] Arrow left goes to previous image
- [ ] Arrows wrap around (last ↔ first)
- [ ] Images never exceed 50vw width
- [ ] Images never exceed 50vh height
- [ ] Aspect ratios are preserved
- [ ] Images are centered in viewport
- [ ] Works on different screen sizes (laptop, tablet, phone)
- [ ] No console errors
- [ ] Performance is smooth (no lag on click/keypress)

---

## Why This Feels Great

### Immediate Feedback
- Click → instant random image
- Arrow → instant next/prev
- No loading states (images fetched upfront)

### Predictable Behavior
- Click = surprise (random)
- Arrows = exploration (sequential)
- Clear cause and effect

### Visual Quality
- Clean white background (brand color)
- Images properly sized (never distorted)
- Centered composition (pleasing to eye)

### Keyboard-Friendly
- Can explore entire gallery without mouse
- Natural arrow key navigation
- Could add number keys for jump-to later

---

## What's NOT in Phase 1

These are explicitly deferred:
- ❌ Text overlays (headlines, quotes)
- ❌ Paths or shapes
- ❌ Export functionality
- ❌ Save to Sanity
- ❌ Undo/redo
- ❌ Zoom or pan
- ❌ Transitions/animations
- ❌ Filters or effects

**Why defer:** Each adds complexity. Get the foundation perfect first.

---

## Next Steps After Phase 1

### Phase 2: Text Overlay (Next PR)
- Add single text block on top of image
- Click text to edit
- Position (center, top, bottom)
- Size constraint (stays within image bounds)

### Phase 3: Export (Next Next PR)
- Export current view as PNG
- Single size first (Instagram post 1080×1080)
- Download to browser

### Phase 4+: More Composition Tools
- Multiple text blocks
- Paths and shapes
- Save configurations
- Multiple export sizes

**But not now. One thing at a time.**

---

## Success Criteria for Phase 1

**It's ready to move on when:**
1. The code is clean enough you'd be proud to show someone
2. The UX feels snappy and responsive
3. Images look great at all sizes
4. You can browse the full gallery without friction
5. The architecture is simple enough you could explain it in 2 minutes

**Time estimate:** 1-2 hours to implement
**Complexity:** Low
**Risk:** Very low (all patterns already exist in codebase)

---

*Ready to build when you are.*

