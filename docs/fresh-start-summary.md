# Fresh Start - Story Fragment Rebuild

## What We Learned

### ✅ What Works (Confirmed at /blank)
1. **Sanity image metadata** - All 72 images have proper dimensions and aspect ratios
2. **GROQ queries** - Correctly fetching with `asset.asset->` structure
3. **Image rendering** - Perfect aspect ratio preservation when simplified
4. **urlFor()** - Generates correct URLs with `.maxWidth()/.maxHeight()/.fit('max')`

### ❌ What Was Broken (In Old /story-fragment)
1. Complex coordinate normalization systems
2. Frame/canvas nested structures
3. Multiple conflicting image sizing approaches
4. CSS constraints fighting with Sanity's image sizing
5. Over-engineered state management

### 📚 What We Extracted

**Path Rendering Core Logic** saved to `docs/path-rendering-core-logic.md`:
- Ramer-Douglas-Peucker simplification
- Arc-length resampling
- Corner detection
- Adaptive Bezier curve fitting
- Multi-pass smoothing

All tested and tuned parameters documented.

## Clean Slate

### Deleted
- `/src/app/story-fragment/` (page, component, styles)
- 21 old documentation files (archived to `docs/archive/story-fragment-old/`)

### Starting Point: `/blank`

Currently at `/blank`:
```typescript
// Loads all gallery images with metadata
// Picks one randomly
// Displays centered at 600px logical (1200px retina)
// Console logs metadata
```

**Result:** Perfect rendering with correct aspect ratios ✅

## Schema Notes

### The "asset.asset" Issue
The gallery schema has a naming quirk:
```typescript
{
  name: 'asset',  // Field name
  type: 'image',  // Type has its own 'asset' field
}
```

Result: `asset.asset._ref` (confusing but functional)

**Standard practice** would be:
```typescript
{
  name: 'image',  // Clear field name
  type: 'image',
}
```

Result: `image.asset._ref` (clear)

**Decision:** Leave as-is for now. It works, queries are correct, no data migration needed.

## Next Steps

Build the new story-fragment experience from `/blank` with:
1. Simple, center-origin coordinate system (already proven)
2. Clean image sizing (already working perfectly)
3. Path rendering logic (documented in core-logic.md)
4. No unnecessary abstractions
5. No frame/canvas complexity
6. One clear config constant for sizing

**Foundation is solid. Build simple.**

