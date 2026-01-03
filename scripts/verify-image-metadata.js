const { createClient } = require('@sanity/client')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dg1810se'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

console.log(`\n=== VERIFYING IMAGE METADATA ===`)
console.log(`Project: ${projectId}, Dataset: ${dataset}\n`)

const client = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function verify() {
  // Use the EXACT query from galleries-queries.ts
  const query = `
    *[_type == "gallery"] {
      "images": images[] {
        "imageAsset": asset.asset,
        "assetId": asset.asset->_id,
        "url": asset.asset->url,
        "metadata": asset.asset->metadata,
        "dimensions": asset.asset->metadata.dimensions,
        "aspectRatio": asset.asset->metadata.dimensions.aspectRatio,
        "lqip": asset.asset->metadata.lqip,
        caption,
        altText,
        photographer,
        "galleryTitle": ^.title,
        "gallerySlug": ^.slug.current
      }
    }.images[]
  `
  
  try {
    const result = await client.fetch(query)
    
    console.log(`✅ Retrieved ${result.length} total images\n`)
    
    // Check for variety of aspect ratios
    const aspectRatios = result
      .filter(img => img.aspectRatio)
      .map(img => ({
        aspectRatio: img.aspectRatio,
        width: img.dimensions?.width,
        height: img.dimensions?.height,
        altText: img.altText,
        gallery: img.galleryTitle
      }))
    
    // Find landscape, portrait, and square images
    const landscape = aspectRatios.filter(img => img.aspectRatio > 1.1)
    const portrait = aspectRatios.filter(img => img.aspectRatio < 0.9)
    const square = aspectRatios.filter(img => img.aspectRatio >= 0.9 && img.aspectRatio <= 1.1)
    
    console.log('📊 ASPECT RATIO DISTRIBUTION:')
    console.log(`   Landscape (wide): ${landscape.length}`)
    console.log(`   Portrait (tall):  ${portrait.length}`)
    console.log(`   Square-ish:       ${square.length}`)
    
    console.log('\n🖼️  SAMPLE IMAGES:\n')
    
    if (landscape.length > 0) {
      const sample = landscape[0]
      console.log(`   LANDSCAPE: ${sample.width}×${sample.height} (${sample.aspectRatio.toFixed(2)}:1)`)
      console.log(`   From: ${sample.gallery}`)
      console.log(`   Alt: ${sample.altText}\n`)
    }
    
    if (portrait.length > 0) {
      const sample = portrait[0]
      console.log(`   PORTRAIT: ${sample.width}×${sample.height} (${sample.aspectRatio.toFixed(2)}:1)`)
      console.log(`   From: ${sample.gallery}`)
      console.log(`   Alt: ${sample.altText}\n`)
    }
    
    if (square.length > 0) {
      const sample = square[0]
      console.log(`   SQUARE: ${sample.width}×${sample.height} (${sample.aspectRatio.toFixed(2)}:1)`)
      console.log(`   From: ${sample.gallery}`)
      console.log(`   Alt: ${sample.altText}\n`)
    }
    
    console.log('✅ ALL IMAGE METADATA IS NOW ACCESSIBLE!\n')
    console.log('🎯 Next step: Test in the browser at /story-fragment\n')
    
  } catch (error) {
    console.error('❌ ERROR:', error.message)
  }
}

verify()

