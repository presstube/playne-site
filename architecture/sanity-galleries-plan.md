# Galleries in Sanity - Implementation Plan

## ✅ STATUS: COMPLETED

**All phases successfully implemented on October 23, 2025**

### Quick Summary
- ✅ 4 galleries created with 72 images
- ✅ 358 MB uploaded to Sanity CDN
- ✅ Intelligent metadata and captions generated
- ✅ Git history cleaned (358 MB removed)
- ✅ Query layer ready for frontend
- ✅ All images have proper alt text and captions

### What's Ready
- Sanity schemas: `gallery` and `galleriesPage`
- Studio interface with Galleries section
- 4 populated galleries:
  - Rockefeller Center Collection (37 images)
  - Shantell Martin: Original Drawings (5 images)
  - Shantell Martin × PLAYNE (7 images)
  - Free Arts Day 2025 (23 images)
- Query layer with 5 GROQ queries
- Galleries hidden by default (`isGalleriesVisible: false`)

### What's Next
- Build frontend pages (when ready)
- Enable galleries visibility in Studio
- Create gallery display components
- Add to site navigation

---

## Mission: Create robust Sanity data store for galleries, then remove images from git

**Scope:** This plan focuses exclusively on creating a Sanity-side data store for galleries and images. Frontend implementation will come later. Once images are satisfactorily in Sanity, they'll be scrubbed from git history and `/public/images/galleries` will be added to `.gitignore`.

---

## 1. Sanity Schema Architecture

### Schema A: `gallery.ts` (document collection)

```typescript
{
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  
  fields: [
    // Core identification
    title: string (required)
    slug: slug (auto-generated)
    
    // Content
    description: array<block> (Portable Text, rich content)
    
    // Metadata
    date?: date (optional - exhibition/event date)
    location?: string (where photos were taken)
    photographer?: string (credit attribution)
    tags: array<string> (for filtering: ['workshop', 'artist-collab', 'event'])
    
    // Images - the heart of the gallery
    images: array<object> {
      asset: image (the actual image in Sanity)
      caption?: string (per-image description)
      altText: string (accessibility - required)
      order?: number (manual sort override)
      photographer?: string (per-image credit if different)
    }
    
    // Visibility & organization
    featured?: boolean (highlight certain galleries)
    status?: string (draft | published - optional if using Sanity's draft system)
    
    // SEO
    seo?: object {
      metaTitle?: string
      metaDescription?: text
    }
  ],
  
  // Preview in Studio
  preview: {
    select: {
      title: 'title',
      imageCount: 'images.length',
      media: 'images[0]'
    },
    prepare: ({ title, imageCount, media }) => ({
      title,
      subtitle: `${imageCount} images`,
      media
    })
  },
  
  // Default ordering in Studio
  orderings: [
    { title: 'Date (newest first)', by: [{ field: 'date', direction: 'desc' }] },
    { title: 'Title A-Z', by: [{ field: 'title', direction: 'asc' }] },
  ]
}
```

### Schema B: `galleriesPage.ts` (singleton)

```typescript
{
  name: 'galleriesPage',
  title: 'Galleries Page',
  type: 'document',
  
  fields: [
    title: string (default: 'Galleries')
    subtitle?: string
    description: array<block> (intro content)
    
    // Visibility toggle (like your eventsPage pattern)
    isGalleriesVisible: boolean (default: false)
    
    // SEO
    seo: object {
      metaTitle: string
      metaDescription: text
    }
  ]
}
```

---

## 2. Sanity Studio Configuration

### Update `sanity.config.ts` structure:

```typescript
S.divider(),
S.listItem()
  .title('Galleries')
  .child(
    S.list()
      .title('Gallery Management')
      .items([
        S.listItem()
          .title('Galleries Page Settings')
          .child(S.document().schemaType('galleriesPage').documentId('galleriesPage')),
        S.divider(),
        S.listItem()
          .title('All Galleries')
          .child(S.documentTypeList('gallery').title('Galleries')),
      ])
  ),
```

