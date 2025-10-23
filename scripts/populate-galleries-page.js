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

const galleriesPageContent = {
  _id: 'galleriesPage',
  _type: 'galleriesPage',
  title: 'Galleries',
  subtitle: 'Moments of creativity, learning, and community',
  description: [
    {
      _type: 'block',
      _key: 'intro1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'intro1span',
          text: 'Explore our collection of galleries documenting PLAYNE\'s workshops, collaborations, and community events. These images capture moments of hands-on learning, artistic expression, and young people discovering practical life skills through creativity.',
          marks: [],
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      _key: 'intro2',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'intro2span',
          text: 'From artist collaborations to community gatherings, each gallery tells a story of learning, growth, and connection.',
          marks: [],
        },
      ],
      markDefs: [],
    },
  ],
  isGalleriesVisible: false, // Initially hidden until galleries are populated
  seo: {
    metaTitle: 'Galleries - PLAYNE',
    metaDescription: 'Explore photo galleries from PLAYNE workshops, artist collaborations, and community events. See creativity and practical life education in action.',
  },
}

async function populateGalleriesPage() {
  try {
    console.log('🎨 Populating Galleries page content...')
    
    // Check if galleries page already exists
    const existingGalleriesPage = await client.fetch('*[_type == "galleriesPage"][0]')
    
    if (existingGalleriesPage) {
      console.log('📝 Updating existing Galleries page...')
      const result = await client
        .patch(existingGalleriesPage._id)
        .set(galleriesPageContent)
        .commit()
      console.log('✅ Galleries page updated successfully!')
      console.log('Document ID:', result._id)
    } else {
      console.log('📝 Creating new Galleries page...')
      const result = await client.createOrReplace(galleriesPageContent)
      console.log('✅ Galleries page created successfully!')
      console.log('Document ID:', result._id)
    }
    
    console.log('')
    console.log('📌 Note: Galleries page is initially hidden (isGalleriesVisible: false)')
    console.log('   You can enable it in Sanity Studio after populating galleries.')
    console.log('')
    console.log('🎉 Galleries page content population complete!')
    console.log('')
    console.log('💡 Next step: Run populate-galleries-from-disk.js to upload gallery images')
    
  } catch (error) {
    console.error('❌ Error populating Galleries page content:', error)
    process.exit(1)
  }
}

// Run the script
populateGalleriesPage()

