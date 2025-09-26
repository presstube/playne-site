#!/usr/bin/env node

/**
 * Get Involved Page population script based on context folder content
 * Run with: node scripts/populate-get-involved-context.js
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

const getInvolvedPageContent = {
  _id: 'getInvolvedPage',
  _type: 'getInvolvedPage',
  title: 'Get Involved',
  subtitle: 'Join us in reimagining education and empowering the next generation',
  partnersSection: {
    title: 'Partners & Collaborators',
    description: 'PLAYNE works with educators, families, and community leaders to bring creative life skills education to diverse learning environments. We believe in collaborative approaches that strengthen classroom and community connections.',
    partnerTypes: [
      {
        _key: 'partner-educators',
        title: 'Educators & Schools',
        description: 'Teachers, administrators, and educational institutions looking to integrate creative life skills into their curriculum. Perfect for schools, after-school programs, and educational nonprofits.'
      },
      {
        _key: 'partner-community',
        title: 'Community Organizations',
        description: 'Community centers, libraries, youth programs, and cultural organizations interested in offering hands-on creative learning experiences that build practical life skills.'
      },
      {
        _key: 'partner-families',
        title: 'Families & Caregivers',
        description: 'Parents, guardians, and family educators who want to support whole-body wellbeing and self-discovery through art-based activities at home or in family groups.'
      },
      {
        _key: 'partner-artists',
        title: 'Artists & Creatives',
        description: 'Teaching artists, creative professionals, and arts educators interested in collaborating on curriculum development or workshop facilitation.'
      }
    ],
    currentPartners: [
      {
        _key: 'partner-akm',
        name: 'Buffalo AKG Art Museum',
        description: 'Collaborative programming featuring Shantell Martin\'s work in educational settings.',
        website: 'https://buffaloakg.org'
      }
    ]
  },
  interestFormSection: {
    title: 'Express Your Interest',
    description: 'Ready to bring PLAYNE\'s creative approach to life skills education to your community? Let us know how you\'d like to get involved.',
    formFields: {
      nameLabel: 'Full Name',
      emailLabel: 'Email Address',
      organizationLabel: 'Organization/School (if applicable)',
      roleLabel: 'Your Role',
      interestLabel: 'How would you like to get involved?',
      submitButtonText: 'Submit Interest'
    }
  },
  emailSignupSection: {
    title: 'Stay Connected',
    description: 'Join our community to receive updates about new curriculum resources, upcoming workshops, and opportunities to collaborate.',
    placeholder: 'Enter your email address',
    buttonText: 'Join Our Community',
    disclaimer: 'We respect your privacy and will only send relevant updates about PLAYNE\'s educational programs and opportunities.'
  },
  seo: {
    metaTitle: 'Get Involved - Partner with PLAYNE for Creative Life Skills Education',
    metaDescription: 'Join PLAYNE\'s community of educators, families, and organizations bringing creative life skills education to diverse learning environments. Explore partnership opportunities.',
  },
}

async function populateGetInvolvedPage() {
  try {
    console.log('🤝 Creating Get Involved Page content based on context materials...')
    
    // First, try to delete any existing getInvolvedPage documents
    const existingDocs = await client.fetch('*[_type == "getInvolvedPage"]')
    
    if (existingDocs.length > 0) {
      console.log(`📝 Found ${existingDocs.length} existing getInvolvedPage document(s), removing them...`)
      
      for (const doc of existingDocs) {
        await client.delete(doc._id)
        console.log(`🗑️  Deleted existing document: ${doc._id}`)
      }
    }
    
    // Create the new document with our desired ID
    const result = await client.create(getInvolvedPageContent)
    
    console.log('✅ Get Involved Page content created successfully!')
    console.log('📄 Document ID:', result._id)
    console.log('')
    console.log('📋 Content Summary:')
    console.log('   🤝 Partner Types: Educators, Community Orgs, Families, Artists')
    console.log('   🏛️  Current Partners: Buffalo AKG Art Museum')
    console.log('   📝 Interest Form: Complete form fields and labels')
    console.log('   📧 Email Signup: Community newsletter subscription')
    console.log('   🎯 Focus: Collaborative approach to creative education')
    console.log('')
    console.log('🔗 Visit http://localhost:3000/studio to see your content')
    console.log('🌐 Visit http://localhost:3000/get-involved to see the page')
    
  } catch (error) {
    console.error('❌ Error creating Get Involved Page content:', error.message)
    
    if (error.message.includes('token')) {
      console.log('\n💡 Make sure you have SANITY_API_KEY in your .env.local file')
      console.log('Get it from: https://www.sanity.io/manage → Your Project → API → Tokens')
    }
  }
}

populateGetInvolvedPage()
