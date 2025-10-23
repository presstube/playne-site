const fs = require('fs')
const path = require('path')
const { createClient } = require('@sanity/client')

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

// Check required environment variables
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
  process.exit(1)
}

if (!process.env.SANITY_API_KEY) {
  console.error('❌ Missing SANITY_API_KEY in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_KEY,
  apiVersion: '2024-01-01',
})

const GALLERIES_DIR = 'public/images/galleries'

// Parse command line arguments
const args = process.argv.slice(2)
const galleryFilter = args.find(arg => arg.startsWith('--gallery='))?.split('=')[1]
const forceMode = args.includes('--force')

// Helper to check if file is an image
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase()
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)
}

// Smart folder name parsing
function parseGalleryMetadata(folderName) {
  const folderLower = folderName.toLowerCase()
  
  // Special cases
  if (folderLower === 'rockerfeller' || folderLower === 'rockefeller') {
    return {
      title: 'Rockefeller Center Collection',
      slug: 'rockefeller-center',
      photographer: 'Kat Harris',
      location: 'Rockefeller Center, New York City',
      tags: ['workshop', 'nyc', 'community', 'art-sundae'],
    }
  }
  
  if (folderLower === 'shantell-drawings') {
    return {
      title: 'Shantell Martin: Original Drawings',
      slug: 'shantell-martin-drawings',
      photographer: 'Shantell Martin',
      tags: ['artist-collaboration', 'drawings', 'artwork', 'shantell-martin'],
    }
  }
  
  if (folderLower === 'shantell-playne') {
    return {
      title: 'Shantell Martin × PLAYNE',
      slug: 'shantell-martin-playne',
      photographer: 'Shantell Martin',
      tags: ['artist-collaboration', 'workshop', 'playne', 'shantell-martin'],
    }
  }
  
  if (folderLower === 'yeasin') {
    return {
      title: 'Free Arts Day 2025',
      slug: 'free-arts-day-2025',
      photographer: "Yeasin's Gallery",
      date: '2025-07-16',
      location: 'Community Arts Center',
      tags: ['event', 'community', 'free-arts-day', 'yeasin'],
    }
  }
  
  // Default case: title-case the folder name
  const title = folderName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  return {
    title,
    slug: folderName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    tags: [folderName.toLowerCase()],
  }
}

// Generate description based on gallery metadata
function generateDescription(metadata) {
  const { title, location } = metadata
  
  if (title.includes('Rockefeller')) {
    return [
      {
        _type: 'block',
        _key: 'desc1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'desc1span',
            text: 'A collection documenting creative workshops and community engagement at Rockefeller Center. These images capture moments of hands-on learning, artistic expression, and young people exploring practical life skills in an iconic New York City setting.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ]
  }
  
  if (title.includes('Original Drawings')) {
    return [
      {
        _type: 'block',
        _key: 'desc1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'desc1span',
            text: "Original artworks by acclaimed visual artist Shantell Martin. These pieces showcase her signature black-and-white line drawings, exploring themes of identity, play, and human connection through spontaneous mark-making.",
            marks: [],
          },
        ],
        markDefs: [],
      },
    ]
  }
  
  if (title.includes('Shantell Martin × PLAYNE')) {
    return [
      {
        _type: 'block',
        _key: 'desc1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'desc1span',
            text: 'A creative collaboration between visual artist Shantell Martin and PLAYNE, bringing together art and education to inspire young minds. These images document workshops and sessions where creativity becomes a tool for self-discovery and practical learning.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ]
  }
  
  if (title.includes('Free Arts Day')) {
    return [
      {
        _type: 'block',
        _key: 'desc1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'desc1span',
            text: "Celebrating Free Arts Day on July 16, 2025. Community members of all ages gathered to explore creativity, self-expression, and the joy of making art together. Captured by Yeasin's Gallery, these images document a day of vibrant artistic exploration and community connection.",
            marks: [],
          },
        ],
        markDefs: [],
      },
    ]
  }
  
  return [
    {
      _type: 'block',
      _key: 'desc1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'desc1span',
          text: `A collection of images from ${title}${location ? ` at ${location}` : ''}.`,
          marks: [],
        },
      ],
      markDefs: [],
    },
  ]
}

