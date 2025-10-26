// Save default config to Sanity for story-1
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('next-sanity')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const STORY1_DEFAULTS = {
  "headline": {
    "copyIdx": 0,
    "fg": "var(--brand-black)",
    "bg": "var(--brand-yellow)"
  },
  "photo0": {
    "gallerySlug": "shantell-martin-playne",
    "assetId": "image-6dea8898205814996463a0f3fa203d9eec5e4cb2-1000x667-jpg"
  },
  "photo": {
    "gallerySlug": "free-arts-day-2025",
    "assetId": "image-e1677c69aa63bd619bb89abcce1aab39800563f5-2048x1365-jpg"
  },
  "tbq": {
    "subBodyIdx": 0,
    "quoteIdx": 1
  },
  "path": {
    "width": 436,
    "height": 392,
    "bgColor": "#231f20",
    "pathCount": 3,
    "seed": 0.23194106757133026
  },
  "tbq2": {
    "subBodyIdx": 3,
    "quoteIdx": 3,
    "colorIdx": 3
  },
  "photo2": {
    "gallerySlug": "shantell-martin-playne",
    "assetId": "image-e533c7b585468baf66445ba2fdd95e7b8f323945-4128x2322-jpg"
  },
  "shape": {
    "seed": 0.17480261842131872
  },
  "headlineSub": {
    "hIdx": 4,
    "sIdx": 4,
    "align": "center",
    "bg": "var(--brand-yellow)",
    "fg": "var(--brand-black)"
  },
  "photo3": {
    "gallerySlug": "free-arts-day-2025",
    "assetId": "image-b81fa715fde217b8a15438f69c5cde5f6a6554b1-2048x1365-jpg"
  },
  "tbq3": {
    "subBodyIdx": 4,
    "quoteIdx": 0,
    "colorIdx": 1
  }
}

async function saveDefaults() {
  console.log('Saving Story 1 defaults to Sanity...\n')

  try {
    // Check if doc exists
    const existing = await client.fetch(
      `*[_type == "pageConfiguration" && pageSlug.current == "story-1"][0]{ _id }`
    )

    const docData = {
      _type: 'pageConfiguration',
      pageSlug: { _type: 'slug', current: 'story-1' },
      title: 'Story 1',
      metaDescription: 'Visual story collage #1 for PLAYNE',
      componentConfig: {
        configJson: JSON.stringify(STORY1_DEFAULTS, null, 2),
      },
      lastSavedAt: new Date().toISOString(),
      lastSavedBy: 'script',
    }

    if (existing) {
      console.log('Updating existing document:', existing._id)
      const result = await client.patch(existing._id).set(docData).commit()
      console.log('✓ Updated:', result._id)
    } else {
      console.log('Creating new document...')
      const result = await client.create(docData)
      console.log('✓ Created:', result._id)
    }

    console.log('\n✅ Defaults saved to Sanity!')
    console.log('View at: http://localhost:3000/studio')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

saveDefaults()

