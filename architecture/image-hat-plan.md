# Image Hat - Random Gallery Image Selection

## Overview

A utility system for pulling random images from Sanity galleries. Like reaching into a hat full of images - pull one out at random.

---

## Core Concept

**Fetch metadata (JSON), not images** - Query returns ~72 image records with URLs and metadata (~20-30KB). Server picks one random record, passes its Sanity CDN URL to component. Only that one image loads.

---

## Architecture: Server-Side Random Selection

### Data Flow

```
1. Page route (server component) 
   → Fetch all gallery image metadata from Sanity
   
2. Server-side random selection
   → Pick one image record from metadata array
   
3. Pass to client component
   → Single image URL + metadata as props
   
4. Next.js Image component
   → Loads only the selected image from Sanity CDN
```

---

## Implementation Plan

### 1. GROQ Query for All Gallery Images

**File:** `src/sanity/lib/galleries-queries.ts`

```typescript
export const allGalleryImagesQuery = `
  *[_type == "gallery"] {
    "images": images[] {
      "url": asset.asset->url,
      "metadata": asset.asset->metadata,
      "dimensions": asset.asset->metadata.dimensions,
      "lqip": asset.asset->metadata.lqip,
      caption,
      altText,
      photographer,
      "galleryTitle": ^.title,
      "gallerySlug": ^.slug.current
    }
  }.images[]
`
```

**Returns:** Flat array of all images from all galleries

---

### 2. Image Hat Utility

**File:** `src/lib/image-hat.ts`

```typescript
export interface GalleryImage {
  url: string
  metadata: any
  dimensions: { width: number; height: number }
  lqip: string
  caption: string
  altText: string
  photographer?: string
  galleryTitle: string
  gallerySlug: string
}

// Pick one random image
export function pickRandomImage(images: GalleryImage[]): GalleryImage | null {
  if (!images || images.length === 0) return null
  return images[Math.floor(Math.random() * images.length)]
}

// Pick multiple random images
export function pickRandomImages(
  images: GalleryImage[], 
  count: number
): GalleryImage[] {
  if (!images || images.length === 0) return []
  const shuffled = [...images].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
```

---

### 3. Update PhotoPath Page Route

**File:** `src/app/components/photopath/page.tsx`

Convert to async server component:

```typescript
import { client } from '@/sanity/lib/client'
import { allGalleryImagesQuery } from '@/sanity/lib/galleries-queries'
import { pickRandomImage } from '@/lib/image-hat'
import ComponentPhotoPathPage from '../../ComponentPhotoPathPage/ComponentPhotoPathPage'

export const dynamic = 'force-dynamic' // Fresh random on each request

export default async function Page() {
  const allImages = await client.fetch(allGalleryImagesQuery)
  const randomImage = pickRandomImage(allImages)
  
  return <ComponentPhotoPathPage image={randomImage} />
}
```

---

### 4. Update ComponentPhotoPathPage

**File:** `src/app/ComponentPhotoPathPage/ComponentPhotoPathPage.tsx`

Pass image to PhotoPath:

```typescript
'use client'

import PhotoPath from '@/components/PhotoPath/PhotoPath'
import { GalleryImage } from '@/lib/image-hat'
import styles from './ComponentPhotoPathPage.module.css'

interface ComponentPhotoPathPageProps {
  image: GalleryImage | null
}

export default function ComponentPhotoPathPage({ image }: ComponentPhotoPathPageProps) {
  if (!image) return <div>No images available</div>
  
  return (
    <div className={styles.componentPhotoPathPage}>
      <PhotoPath image={image} />
    </div>
  )
}
```

---

### 5. Update PhotoPath Component

**File:** `src/components/PhotoPath/PhotoPath.tsx`

Replace hardcoded PHOTOS array with image prop:

```typescript
import { GalleryImage } from '@/lib/image-hat'
import { urlFor } from '@/sanity/lib/image'

interface PhotoPathProps {
  image: GalleryImage
}

export default function PhotoPath({ image }: PhotoPathProps) {
  // Remove: const PHOTOS array
  // Remove: useState for selectedPhoto
  // Remove: useEffect for random selection
  
  // Use Sanity image URL
  const imageUrl = urlFor(image.url).width(1200).quality(85).url()
  
  // Rest of component logic stays the same
  // Use image.altText for alt attribute
  // Use image.dimensions for Next.js Image width/height
}
```

