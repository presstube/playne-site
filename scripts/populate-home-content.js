#!/usr/bin/env node

/**
 * Populate Home Page content in Sanity
 * Run with: node scripts/populate-home-content.js
 */

const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // You'll need to add this for write operations
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
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'PLAYNE uses creativity to teach practical life skills — how to care for our bodies, understand our emotions, manage money, and find our voice. Through playful, art-based lessons, we give young people the space to explore who they are before being told who to be.',
          },
        ],
        style: 'normal',
      },
    ],
    ctaButton: {
      text: 'Learn About Our Programs',
      link: '/programs',
    },
  },
  introSection: {
    title: 'About PLAYNE',
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'We believe every young person deserves the tools to thrive, not just in school, but in life. PLAYNE reimagines learning by putting curiosity, wellness, and self-discovery at the center.',
          },
        ],
        style: 'normal',
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Through hands-on experiences in classrooms and communities, we help students gain a deeper understanding of themselves and the world around them.',
          },
        ],
        style: 'normal',
      },
    ],
  },
  featuredPrograms: {
    title: 'Our Programs',
    description: 'Discover our curriculum pillars that blend creativity with practical life skills',
    programs: [
      {
        title: 'Wellness & Anatomy',
        description: 'Understanding our bodies and minds through creative exploration and practical knowledge.',
        icon: '🧠',
        link: '/programs',
      },
      {
        title: 'Nutrition & Food',
        description: 'Learning about healthy eating, cooking, and our relationship with food.',
        icon: '🥗',
        link: '/programs',
      },
      {
        title: 'Financial Awareness',
        description: 'Building money management skills and understanding financial systems.',
        icon: '💰',
        link: '/programs',
      },
      {
        title: 'Creative Expression',
        description: 'Finding your voice through art, storytelling, and creative projects.',
        icon: '🎨',
        link: '/programs',
      },
    ],
  },
  callToActionSection: {
    title: 'Get Involved',
    description: 'Join us in reimagining education and empowering the next generation.',
    primaryButton: {
      text: 'Partner With Us',
      link: '/get-involved',
    },
    secondaryButton: {
      text: 'Support PLAYNE',
      link: '/support',
    },
  },
  seo: {
    metaTitle: 'PLAYNE - Empowering Young Minds Through Practical Life Education',
    metaDescription: 'PLAYNE uses creativity to teach practical life skills like wellness, nutrition, financial awareness, and self-expression. Discover our innovative educational approach.',
  },
}

async function populateHomeContent() {
  try {
    console.log('🏠 Populating Home Page content...')
    
    const result = await client.createOrReplace(homePageContent)
    
    console.log('✅ Home Page content created successfully!')
    console.log('📄 Document ID:', result._id)
    
  } catch (error) {
    console.error('❌ Error populating Home Page content:', error.message)
    
    if (error.message.includes('token')) {
      console.log('\n💡 To populate content, you need a Sanity API token with write permissions:')
      console.log('1. Go to https://www.sanity.io/manage')
      console.log('2. Select your project')
      console.log('3. Go to API > Tokens')
      console.log('4. Create a token with "Editor" permissions')
      console.log('5. Add it to your .env.local file as SANITY_API_TOKEN=your-token-here')
    }
  }
}

// Run the script
populateHomeContent()