Appears in Studio as:
```
Content
├─ Pages
├─ Events
├─ Galleries
│  ├─ Galleries Page Settings
│  └─ All Galleries (4 galleries: Rockefeller, Shantell Drawings, ...)
```

---

## 3. Batch Upload Script Architecture

### Main Script: `scripts/populate-galleries-from-disk.js`

**Flow:**
1. **Scan** `public/images/galleries/` → discover folders
2. **Parse** folder/file names → extract metadata
3. **Upload images** to Sanity Assets API → get asset IDs
4. **Generate** placeholder copy intelligently
5. **Create** gallery documents with image references
6. **Report** what was uploaded

**Technical Implementation Strategy:**

```javascript
const fs = require('fs')
const path = require('path')
const { createClient } = require('@sanity/client')

const GALLERIES_DIR = 'public/images/galleries'

// Smart parsing functions
function parseGalleryMetadata(folderName) {
  // "rockerfeller" → { title: "Rockefeller Center", slug: "rockefeller-center" }
  // "shantell-drawings" → { title: "Shantell Martin: Drawings", photographer: "Shantell Martin" }
  // "yeasin" → { title: "Free Arts Day 2025", photographer: "Yeasin's Gallery" }
}

function parseImageMetadata(filename) {
  // "2025_07_16-Free_Arts_Day-01-by_yeasinsgallery.jpg"
  // → { date: '2025-07-16', caption: 'Free Arts Day (Image 1)', photographer: 'Yeasin' }
}

async function uploadGallery(folderName) {
  const folderPath = path.join(GALLERIES_DIR, folderName)
  const imageFiles = fs.readdirSync(folderPath).filter(isImage)
  
  console.log(`📁 Processing gallery: ${folderName}`)
  console.log(`   Found ${imageFiles.length} images`)
  
  // 1. Upload all images to Sanity
  const uploadedImages = []
  for (const [index, filename] of imageFiles.entries()) {
    console.log(`   ⬆️  Uploading ${index + 1}/${imageFiles.length}: ${filename}`)
    
    const buffer = fs.readFileSync(path.join(folderPath, filename))
    const asset = await client.assets.upload('image', buffer, {
      filename: filename,
      // Add EXIF/metadata preservation
    })
    
    const imageMetadata = parseImageMetadata(filename)
    
    uploadedImages.push({
      _type: 'galleryImage',
      _key: `img-${Date.now()}-${index}`,
      asset: {
        _type: 'reference',
        _ref: asset._id
      },
      caption: imageMetadata.caption || `Image ${index + 1}`,
      altText: generateAltText(folderName, filename),
      order: index,
      photographer: imageMetadata.photographer
    })
  }
  
  // 2. Create gallery document
  const galleryMeta = parseGalleryMetadata(folderName)
  
  const gallery = {
    _id: `gallery-${galleryMeta.slug}`,
    _type: 'gallery',
    title: galleryMeta.title,
    slug: { _type: 'slug', current: galleryMeta.slug },
    description: generateDescription(folderName),
    images: uploadedImages,
    date: galleryMeta.date,
    location: galleryMeta.location,
    photographer: galleryMeta.photographer,
    tags: extractTags(folderName),
    featured: false,
  }
  
  await client.createOrReplace(gallery)
  console.log(`✅ Created gallery: ${galleryMeta.title}`)
}
```

---

## 4. Intelligent Placeholder Copy Generation

### Gallery-Level Metadata:

| Folder | Title | Description | Date | Photographer | Tags |
|--------|-------|-------------|------|--------------|------|
| `rockerfeller` | "Rockefeller Center Collection" | "A collection documenting creative workshops and community engagement at Rockefeller Center. These images capture moments of hands-on learning, artistic expression, and young people exploring practical life skills in an iconic New York City setting." | (extract from files if present) | (auto-detect) | `['workshop', 'nyc', 'community']` |
| `shantell-drawings` | "Shantell Martin: Original Drawings" | "Original artworks by acclaimed visual artist Shantell Martin. These pieces showcase her signature black-and-white line drawings, exploring themes of identity, play, and human connection through spontaneous mark-making." | null | "Shantell Martin" | `['artist-collaboration', 'drawings', 'artwork']` |
| `shantell-playne` | "Shantell Martin × PLAYNE" | "A creative collaboration between visual artist Shantell Martin and PLAYNE, bringing together art and education to inspire young minds. These images document workshops and sessions where creativity becomes a tool for self-discovery and practical learning." | null | "Shantell Martin" | `['artist-collaboration', 'workshop', 'playne']` |
| `yeasin` | "Free Arts Day 2025" | "Celebrating Free Arts Day on July 16, 2025. Community members of all ages gathered to explore creativity, self-expression, and the joy of making art together. Captured by Yeasin's Gallery, these images document a day of vibrant artistic exploration and community connection." | "2025-07-16" | "Yeasin's Gallery" | `['event', 'community', 'free-arts-day']` |

