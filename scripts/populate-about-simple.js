#!/usr/bin/env node

/**
 * Simple About Page population script
 * Run with: node scripts/populate-about-simple.js
 */

const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

// Check required environment variables
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
  process.exit(1)
}

if (!process.env.SANITY_API_KEY) {
  console.error('❌ Missing SANITY_API_KEY in .env.local')
  console.log('💡 Get your API key from: https://www.sanity.io/manage → Your Project → API → Tokens')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_KEY,
})

const aboutPageContent = {
  _id: 'aboutPage',
  _type: 'aboutPage',
  title: 'About PLAYNE',
  subtitle: 'Empowering young minds through practical life education',
  mission: {
    title: 'Our Mission',
    content: [
      {
        _key: 'mission-block-1',
        _type: 'block',
        children: [
          {
            _key: 'mission-span-1',
            _type: 'span',
            text: 'PLAYNE uses creativity to teach the things we wish we learned in school — how to care for our bodies, understand our emotions, manage money, and find our voice. Through playful, practical lessons rooted in art, we give young people the space to explore who they are before being told who to be.',
          },
        ],
        style: 'normal',
      },
    ],
  },
  story: {
    title: 'Our Story',
    content: [
      {
        _key: 'story-block-1',
        _type: 'block',
        children: [
          {
            _key: 'story-span-1',
            _type: 'span',
            text: 'We believe every young person deserves the tools to thrive, not just in school, but in life. PLAYNE reimagines learning by putting curiosity, wellness, and self-discovery at the center.',
          },
        ],
        style: 'normal',
      },
      {
        _key: 'story-block-2',
        _type: 'block',
        children: [
          {
            _key: 'story-span-2',
            _type: 'span',
            text: 'Through hands-on experiences in classrooms and communities, we help students gain a deeper understanding of themselves and the world around them.',
          },
        ],
        style: 'normal',
      },
    ],
  },
  team: {
    title: 'Our Team',
    content: [
      {
        _key: 'team-block-1',
        _type: 'block',
        children: [
          {
            _key: 'team-span-1',
            _type: 'span',
            text: 'Our team is passionate about reimagining education and empowering young people with practical life skills.',
          },
        ],
        style: 'normal',
      },
    ],
    members: [
      {
        _key: 'team-member-1',
        name: 'Team Member',
        role: 'Founder & Educator',
        bio: 'Passionate about creative education and empowering young minds.',
      },
    ],
  },
  seo: {
    metaTitle: 'About PLAYNE - Empowering Young Minds Through Creative Education',
    metaDescription: 'Learn about PLAYNE\'s mission to teach practical life skills through creativity, wellness, and self-discovery.',
  },
}

async function populateAboutPage() {
  try {
    console.log('🌱 Creating About Page content...')
    
    // First, try to delete any existing aboutPage documents
    const existingDocs = await client.fetch('*[_type == "aboutPage"]')
    
    if (existingDocs.length > 0) {
      console.log(`📝 Found ${existingDocs.length} existing aboutPage document(s), removing them...`)
      
      for (const doc of existingDocs) {
        await client.delete(doc._id)
        console.log(`🗑️  Deleted existing document: ${doc._id}`)
      }
    }
    
    // Create the new document with our desired ID
    const result = await client.create(aboutPageContent)
    
    console.log('✅ About Page content created successfully!')
    console.log('📄 Document ID:', result._id)
    console.log('🔗 Visit http://localhost:3000/studio to see your content')
    console.log('🌐 Visit http://localhost:3000/about to see the page')
    
  } catch (error) {
    console.error('❌ Error creating About Page content:', error.message)
    
    if (error.message.includes('token')) {
      console.log('\n💡 Make sure you have SANITY_API_TOKEN in your .env.local file')
      console.log('Get it from: https://www.sanity.io/manage → Your Project → API → Tokens')
    }
  }
}

populateAboutPage()