// Parse filename for metadata
function parseImageMetadata(filename, galleryMetadata) {
  const metadata = {
    caption: null,
    photographer: galleryMetadata.photographer,
  }
  
  // Pattern: 2025_07_16-Free_Arts_Day-01-by_yeasinsgallery.jpg
  const yeasinPattern = /^(\d{4})_(\d{2})_(\d{2})-(.+?)-(\d+)-by_(.+)\.(jpg|jpeg|png)$/i
  const match = filename.match(yeasinPattern)
  
  if (match) {
    const [, year, month, day, eventName] = match
    const date = new Date(`${year}-${month}-${day}`)
    const cleanEventName = eventName.replace(/_/g, ' ')
    metadata.caption = `${cleanEventName}, ${date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`
    return metadata
  }
  
  // Pattern: Shantell_Martin_Playne-3.jpg
  if (filename.includes('Shantell_Martin')) {
    const numMatch = filename.match(/-(\d+)\./)
    metadata.caption = numMatch 
      ? `Shantell Martin × PLAYNE collaboration (Image ${numMatch[1]})`
      : 'Shantell Martin × PLAYNE collaboration'
    return metadata
  }
  
  // Pattern: DR2043-image.jpg (drawing catalog numbers)
  const drPattern = /^(DR|IN)(\d+)/i
  const drMatch = filename.match(drPattern)
  if (drMatch) {
    metadata.caption = `Drawing ${drMatch[1].toUpperCase()}${drMatch[2]}`
    return metadata
  }
  
  // Pattern: Rockefeller photos with date
  if (filename.includes('2024-Art_Sundae')) {
    metadata.caption = 'Art Sundae at Rockefeller Center, 2024'
    metadata.photographer = 'Kat Harris, Courtesy of Rockefeller Center'
    return metadata
  }
  
  // Default: use gallery title
  metadata.caption = `Image from ${galleryMetadata.title}`
  return metadata
}

// Generate alt text
function generateAltText(galleryMetadata, filename, imageMetadata) {
  if (imageMetadata.caption) {
    return imageMetadata.caption
  }
  return `Photo from ${galleryMetadata.title}`
}

// Upload a single gallery
async function uploadGallery(folderName) {
  const folderPath = path.join(GALLERIES_DIR, folderName)
  const imageFiles = fs.readdirSync(folderPath).filter(isImageFile)
  
  if (imageFiles.length === 0) {
    console.log(`⏭️  Skipping ${folderName} - no images found`)
    return { skipped: true }
  }
  
  const galleryMeta = parseGalleryMetadata(folderName)
  const galleryId = `gallery-${galleryMeta.slug}`
  
  console.log('')
  console.log(`📁 Processing gallery: ${galleryMeta.title}`)
  console.log(`   Found ${imageFiles.length} images`)
  
  // Check if gallery already exists
  const existingGallery = await client.fetch(`*[_type == "gallery" && _id == "${galleryId}"][0]`)
  
  if (existingGallery && !forceMode) {
    console.log(`⏭️  Gallery already exists (use --force to re-upload)`)
    return { skipped: true, exists: true }
  }
  
  if (existingGallery && forceMode) {
    console.log(`🔄 Force mode: Re-creating gallery`)
  }
  
  // Upload all images to Sanity
  console.log(`   ⬆️  Uploading images to Sanity...`)
  const uploadedImages = []
  
  for (let i = 0; i < imageFiles.length; i++) {
    const filename = imageFiles[i]
    const filePath = path.join(folderPath, filename)
    
    process.stdout.write(`\r   Uploading ${i + 1}/${imageFiles.length}: ${filename.substring(0, 40)}...`)
    
    try {
      const buffer = fs.readFileSync(filePath)
      const asset = await client.assets.upload('image', buffer, {
        filename: filename,
        label: `${galleryMeta.title} - Image ${i + 1}`,
      })
      
      const imageMeta = parseImageMetadata(filename, galleryMeta)
      const altText = generateAltText(galleryMeta, filename, imageMeta)
      
      uploadedImages.push({
        _type: 'object',
        _key: `img-${Date.now()}-${i}`,
        asset: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        },
        caption: imageMeta.caption || '',
        altText: altText,
        order: i,
        photographer: imageMeta.photographer,
      })
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`\n   ❌ Error uploading ${filename}:`, error.message)
    }
  }
  
  console.log(`\r   ✅ Uploaded ${uploadedImages.length}/${imageFiles.length} images successfully`)
  
  // Create gallery document
  const description = generateDescription(galleryMeta)
  
  const gallery = {
    _id: galleryId,
    _type: 'gallery',
    title: galleryMeta.title,
    slug: { _type: 'slug', current: galleryMeta.slug },
    description: description,
    images: uploadedImages,
    date: galleryMeta.date || null,
    location: galleryMeta.location || null,
    photographer: galleryMeta.photographer || null,
    tags: galleryMeta.tags,
    featured: false,
    seo: {
      metaTitle: `${galleryMeta.title} - PLAYNE Galleries`,
      metaDescription: description[0].children[0].text.substring(0, 160),
    },
  }
  
  await client.createOrReplace(gallery)
  console.log(`   ✅ Created gallery document: ${galleryMeta.title}`)
  
  return {
    success: true,
    title: galleryMeta.title,
    slug: galleryMeta.slug,
    imageCount: uploadedImages.length,
  }
}

