#!/usr/bin/env node

/**
 * Home Page population script based on context folder content
 * Run with: node scripts/populate-home-context.js
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

const homePageContent = {
  _id: 'homePage',
  _type: 'homePage',
  title: 'Welcome to PLAYNE',
  subtitle: 'Empowering young minds through practical life education',
  heroSection: {
    headline: 'Teaching the things we wish we learned in school',
    description: [
      {
        _key: 'hero-block-1',
        _type: 'block',
        children: [
          {
            _key: 'hero-span-1',
            _type: 'span',
            text: 'PLAYNE uses creativity to teach the things we wish we learned in school — how to care for our bodies, understand our emotions, manage money, and find our voice. Through playful, practical lessons rooted in art, we give young people the space to explore who they are before being told who to be.',
          },
        ],
        style: 'normal',
      },
    ],
    ctaButton: {
      text: 'Explore Our Programs',
      link: '/programs',
    },
  },
  introSection: {
    title: 'Our Vision',
    content: [
      {
        _key: 'intro-block-1',
        _type: 'block',
        children: [
          {
            _key: 'intro-span-1',
            _type: 'span',
            text: 'We believe every young person deserves the tools to thrive, not just in school, but in life. PLAYNE reimagines learning by putting curiosity, wellness, and self-discovery at the center.',
          },
        ],
        style: 'normal',
      },
      {
        _key: 'intro-block-2',
        _type: 'block',
        children: [
          {
            _key: 'intro-span-2',
            _type: 'span',
            text: 'Through hands-on experiences in classrooms and communities, we help students gain a deeper understanding of themselves and the world around them.',
          },
        ],
        style: 'normal',
      },
    ],
  },
  featuredPrograms: {
    title: 'Our Four Pillars of Education',
    description: 'PLAYNE\'s education framework is built on four essential pillars that prepare young people for real life through creative, hands-on learning.',
    programs: [
      {
        _key: 'program-anatomy',
        title: 'Anatomy & Body Awareness',
        description: 'We often only learn about our bodies when something goes wrong. PLAYNE classes teach whole-body awareness where students learn about anatomy, movement, and physical expression from head to toes that increases confidence and agility.',
        icon: '🩻',
        link: '/programs',
      },
      {
        _key: 'program-wellness',
        title: 'Wellness & Self-Care',
        description: 'In a time of constant distractions, our programs focus on cultivating mindfulness about ourselves and the world around us. By traveling within, students learn more about how to manage their feelings to reduce stress and anxiety.',
        icon: '🪷',
        link: '/programs',
      },
      {
        _key: 'program-nutrition',
        title: 'Nutrition & Healthy Living',
        description: 'Nourishing our bodies starts with knowing what we need to feel our best. Learning about the building blocks of food we eat — how things grow, where our food comes from, and what we need to have a nutritious meal — is a vital part of creating a full life.',
        icon: '🫐',
        link: '/programs',
      },
      {
        _key: 'program-financial',
        title: 'Financial Literacy',
        description: 'By building a foundation of financial awareness, we design and nurture the vital decision-making skills that help students understand how to invest in themselves and plan for their futures.',
        icon: '💸',
        link: '/programs',
      },
    ],
  },
  callToActionSection: {
    title: 'Join the PLAYNE Community',
    description: 'Ready to bring creative, practical life education to your classroom or community? Let\'s work together to empower the next generation.',
    primaryButton: {
      text: 'Get Involved',
      link: '/get-involved',
    },
    secondaryButton: {
      text: 'Support Our Mission',
      link: '/support',
    },
  },
  seo: {
    metaTitle: 'PLAYNE - Teaching Life Skills Through Creativity and Art',
    metaDescription: 'PLAYNE uses creativity to teach practical life skills like anatomy & body awareness, wellness & self-care, nutrition, and financial literacy. Empowering young minds through art-based education.',
  },
}

async function populateHomePage() {
  try {
    console.log('🏠 Creating Home Page content based on context materials...')
    
    // First, try to delete any existing homePage documents
    const existingDocs = await client.fetch('*[_type == "homePage"]')
    
    if (existingDocs.length > 0) {
      console.log(`📝 Found ${existingDocs.length} existing homePage document(s), removing them...`)
      
      for (const doc of existingDocs) {
        await client.delete(doc._id)
        console.log(`🗑️  Deleted existing document: ${doc._id}`)
      }
    }
    
    // Create the new document with our desired ID
    const result = await client.create(homePageContent)
    
    console.log('✅ Home Page content created successfully!')
    console.log('📄 Document ID:', result._id)
    console.log('')
    console.log('📋 Content Summary:')
    console.log('   🎯 Hero: Mission-driven headline with CTA')
    console.log('   👁️  Vision: PLAYNE\'s educational philosophy')
    console.log('   🏛️  Four Pillars: Anatomy, Wellness, Nutrition, Financial Literacy')
    console.log('   🤝 Call to Action: Get Involved + Support buttons')
    console.log('')
    console.log('🔗 Visit http://localhost:3000/studio to see your content')
    console.log('🌐 Visit http://localhost:3000 to see the homepage')
    
  } catch (error) {
    console.error('❌ Error creating Home Page content:', error.message)
    
    if (error.message.includes('token')) {
      console.log('\n💡 Make sure you have SANITY_API_KEY in your .env.local file')
      console.log('Get it from: https://www.sanity.io/manage → Your Project → API → Tokens')
    }
  }
}

populateHomePage()