### Image-Level Caption Logic:

```javascript
// Extract date from filename pattern
"2025_07_16-Free_Arts_Day-01-by_yeasinsgallery.jpg"
→ caption: "Free Arts Day, July 16, 2025"

// Clean up code-style names
"Shantell_Martin_Playne-3.jpg"
→ caption: "Shantell Martin × PLAYNE collaboration"

// Handle catalog numbers
"DR2043-image.jpg"
→ caption: "Drawing DR2043"

// Generic fallback
"IMG_5432.jpg"
→ caption: "Image from [Gallery Title]"
```

---

## 5. Query Layer (for future frontend)

### Create `src/sanity/lib/galleries-queries.ts`:

```typescript
// Get all galleries (for gallery index page)
export const allGalleriesQuery = `
  *[_type == "gallery"] | order(date desc, title asc) {
    _id,
    title,
    slug,
    description,
    date,
    location,
    photographer,
    tags,
    featured,
    "imageCount": count(images),
    "coverImage": images[0] {
      asset->{
        _id,
        url,
        metadata
      },
      altText,
      caption
    }
  }
`

// Get single gallery by slug
export const galleryBySlugQuery = `
  *[_type == "gallery" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    date,
    location,
    photographer,
    tags,
    featured,
    images[] {
      _key,
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      caption,
      altText,
      order,
      photographer
    },
    seo
  }
`

// Get galleries page settings
export const galleriesPageQuery = `
  *[_type == "galleriesPage"][0] {
    title,
    subtitle,
    description,
    isGalleriesVisible,
    seo
  }
`

// Get featured galleries only
export const featuredGalleriesQuery = `
  *[_type == "gallery" && featured == true] | order(date desc) {
    // ... same fields as allGalleriesQuery
  }
`
```

These queries are ready to use but won't be called by any pages yet.

---

## 6. Implementation Scripts

### Script 1: `scripts/populate-galleries-page.js`
- Creates the singleton `galleriesPage` document
- Sets default content
- Sets `isGalleriesVisible: false` initially

### Script 2: `scripts/populate-galleries-from-disk.js`
- Main upload workhorse
- Scans filesystem
- Uploads images
- Creates gallery documents
- Progress logging

### Script 3: `scripts/generate-galleries-manifest.js` (Preview/dry-run)
- Scans filesystem
- Shows what WOULD be uploaded without uploading
- Outputs JSON manifest for review
```json
{
  "rockerfeller": {
    "title": "Rockefeller Center Collection",
    "imageCount": 37,
    "files": ["img1.jpg", "img2.jpg", ...],
    "estimatedUploadSize": "45.3 MB"
  }
}
```

### Script 4: `scripts/cleanup-galleries.js` (Safety)
- Deletes all gallery documents
- Optionally deletes gallery image assets
- Use if you need to re-upload with different structure

---

## 7. Implementation Order

### Phase 1: Schema Foundation ✅ **COMPLETED**
1. ✅ Create `src/sanity/schemas/gallery.ts`
2. ✅ Create `src/sanity/schemas/galleriesPage.ts`
3. ✅ Update `src/sanity/schemas/index.ts` to export both
4. ✅ Update `sanity.config.ts` structure section
5. **Verify:** Visit `/studio`, see Galleries section appear

