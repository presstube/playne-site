#!/usr/bin/env node

/**
 * Support Page population script based on context folder content
 * Run with: node scripts/populate-support-context.js
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

const supportPageContent = {
  _id: 'supportPage',
  _type: 'supportPage',
  title: 'Support PLAYNE',
  subtitle: 'Help us expand access to creative life skills education',
  donationSection: {
    title: 'Make a Donation',
    description: 'Your support helps us bring practical life education to more young people through creative, art-based learning experiences.',
    content: [
      {
        _key: 'donation-block-1',
        _type: 'block',
        children: [
          {
            _key: 'donation-span-1',
            _type: 'span',
            text: 'PLAYNE uses creativity to teach the things we wish we learned in school — how to care for our bodies, understand our emotions, manage money, and find our voice. Your donation directly supports curriculum development, teacher training, and program delivery in schools and community spaces.',
          },
        ],
        style: 'normal',
      },
      {
        _key: 'donation-block-2',
        _type: 'block',
        children: [
          {
            _key: 'donation-span-2',
            _type: 'span',
            text: 'Every contribution helps us create more opportunities for young people to explore who they are before being told who to be.',
          },
        ],
        style: 'normal',
      },
    ],
    donationTiers: [
      {
        _key: 'tier-25',
        amount: '$25',
        title: 'Art Supply Supporter',
        description: 'Provides art materials for one student for a complete 4-pillar curriculum experience.',
        benefits: [
          'Recognition on our website',
          'Quarterly impact updates'
        ]
      },
      {
        _key: 'tier-50',
        amount: '$50',
        title: 'Workshop Enabler',
        description: 'Funds one student\'s participation in a complete workshop series covering anatomy, wellness, nutrition, and financial literacy.',
        benefits: [
          'Recognition on our website',
          'Quarterly impact updates',
          'Access to exclusive educator resources',
          'Lesson plan updates'
        ]
      },
      {
        _key: 'tier-100',
        amount: '$100',
        title: 'Classroom Champion',
        description: 'Supports materials and facilitation for an entire classroom workshop, reaching 20-25 students with hands-on creative learning.',
        benefits: [
          'Recognition on our website',
          'Quarterly impact updates',
          'Access to exclusive educator resources',
          'Lesson plan updates',
          'Invitation to annual supporter appreciation event'
        ]
      },
      {
        _key: 'tier-250',
        amount: '$250',
        title: 'Community Builder',
        description: 'Enables a complete program rollout in a community center or after-school program, impacting 50+ young learners.',
        benefits: [
          'Recognition on our website',
          'Quarterly impact updates',
          'Access to exclusive educator resources',
          'Lesson plan updates',
          'Invitation to annual supporter appreciation event',
          'Personalized impact report showing your donation\'s direct effect'
        ]
      },
      {
        _key: 'tier-500',
        amount: '$500',
        title: 'Program Pioneer',
        description: 'Funds teacher training and curriculum development, creating sustainable impact that reaches hundreds of students.',
        benefits: [
          'Recognition on our website',
          'Quarterly impact updates',
          'Access to exclusive educator resources',
          'Lesson plan updates',
          'Invitation to annual supporter appreciation event',
          'Personalized impact report showing your donation\'s direct effect',
          'Opportunity for site visit and direct connection with program participants'
        ]
      }
    ]
  },
  sponsorshipSection: {
    title: 'Corporate Sponsorship',
    description: 'Partner with PLAYNE to demonstrate your commitment to innovative education and community impact.',
    content: [
      {
        _key: 'sponsor-block-1',
        _type: 'block',
        children: [
          {
            _key: 'sponsor-span-1',
            _type: 'span',
            text: 'Corporate sponsorship helps us scale our impact while providing your organization with meaningful community engagement opportunities and brand alignment with creative education innovation.',
          },
        ],
        style: 'normal',
      },
    ],
    sponsorshipLevels: [
      {
        _key: 'sponsor-bronze',
        level: 'Bronze',
        title: 'Community Partner',
        description: 'Support local program delivery and community workshops.',
        minAmount: '$1,000',
        benefits: [
          'Logo recognition on website and program materials',
          'Quarterly impact reports',
          'Social media acknowledgment'
        ]
      },
      {
        _key: 'sponsor-silver',
        title: 'Education Advocate',
        level: 'Silver',
        description: 'Fund curriculum development and teacher training initiatives.',
        minAmount: '$2,500',
        benefits: [
          'Logo recognition on website and program materials',
          'Quarterly impact reports',
          'Social media acknowledgment',
          'Co-branded workshop opportunities',
          'Employee volunteer experiences',
          'Annual impact presentation'
        ]
      },
      {
        _key: 'sponsor-gold',
        level: 'Gold',
        title: 'Innovation Leader',
        description: 'Champion new program development and research initiatives.',
        minAmount: '$5,000',
        benefits: [
          'Logo recognition on website and program materials',
          'Quarterly impact reports',
          'Social media acknowledgment',
          'Co-branded workshop opportunities',
          'Employee volunteer experiences',
          'Annual impact presentation',
          'Naming opportunities',
          'Advisory board participation',
          'Custom program development consultation'
        ]
      }
    ]
  },
  impactSection: {
    title: 'Your Impact',
    description: 'See how your support translates into real change in young people\'s lives.',
    impactStats: [
      {
        _key: 'stat-students',
        number: '500+',
        label: 'Students Reached',
        description: 'Young learners who have participated in PLAYNE workshops and curriculum experiences.'
      },
      {
        _key: 'stat-educators',
        number: '50+',
        label: 'Educators Trained',
        description: 'Teachers and facilitators equipped with PLAYNE\'s creative life skills methodology.'
      },
      {
        _key: 'stat-schools',
        number: '15+',
        label: 'Partner Schools',
        description: 'Educational institutions integrating PLAYNE curriculum into their programs.'
      },
      {
        _key: 'stat-workshops',
        number: '100+',
        label: 'Workshops Delivered',
        description: 'Hands-on learning experiences covering anatomy, wellness, nutrition, and financial literacy.'
      }
    ]
  },
  seo: {
    metaTitle: 'Support PLAYNE - Donate to Creative Life Skills Education',
    metaDescription: 'Support PLAYNE\'s mission to teach practical life skills through creativity. Your donation helps bring art-based education covering anatomy, wellness, nutrition, and financial literacy to young learners.',
  },
}

async function populateSupportPage() {
  try {
    console.log('💝 Creating Support Page content based on context materials...')
    
    // First, try to delete any existing supportPage documents
    const existingDocs = await client.fetch('*[_type == "supportPage"]')
    
    if (existingDocs.length > 0) {
      console.log(`📝 Found ${existingDocs.length} existing supportPage document(s), removing them...`)
      
      for (const doc of existingDocs) {
        await client.delete(doc._id)
        console.log(`🗑️  Deleted existing document: ${doc._id}`)
      }
    }
    
    // Create the new document with our desired ID
    const result = await client.create(supportPageContent)
    
    console.log('✅ Support Page content created successfully!')
    console.log('📄 Document ID:', result._id)
    console.log('')
    console.log('📋 Content Summary:')
    console.log('   💝 Donation Tiers: 5 levels from $25 to $500+')
    console.log('   🏢 Corporate Sponsorship: Bronze, Silver, Gold levels')
    console.log('   📊 Impact Statistics: Students, educators, schools, workshops')
    console.log('   🎯 Focus: Creative life skills education funding')
    console.log('   💡 Benefits: Recognition, resources, exclusive access')
    console.log('')
    console.log('🔗 Visit http://localhost:3000/studio to see your content')
    console.log('🌐 Visit http://localhost:3000/support to see the page')
    
  } catch (error) {
    console.error('❌ Error creating Support Page content:', error.message)
    
    if (error.message.includes('token')) {
      console.log('\n💡 Make sure you have SANITY_API_KEY in your .env.local file')
      console.log('Get it from: https://www.sanity.io/manage → Your Project → API → Tokens')
    }
  }
}

populateSupportPage()
