const fs = require('fs')
const path = require('path')

const GALLERIES_DIR = 'public/images/galleries'

// Helper to check if file is an image
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase()
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)
}

// Helper to get file size in MB
function getFileSizeMB(filePath) {
  const stats = fs.statSync(filePath)
  return (stats.size / (1024 * 1024)).toFixed(2)
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
    return 'A collection documenting creative workshops and community engagement at Rockefeller Center. These images capture moments of hands-on learning, artistic expression, and young people exploring practical life skills in an iconic New York City setting.'
  }
  
  if (title.includes('Original Drawings')) {
    return "Original artworks by acclaimed visual artist Shantell Martin. These pieces showcase her signature black-and-white line drawings, exploring themes of identity, play, and human connection through spontaneous mark-making."
  }
  
  if (title.includes('Shantell Martin × PLAYNE')) {
    return 'A creative collaboration between visual artist Shantell Martin and PLAYNE, bringing together art and education to inspire young minds. These images document workshops and sessions where creativity becomes a tool for self-discovery and practical learning.'
  }
  
  if (title.includes('Free Arts Day')) {
    return "Celebrating Free Arts Day on July 16, 2025. Community members of all ages gathered to explore creativity, self-expression, and the joy of making art together. Captured by Yeasin's Gallery, these images document a day of vibrant artistic exploration and community connection."
  }
  
  return `A collection of images from ${title}${location ? ` at ${location}` : ''}.`
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
    const [, year, month, day, eventName, imageNum] = match
    const date = `${year}-${month}-${day}`
    const cleanEventName = eventName.replace(/_/g, ' ')
    metadata.caption = `${cleanEventName}, ${new Date(date).toLocaleDateString('en-US', { 
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

// Main manifest generation
function generateManifest() {
  console.log('📋 Generating galleries manifest...')
  console.log('Source directory:', path.resolve(GALLERIES_DIR))
  console.log('')
  
  if (!fs.existsSync(GALLERIES_DIR)) {
    console.error(`❌ Galleries directory not found: ${GALLERIES_DIR}`)
    process.exit(1)
  }
  
  const folders = fs.readdirSync(GALLERIES_DIR).filter(item => {
    const itemPath = path.join(GALLERIES_DIR, item)
    return fs.statSync(itemPath).isDirectory()
  })
  
  if (folders.length === 0) {
    console.error('❌ No gallery folders found')
    process.exit(1)
  }
  
  console.log(`📁 Found ${folders.length} gallery folders:\n`)
  
  const manifest = {}
  let totalImages = 0
  let totalSizeMB = 0
  
  folders.forEach(folderName => {
    const folderPath = path.join(GALLERIES_DIR, folderName)
    const files = fs.readdirSync(folderPath).filter(isImageFile)
    
    const galleryMeta = parseGalleryMetadata(folderName)
    const description = generateDescription(galleryMeta)
    
    const images = files.map((filename, index) => {
      const filePath = path.join(folderPath, filename)
      const sizeMB = parseFloat(getFileSizeMB(filePath))
      totalSizeMB += sizeMB
      
      const imageMeta = parseImageMetadata(filename, galleryMeta)
      const altText = generateAltText(galleryMeta, filename, imageMeta)
      
      return {
        filename,
        sizeMB,
        caption: imageMeta.caption,
        altText,
        photographer: imageMeta.photographer,
        order: index,
      }
    })
    
    totalImages += images.length
    
    manifest[folderName] = {
      ...galleryMeta,
      description,
      imageCount: images.length,
      totalSizeMB: images.reduce((sum, img) => sum + img.sizeMB, 0).toFixed(2),
      images: images.slice(0, 3), // Show first 3 as examples
      hasMoreImages: images.length > 3,
    }
    
    // Display summary
    console.log(`📂 ${galleryMeta.title}`)
    console.log(`   Slug: ${galleryMeta.slug}`)
    console.log(`   Images: ${images.length}`)
    console.log(`   Size: ${manifest[folderName].totalSizeMB} MB`)
    if (galleryMeta.date) console.log(`   Date: ${galleryMeta.date}`)
    if (galleryMeta.location) console.log(`   Location: ${galleryMeta.location}`)
    if (galleryMeta.photographer) console.log(`   Photographer: ${galleryMeta.photographer}`)
    console.log(`   Tags: ${galleryMeta.tags.join(', ')}`)
    console.log(`   Description: ${description.substring(0, 100)}...`)
    console.log('')
    console.log('   Sample images:')
    images.slice(0, 3).forEach((img, i) => {
      console.log(`     ${i + 1}. ${img.filename}`)
      console.log(`        Caption: "${img.caption}"`)
      console.log(`        Alt: "${img.altText}"`)
      console.log(`        Size: ${img.sizeMB} MB`)
    })
    if (images.length > 3) {
      console.log(`     ... and ${images.length - 3} more images`)
    }
    console.log('')
  })
  
  console.log('=' .repeat(60))
  console.log('📊 SUMMARY')
  console.log('='.repeat(60))
  console.log(`Total galleries: ${folders.length}`)
  console.log(`Total images: ${totalImages}`)
  console.log(`Total size: ${totalSizeMB.toFixed(2)} MB`)
  console.log('')
  console.log('✅ Manifest generation complete!')
  console.log('')
  console.log('💡 Next step: Review the output above, then run:')
  console.log('   node scripts/populate-galleries-from-disk.js')
  console.log('')
  
  // Optionally write JSON manifest to file
  const manifestPath = path.join('scripts', 'galleries-manifest.json')
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(`📝 Detailed manifest saved to: ${manifestPath}`)
}

// Run the script
try {
  generateManifest()
} catch (error) {
  console.error('❌ Error generating manifest:', error)
  process.exit(1)
}

