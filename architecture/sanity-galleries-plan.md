# Galleries in Sanity - Implementation Plan

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

### Phase 1: Schema Foundation ✅
1. Create `src/sanity/schemas/gallery.ts`
2. Create `src/sanity/schemas/galleriesPage.ts`
3. Update `src/sanity/schemas/index.ts` to export both
4. Update `sanity.config.ts` structure section
5. **Verify:** Visit `/studio`, see Galleries section appear

### Phase 2: Singleton Setup ✅
1. Create `scripts/populate-galleries-page.js`
2. Run script to create galleriesPage singleton
3. **Verify:** In Studio, edit Galleries Page Settings

### Phase 3: Test Upload ✅
1. Create `scripts/generate-galleries-manifest.js` (dry-run)
2. Run manifest to preview what will happen
3. **Verify:** Review output, confirm folder parsing is correct

### Phase 4: Single Gallery Test ✅
1. Create `scripts/populate-galleries-from-disk.js`
2. Add `--gallery` flag to test one gallery first
3. Run: `node scripts/populate-galleries-from-disk.js --gallery=shantell-drawings`
4. **Verify:** 
   - Check Studio for new gallery
   - Verify images uploaded
   - Check captions/metadata
   - Test image URLs work

### Phase 5: Batch Upload ✅
1. Run full script without flags
2. Upload all 4 galleries (~72 images total)
3. **Verify:** All galleries present in Studio

### Phase 6: Query Layer ✅
1. Create `src/sanity/lib/galleries-queries.ts`
2. Test queries in Vision plugin (`/studio/vision`)
3. **Verify:** Queries return expected data

### Phase 7: Git Cleanup ✅
1. Add `/public/images/galleries` to `.gitignore`
2. (Optional) Use `git filter-branch` or BFG Repo-Cleaner to scrub history
3. Commit and push

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

## 9. Success Criteria

Before moving to frontend, verify:

- ✅ All 4 galleries exist in Sanity Studio
- ✅ All ~72 images uploaded to Sanity CDN
- ✅ Each image has caption + altText
- ✅ Gallery descriptions are sensible placeholders
- ✅ Queries return data in Vision plugin
- ✅ Images viewable in Studio
- ✅ `isGalleriesVisible` toggle works
- ✅ Galleries can be edited/reordered in Studio

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

