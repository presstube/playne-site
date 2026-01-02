# Story Fragment - Phase 1 Implementation Progress

**Started:** January 2, 2026  
**Goal:** Simple image viewer with click-to-random and arrow key navigation

---

## Implementation Checklist

### Setup
- [x] Create `/story-fragment` route folder
- [x] Create component files
- [x] Verify Sanity gallery queries work

### Core Functionality
- [x] Fetch all gallery images server-side
- [x] Display white background
- [x] Click to show random image
- [x] Arrow keys for prev/next navigation
- [x] Proper image sizing (50vw/50vh max)
- [x] Center images in viewport

### Polish
- [ ] Test on different screen sizes
- [ ] Verify keyboard navigation wraps around
- [ ] Check performance (no lag)
- [ ] Verify no console errors

---

## Implementation Log

### ✅ Initial Setup (Complete)
**Files Created:**
- `/src/app/story-fragment/page.tsx` (9 lines)
- `/src/app/story-fragment/StoryFragment.tsx` (73 lines)
- `/src/app/story-fragment/StoryFragment.module.css` (15 lines)

**Total LOC:** 97 lines (under the 110 estimated)

### ✅ Core Functionality (Complete)

**Route Entry Point (`page.tsx`):**
- Server-side fetch using `allGalleryImagesQuery`
- Passes images array to client component
- Uses existing Sanity client infrastructure

**Client Component (`StoryFragment.tsx`):**
- State: `currentIndex` (which image) and `mounted` (client-side flag)
- Click handler: generates random index
- Keyboard handler: arrow keys with wrap-around logic
- Image URL generation via `urlFor()` from Sanity
- Conditional rendering (only show image when index is set)

**Styling (`StoryFragment.module.css`):**
- White background using `var(--brand-offwhite)`
- Flexbox centering
- Image sizing constraints: `max-width: 50vw`, `max-height: 50vh`
- `object-fit: contain` preserves aspect ratio
- `cursor: pointer` for click affordance

### Code Quality Notes
- Clean separation: data fetching vs UI logic
- Minimal state (just 2 variables)
- TypeScript types properly used (`GalleryImage` from existing lib)
- Follows existing project patterns (CSS Modules, component co-location)
- No external dependencies added

### 🔧 Bug Fixes Applied

**Issue 1: Arrow Key Conflict**
- Problem: `PageNavigation` component was listening to arrow keys globally, conflicting with story-fragment navigation
- Root cause: Component was hidden with CSS but still mounted, so event listeners were active
- Fix: Changed RootLayout to conditionally render PageNavigation (don't mount at all for frameless routes)
- Files changed: `src/app/RootLayout/RootLayout.tsx`

**Issue 2: Images Forced to Square Format**
- Problem: Using `.width(1200).height(1200)` in Sanity urlFor forced square bounding box
- Root cause: Even with `.fit('max')`, Sanity constrains to the specified dimensions
- Fix: Use `.width(1600)` only (no height), let Sanity preserve original aspect ratio
- CSS handles the 50vw/50vh constraint with `max-width` and `max-height`
- Files changed: `src/app/story-fragment/StoryFragment.tsx`

**Result:** Images now display in their original aspect ratios (landscape, portrait, square) while respecting the 50vw/50vh size constraints.

---

## Ready for Testing

### How to Test

1. **Start dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Navigate to**: `http://localhost:3000/story-fragment`

3. **Test sequence**:
   - Should see white/offwhite background
   - Click anywhere → random image appears (centered, properly sized)
   - Click again → different random image
   - Press `→` arrow → next image in sequence
   - Press `←` arrow → previous image in sequence
   - Keep pressing arrows to verify wrap-around
   - Resize browser window → image should stay within 50vw/50vh

### Expected Behavior

**Visual:**
- Clean white background (`#EAEADA`)
- Image centered in viewport
- No image exceeds 50% of viewport width
- No image exceeds 50% of viewport height
- Aspect ratios preserved (no distortion)

**Interaction:**
- Click = random selection
- Arrow right = next in sequence
- Arrow left = previous in sequence
- Arrows wrap (last → first, first → last)
- No lag or jank

### Code Quality Check
- ✅ No linter errors
- ✅ TypeScript compiles cleanly
- ✅ Under 100 lines of code total
- ✅ Follows project architecture patterns
- ✅ Uses existing utilities (urlFor, GalleryImage type)

---

## Testing Results

*To be filled in after manual testing*

### What Works
- [ ] White background displays
- [ ] Click shows random image
- [ ] Images are properly centered
- [ ] Images stay within 50vw/50vh bounds
- [ ] Aspect ratios preserved
- [ ] Arrow right advances
- [ ] Arrow left goes back
- [ ] Navigation wraps around
- [ ] Responsive (works at different screen sizes)
- [ ] No console errors

### What Needs Adjustment
*To be filled in if issues found*

### Next Steps After Testing
- If all works: Mark Phase 1 complete, plan Phase 2
- If issues: Document and fix before proceeding

---

*Last updated: January 2, 2026*

