# SANITY IMAGE METADATA FIX - COMPLETE ✅

## The Problem
Images were displaying as squares instead of maintaining their proper aspect ratios because the GROQ queries were not properly dereferencing the nested image asset structure.

## Root Cause
The gallery schema stores images with a **double-nested** structure:
```
{
  asset: {
    _type: "image",
    asset: {
      _ref: "image-xxxxx",
      _type: "reference"
    }
  }
}
```

The queries were using `asset->` when they should have been using `asset.asset->`.

## The Fix

### Files Changed

1. **`src/sanity/lib/galleries-queries.ts`** - Fixed ALL 5 queries:
   - `allGalleryImagesQuery` - Used by story-fragment page
   - `allGalleriesQuery` - Used by gallery index
   - `galleryBySlugQuery` - Used by individual gallery pages
   - `featuredGalleriesQuery` - Used for featured galleries
   - `galleriesByTagQuery` - Used for tag filtering

   **Before:**
   ```typescript
   asset->{
     _id,
     url,
     metadata { dimensions, lqip }
   }
   ```

   **After:**
   ```typescript
   asset {
     asset-> {
       _id,
       url,
       metadata { dimensions, lqip }
     }
   }
   ```

2. **`src/app/story-fragment/StoryFragment.tsx`**
   - Updated `IMAGE_SIZE` constant to `IMAGE_MAX_DIMENSION = 1600` for retina 2x rendering
   - Added `.fit('max')` to urlFor to ensure aspect ratio preservation
   - Query now returns correct `imageAsset` reference structure

### Query Test Results

**Before Fix:**
```json
{
  "width": null,
  "height": null,
  "aspectRatio": null
}
```

**After Fix:**
```json
{
  "width": 2048,
  "height": 1365,
  "aspectRatio": 1.5003663003663004,
  "url": "https://cdn.sanity.io/images/dg1810se/production/..."
}
```

## How Images Now Work

1. **Query** fetches dimensions and aspect ratio from Sanity metadata
2. **urlFor** generates URL with `.maxWidth(1600).maxHeight(1600).fit('max')`
3. **Sanity CDN** returns image constrained to 1600px max dimension while **preserving aspect ratio**
4. **Browser** displays at logical 800px (retina 2x pixel density)

### Examples:
- **Landscape 4032×1960** → Sanity serves **1600×778** → Displays at **800×389 logical**
- **Portrait 3500×5250** → Sanity serves **1067×1600** → Displays at **533×800 logical**
- **Square 2048×2048** → Sanity serves **1600×1600** → Displays at **800×800 logical**

## Configuration

The entire system is controlled by ONE constant:

```typescript
const IMAGE_MAX_DIMENSION = 1600  // Max dimension in pixels (2x for retina, displays at 800px logical)
```

Change this value to resize images throughout the entire story-fragment system.

## Testing

Run the investigation script to verify metadata is being retrieved:

```bash
node scripts/investigate-sanity-images.js
```

This should now show proper dimensions, aspect ratios, and URLs for all image assets.

## Status: ✅ COMPLETE

- All GROQ queries fixed
- Image dimensions now available
- Aspect ratios preserved
- Retina-ready rendering
- Single configuration point