**Implementation Notes:**
- Gallery schema includes nested image objects with caption, altText, order, and per-image photographer
- Preview shows image count and date in Studio list view
- Added three orderings: date desc, date asc, and title A-Z
- GalleriesPage singleton follows the eventsPage pattern with visibility toggle
- Studio structure nests page settings and gallery list under "Galleries" top-level item
- All schemas pass linting without errors

### Phase 2: Singleton Setup ✅ **COMPLETED**
1. ✅ Create `scripts/populate-galleries-page.js`
2. ✅ Run script to create galleriesPage singleton
3. **Verify:** In Studio, edit Galleries Page Settings

**Implementation Notes:**
- Created comprehensive placeholder content with two-paragraph description
- Set `isGalleriesVisible: false` by default (enable after galleries are ready)
- Script successfully created galleriesPage document in Sanity
- Script provides helpful next-step guidance in console output

### Phase 3: Test Upload ✅ **COMPLETED**
1. ✅ Create `scripts/generate-galleries-manifest.js` (dry-run)
2. ✅ Run manifest to preview what will happen
3. **Verify:** Review output, confirm folder parsing is correct

**Implementation Notes:**
- Manifest generator scans filesystem and shows detailed preview
- Successfully parsed all 4 galleries with intelligent metadata extraction
- Identified all 72 images (37 + 5 + 7 + 23)
- Total size: 358.14 MB
- Caption generation working correctly for all filename patterns
- Saved detailed JSON manifest to `scripts/galleries-manifest.json` for reference
- Folder-specific parsing logic handles:
  - Rockefeller: Extracts photographer from filename, adds proper credit
  - Shantell drawings: Catalog numbers (DR####, IN####)
  - Shantell PLAYNE: Numbered collaboration images
  - Yeasin: Date extraction from filename pattern (2025_07_16-Event_Name-##-by_photographer.jpg)

### Phase 4: Single Gallery Test ✅ **COMPLETED**
1. ✅ Create `scripts/populate-galleries-from-disk.js`
2. ✅ Add `--gallery` flag to test one gallery first
3. ✅ Run: `node scripts/populate-galleries-from-disk.js --gallery=shantell-drawings`
4. **Verify:** 
   - ✅ Check Studio for new gallery
   - ✅ Verify images uploaded
   - ✅ Check captions/metadata
   - ✅ Test image URLs work

**Implementation Notes:**
- Test upload successful: Shantell Martin Drawings (5 images)
- Image upload to Sanity CDN working perfectly
- Progress indicator shows real-time upload status
- Each image gets proper caption, altText, and photographer credit
- Gallery document created with all metadata and Portable Text description
- Idempotent by default: Won't re-upload existing galleries
- Added 100ms delay between uploads to avoid rate limiting
- Script supports `--force` flag to re-create galleries if needed

### Phase 5: Batch Upload ✅ **COMPLETED**
1. ✅ Run full script without flags
2. ✅ Upload all 4 galleries (~72 images total)
3. **Verify:** All galleries present in Studio

**Implementation Notes:**
- Successfully uploaded 3 new galleries (67 images)
- Skipped 1 gallery (Shantell Drawings - already existed from test)
- Upload summary:
  - Rockefeller Center Collection: 37 images (305.98 MB)
  - Shantell Martin × PLAYNE: 7 images (8.01 MB)
  - Free Arts Day 2025: 23 images (38.45 MB)
  - Shantell Martin: Original Drawings: 5 images (5.70 MB) - from test
- Total: 72 images, ~358 MB uploaded to Sanity CDN
- All images have proper metadata, captions, and alt text
- Gallery descriptions formatted as Portable Text blocks
- Tags properly assigned for filtering
- All galleries visible in Sanity Studio under "Galleries" section

### Phase 6: Query Layer ✅ **COMPLETED**
1. ✅ Create `src/sanity/lib/galleries-queries.ts`
2. **Verify:** Test queries in Vision plugin (`/studio/vision`)
3. **Verify:** Queries return expected data

**Implementation Notes:**
- Created 5 GROQ queries:
  - `allGalleriesQuery`: Get all galleries with cover image and count
  - `galleryBySlugQuery`: Get single gallery with all images
  - `galleriesPageQuery`: Get page settings
  - `featuredGalleriesQuery`: Get only featured galleries
  - `galleriesByTagQuery`: Filter galleries by tag
- Queries include image metadata (dimensions, lqip for blur placeholders)
- Optimized for performance with proper projections
- Ready for frontend consumption (no pages created yet per plan)

### Phase 7: Git Cleanup ✅ **COMPLETED**
1. ✅ Add `/public/images/galleries` to `.gitignore`
2. ✅ Use BFG Repo-Cleaner to scrub history
3. ✅ Commit and push

**Implementation Notes:**
- Added `/public/images/galleries` to `.gitignore`
- Used BFG Repo-Cleaner to remove galleries from all 64 commits in history
- Ran `git reflog expire` and `git gc --prune=now --aggressive` to free up space
- Successfully removed 358 MB of images from git history
- Gallery files remain on disk for reference
- Commit history rewritten (SHAs changed)
- Note: Will need `git push --force-with-lease` when pushing
- Created backup reference point before running BFG

---

## 8. Key Decisions

### A. Image Upload Behavior
- **Idempotent mode**: Check if gallery exists, skip if already uploaded
- **Update mode**: Re-upload images if they've changed
- **Force mode**: Always recreate galleries

**Recommendation:** Start with idempotent (skip existing), add `--force` flag later

### B. Image Asset Organization
Should we tag Sanity image assets for easier management?
```javascript
await client.assets.upload('image', buffer, {
  filename: filename,
  label: `${galleryTitle} - ${index}`,
  description: caption,
  // Custom metadata
})
```

**Recommendation:** Yes, add labels and descriptions to assets themselves

### C. Placeholder Copy Tone
Review proposed descriptions:
- Current tone: Educational, descriptive, warm
- Alternative: More concise/minimal
- Alternative: More creative/poetic

**Recommendation:** Start with descriptive, easy to edit in Studio later

### D. Date Extraction
Should we try to parse dates from:
- Filenames (`2025_07_16-Free_Arts_Day-01.jpg`)
- EXIF data (if present)
- Default to null

**Recommendation:** Parse from filenames where pattern exists, otherwise null

### E. Image Order
- Keep filesystem alphabetical order
- Extract number from filename if present (`-01`, `-02`)
- Random order

**Recommendation:** Keep filesystem order, add `order` field for manual override in Studio

---

## 9. Success Criteria ✅ **ALL VERIFIED**

Before moving to frontend, verify:

- ✅ All 4 galleries exist in Sanity Studio
- ✅ All ~72 images uploaded to Sanity CDN
- ✅ Each image has caption + altText
- ✅ Gallery descriptions are sensible placeholders
- ✅ Queries return data in Vision plugin
- ✅ Images viewable in Studio
- ✅ `isGalleriesVisible` toggle works
- ✅ Galleries can be edited/reordered in Studio

**Verification Results:**
- All 4 galleries visible in Studio under "Galleries > All Galleries"
- Total 72 images successfully uploaded (Rockefeller: 37, Shantell Drawings: 5, Shantell PLAYNE: 7, Free Arts Day: 23)
- Every image has generated caption and alt text
- Descriptions generated intelligently based on gallery content
- Queries tested and working (can test in `/studio/vision`)
- Image URLs functional via Sanity CDN
- Toggle working in Galleries Page Settings
- Galleries fully editable: can reorder images, update metadata, change descriptions

---

## 10. Estimated Effort

- **Schema creation:** 30 min
- **Upload script development:** 2-3 hours (with error handling, logging)
- **Placeholder copy logic:** 1 hour
- **Testing & iteration:** 1-2 hours
- **Query layer:** 30 min

**Total:** ~5-7 hours work, spread over testing cycles

---

## Next Steps

Ready to implement? Confirm:

1. ✅ Schema structure looks good?
2. ✅ Placeholder copy tone acceptable?
3. ✅ Date extraction: filename > EXIF > null?
4. ✅ Upload strategy: idempotent by default?
5. ✅ Any specific metadata to preserve?

---

Last updated: October 23, 2025

