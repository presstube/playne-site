# Story Fragment - Phase 2 Bug Fix

**Issue:** mouseup event after drawing path triggers image click handler

**Date:** January 2, 2026

---

## Problem

When finishing a path drawing (mouseup), the click handler for random image selection was also firing. This caused the image to change unexpectedly right after drawing a path.

## Root Cause

Both interactions were using the same container element:
- Path drawing: `onMouseDown`, `onMouseMove`, `onMouseUp`
- Image selection: `onClick`

The `onClick` event fires after `mouseup`, so both handlers executed.

## Solution

**Remove click-to-random-image functionality entirely.**

Replace with dedicated toolbar buttons:
- **RANDOM** - Load random image
- **NEXT** - Next image (same as arrow right)
- **PREV** - Previous image (same as arrow left)
- **PATH** - Draw new path (existing)

**Benefits:**
- No event conflicts
- More explicit controls
- Better discoverability (users can see all options)
- Keyboard shortcuts still work (arrows)

---

## Implementation

### Toolbar Layout

```
IMAGE: [RANDOM] [PREV] [NEXT]  |  PATH: [NEW]
```

Left side: Image controls  
Right side: Path tools (will grow in future phases)

### Changes Made

**1. Removed `onClick` from container**
- Container no longer has click handler
- Only mouse handlers for path drawing

**2. Added three image control handlers**
```typescript
handleRandomImage() // Random selection
handleNextImage()   // Next in sequence  
handlePrevImage()   // Previous in sequence
```

**3. All image controls clear path and reset mode**
- Ensures clean slate when switching images
- Prevents orphaned paths

**4. Updated keyboard handlers**
- Arrow keys now call the same handlers as buttons
- Maintains DRY principle

**5. New toolbar structure**
- Two sections: IMAGE and PATH
- Visual divider between sections
- Labels for clarity
- All buttons disable during path drawing

**6. Enhanced CSS**
- `.toolbarSection` - Groups related buttons
- `.toolbarLabel` - Small caps labels
- `.toolbarDivider` - Visual separator
- Consistent button styling

---

## Result

✅ No more event conflicts  
✅ Explicit image controls  
✅ Cleaner interaction model  
✅ Room for future path tools  
✅ Better discoverability  

### Testing

- [ ] RANDOM button loads random image
- [ ] PREV/NEXT buttons navigate (same as arrows)
- [ ] Arrow keys still work
- [ ] All image buttons clear path
- [ ] PATH NEW button draws new path
- [ ] All buttons disable during drawing
- [ ] No mouseup conflicts

---

*Bug fixed. Ready for testing.*

