# Story Fragment - Bug Fixes

**Date:** January 2, 2026

---

## Issue #1: Arrow Key Conflict ✅ FIXED

### Problem
Arrow keys in `/story-fragment` were conflicting with the site-wide `PageNavigation` component. Both were listening to the same keyboard events.

### Root Cause
In `RootLayout.tsx`, the `PageNavigation` component was conditionally **hidden with CSS** for frameless routes (like `/story`), but it was still **mounted in the DOM**. This meant its event listeners were still active and intercepting arrow key presses.

### Solution
Changed from conditional CSS hiding to conditional rendering:

**Before:**
```tsx
<div className={isFrameless ? styles.hidden : ''}>
  <PageNavigation currentPath={pathname} />
  <Topnav />
</div>
```

**After:**
```tsx
{!isFrameless && (
  <div>
    <PageNavigation currentPath={pathname} />
    <Topnav />
  </div>
)}
```

**Result:** PageNavigation only mounts for non-frameless routes. Arrow keys in `/story-fragment` now work without interference.

---

## Issue #2: Images Forced to Square Format ✅ FIXED

### Problem
All images were displaying in square format, regardless of their original aspect ratios. Landscape and portrait images were being letterboxed/pillarboxed unnecessarily.

### Root Cause
The Sanity `urlFor()` helper was called with both width AND height:

```typescript
urlFor(image)
  .width(1200)
  .height(1200)  // ❌ This forces a square bounding box
  .fit('max')
```

Even though `.fit('max')` prevents cropping, Sanity still constrains the image to fit within a 1200×1200 box, essentially treating all images as squares.

### Solution
Remove the height parameter and let Sanity preserve the original aspect ratio:

**Before:**
```typescript
urlFor(image)
  .width(1200)
  .height(1200)
  .fit('max')
```

**After:**
```typescript
urlFor(image)
  .width(1600)  // Request high quality
  .fit('max')   // Preserve aspect ratio
```

The CSS already handles size constraints correctly:

```css
.image {
  max-width: 50vw;
  max-height: 50vh;
  width: auto;
  height: auto;
  object-fit: contain;
}
```

**Result:** 
- Landscape images display as landscape (respecting 50vw width limit)
- Portrait images display as portrait (respecting 50vh height limit)
- Square images display as square
- All images maintain their original aspect ratios

---

## Testing

### Verified Behaviors
- ✅ Arrow keys work in `/story-fragment` (no conflict)
- ✅ Arrow keys still work on main site pages (PageNavigation unaffected)
- ✅ Images display in correct aspect ratios
- ✅ No images exceed 50vw width
- ✅ No images exceed 50vh height
- ✅ No linter errors introduced

### Files Modified
1. `src/app/RootLayout/RootLayout.tsx` - Conditional rendering fix
2. `src/app/story-fragment/StoryFragment.tsx` - Image URL generation fix
3. `docs/story-fragment-phase-1-progress.md` - Documentation update

---

## Key Learnings

### CSS Hidden vs Not Rendered
- **Hidden with CSS** (`display: none`, `visibility: hidden`): Component still mounts, event listeners still active
- **Conditional rendering** (`{condition && <Component />}`): Component doesn't mount at all
- **When to use which**: If you need to preserve state, use CSS. If you want to prevent side effects (like event listeners), use conditional rendering.

### Sanity Image Sizing
- Specifying both `width()` and `height()` creates a bounding box that constrains aspect ratio
- Specifying only `width()` or `height()` preserves original aspect ratio
- `.fit('max')` means "fit within this box without cropping" (vs `crop`, `fill`, etc)
- Let CSS handle final display constraints when possible

---

*Phase 1 ready for testing with fixes applied.*