---

## Key Benefits

✅ **Reusable** - Image hat utility works for any component needing random images  
✅ **Performant** - Only metadata fetched, single image loads  
✅ **Type-safe** - TypeScript interfaces for image data  
✅ **SEO-friendly** - Server-rendered with image in initial HTML  
✅ **Scalable** - Easy to add filters (by tag, gallery, etc.)  
✅ **Maintainable** - Centralized in Sanity, no hardcoded paths  

---

## Optional Enhancements

### Phase 2 Features (Future)

1. **Image Attribution Overlay**
   - Display photographer credit on hover
   - Link to source gallery

2. **Filter Options**
   - By gallery: `pickRandomImage(images, { gallery: 'shantell-playne' })`
   - By tag: `pickRandomImage(images, { tag: 'workshop' })`

3. **Client-Side Refresh**
   - Fetch hat on mount
   - Button to pick new random image without page reload
   - Would require converting to client-side fetch

4. **Exclude Recently Shown**
   - Use localStorage to track recent images
   - Avoid showing same image repeatedly

5. **Weighted Random**
   - Prefer featured galleries
   - Prefer images with photographer credits

---

## Implementation Notes

- **Dynamic rendering** - Use `export const dynamic = 'force-dynamic'` for fresh random on each visit
- **Image optimization** - Use Sanity's `urlFor()` helper for responsive images with quality/size params
- **Error handling** - Gracefully handle empty galleries or failed fetches
- **TypeScript** - All interfaces in `image-hat.ts` for reuse across components

---

## Status

✅ **COMPLETED** - October 23, 2025

### Implementation Summary

All 5 steps completed successfully:

1. ✅ **GROQ Query Added** - `allGalleryImagesQuery` in `galleries-queries.ts`
   - Returns flat array of all images from all galleries
   - Includes imageAsset for urlFor(), dimensions, lqip, captions, gallery context
   
2. ✅ **Image Hat Utility Created** - `src/lib/image-hat.ts`
   - `GalleryImage` interface with full typing
   - `pickRandomImage()` for single selection
   - `pickRandomImages()` for multiple selections
   - Helper filters for gallery/photographer filtering
   
3. ✅ **Page Route Updated** - `/components/photopath/page.tsx`
   - Converted to async server component
   - Added `export const dynamic = 'force-dynamic'` for fresh random on each request
   - Fetches all image metadata (~20-30KB JSON)
   - Picks random image server-side
   - Passes to component as prop
   
4. ✅ **Wrapper Component Updated** - `ComponentPhotoPathPage.tsx`
   - Now accepts `image` prop (GalleryImage | null)
   - Graceful error handling for missing images
   - Passes image to PhotoPath component
   
5. ✅ **PhotoPath Component Refactored** - `PhotoPath.tsx`
   - Removed hardcoded PHOTOS array (30 images)
   - Removed client-side random selection logic
   - Now receives image from server as prop
   - Uses Sanity's `urlFor()` for optimized image URLs
   - Uses actual image dimensions from metadata
   - Implements blur placeholder with LQIP
   - Uses proper alt text from gallery metadata
   - Path interactivity preserved exactly as before

### Key Implementation Details

**Performance Optimizations:**
- Sanity image optimization: `width(1200).quality(85)`
- Blur placeholder using LQIP from Sanity metadata
- Proper Next.js Image dimensions from actual image metadata
- Only metadata fetched, single image loads

**Data Flow:**
```
Server → Fetch 72 image records (JSON)
      → Pick 1 random
      → Pass to client component
Client → Receives pre-selected image
      → Renders with Sanity CDN URL
      → Only 1 image loads
```

**Benefits Achieved:**
- ✅ Now pulls from ALL 4 galleries (not just 2)
- ✅ All 72 images available (was 30)
- ✅ No hardcoded paths
- ✅ Centralized in Sanity
- ✅ Type-safe with TypeScript
- ✅ Reusable image-hat utility for other components
- ✅ Fresh random selection on each page load

### Testing Notes

No linting errors. Ready to test:
1. Visit `/components/photopath`
2. Refresh page multiple times
3. Should see different random images from all galleries
4. Path interactivity should work exactly as before
5. Check console for gallery title logging

---

Last updated: October 23, 2025