// Main upload function
async function uploadGalleries() {
  try {
    console.log('🎨 PLAYNE Galleries Upload Script')
    console.log('='.repeat(60))
    
    if (galleryFilter) {
      console.log(`📌 Filtering: Only uploading gallery "${galleryFilter}"`)
    }
    
    if (forceMode) {
      console.log('⚠️  Force mode: Will re-create existing galleries')
    }
    
    console.log('')
    
    if (!fs.existsSync(GALLERIES_DIR)) {
      console.error(`❌ Galleries directory not found: ${GALLERIES_DIR}`)
      process.exit(1)
    }
    
    let folders = fs.readdirSync(GALLERIES_DIR).filter(item => {
      const itemPath = path.join(GALLERIES_DIR, item)
      return fs.statSync(itemPath).isDirectory()
    })
    
    if (galleryFilter) {
      folders = folders.filter(f => f === galleryFilter || parseGalleryMetadata(f).slug === galleryFilter)
      if (folders.length === 0) {
        console.error(`❌ Gallery "${galleryFilter}" not found`)
        console.log('\nAvailable galleries:')
        fs.readdirSync(GALLERIES_DIR)
          .filter(item => fs.statSync(path.join(GALLERIES_DIR, item)).isDirectory())
          .forEach(f => console.log(`  - ${f}`))
        process.exit(1)
      }
    }
    
    console.log(`📂 Found ${folders.length} gallery folder${folders.length !== 1 ? 's' : ''} to process`)
    
    const results = []
    
    for (const folderName of folders) {
      const result = await uploadGallery(folderName)
      results.push(result)
    }
    
    // Summary
    console.log('')
    console.log('='.repeat(60))
    console.log('📊 UPLOAD SUMMARY')
    console.log('='.repeat(60))
    
    const successful = results.filter(r => r.success)
    const skipped = results.filter(r => r.skipped)
    
    if (successful.length > 0) {
      console.log(`✅ Successfully uploaded ${successful.length} ${successful.length !== 1 ? 'galleries' : 'gallery'}:`)
      successful.forEach(r => {
        console.log(`   • ${r.title} (${r.imageCount} images)`)
      })
    }
    
    if (skipped.length > 0) {
      console.log(`⏭️  Skipped ${skipped.length} ${skipped.length !== 1 ? 'galleries' : 'gallery'}`)
    }
    
    console.log('')
    console.log('🎉 Upload complete!')
    console.log('')
    console.log('💡 Next steps:')
    console.log('   1. Visit http://localhost:3000/studio to view galleries in Sanity')
    console.log('   2. Edit gallery details, reorder images, or add more info')
    console.log('   3. Enable gallery visibility in Galleries Page Settings when ready')
    console.log('')
    
  } catch (error) {
    console.error('❌ Error uploading galleries:', error)
    process.exit(1)
  }
}

// Run the script
uploadGalleries()

