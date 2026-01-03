// Standalone script to investigate Sanity image data
// Run with: node scripts/investigate-sanity-images.js

const { createClient } = require('@sanity/client')
const dotenv = require('dotenv')
const path = require('path')

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

// Hardcode for investigation
const PROJECT_ID = 'dg1810se'  // CORRECT project ID
const DATASET = 'production'

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  useCdn: false
})

console.log(`Using project: ${PROJECT_ID}, dataset: ${DATASET}\n`)

async function investigate() {
  console.log('=== SANITY IMAGE INVESTIGATION ===\n')
  
  try {
    // 1. Raw image assets
    console.log('1. Checking raw image assets...')
    const rawAssets = await client.fetch(`
      *[_type == "sanity.imageAsset"][0...3] {
        _id,
        url,
        originalFilename,
        metadata
      }
    `)
    console.log('\nFirst 3 image assets:')
    console.log(JSON.stringify(rawAssets, null, 2))
    
    // 2. Gallery structure
    console.log('\n\n2. Checking gallery structure...')
    const gallery = await client.fetch(`
      *[_type == "gallery"][0] {
        title,
        "imageCount": count(images),
        "firstImage": images[0] {
          _type,
          caption,
          altText,
          asset {
            _type,
            _ref
          }
        }
      }
    `)
    console.log('\nFirst gallery:')
    console.log(JSON.stringify(gallery, null, 2))
    
    // 3. Deep asset lookup
    console.log('\n\n3. Deep dive into image asset...')
    const deepDive = await client.fetch(`
      *[_type == "gallery"][0].images[0].asset._ref
    `)
    console.log('\nAsset reference:', deepDive)
    
    if (deepDive) {
      const assetData = await client.fetch(`
        *[_id == $ref][0] {
          _id,
          _type,
          url,
          originalFilename,
          metadata
        }
      `, { ref: deepDive })
      console.log('\nAsset data:')
      console.log(JSON.stringify(assetData, null, 2))
    }
    
    // 4. Counts
    console.log('\n\n4. Data counts...')
    const counts = await client.fetch(`{
      "totalGalleries": count(*[_type == "gallery"]),
      "totalImages": count(*[_type == "gallery"].images[]),
      "totalImageAssets": count(*[_type == "sanity.imageAsset"]),
      "assetsWithMetadata": count(*[_type == "sanity.imageAsset" && defined(metadata)]),
      "assetsWithDimensions": count(*[_type == "sanity.imageAsset" && defined(metadata.dimensions)])
    }`)
    console.log(JSON.stringify(counts, null, 2))
    
    // 5. Sample asset with dimensions (if any)
    console.log('\n\n5. Looking for assets WITH dimensions...')
    const withDimensions = await client.fetch(`
      *[_type == "sanity.imageAsset" && defined(metadata.dimensions)][0] {
        _id,
        originalFilename,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      }
    `)
    console.log(withDimensions ? JSON.stringify(withDimensions, null, 2) : 'NONE FOUND')
    
    console.log('\n\n=== INVESTIGATION COMPLETE ===\n')
    
  } catch (error) {
    console.error('ERROR:', error.message)
  }
}

investigate()

