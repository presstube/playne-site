#!/usr/bin/env node

/**
 * Contact Page population script based on context folder content
 * Run with: node scripts/populate-contact-context.js
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

const contactPageContent = {
  _id: 'contactPage',
  _type: 'contactPage',
  title: 'Contact',
  subtitle: 'Get in touch with the PLAYNE team',
  generalContactSection: {
    title: 'General Contact',
    description: 'Ready to bring creative life skills education to your community? Have questions about our curriculum or want to explore partnership opportunities? We\'d love to hear from you.',
    content: [
      {
        _key: 'contact-block-1',
        _type: 'block',
        children: [
          {
            _key: 'contact-span-1',
            _type: 'span',
            text: 'Whether you\'re an educator interested in integrating PLAYNE\'s curriculum, a community organization looking to partner with us, or a family wanting to learn more about our approach, we\'re here to help.',
          },
        ],
        style: 'normal',
      },
      {
        _key: 'contact-block-2',
        _type: 'block',
        children: [
          {
            _key: 'contact-span-2',
            _type: 'span',
            text: 'We typically respond to inquiries within 1-2 business days and look forward to exploring how we can work together to empower young minds through creative education.',
          },
        ],
        style: 'normal',
      },
    ],
    contactMethods: [
      {
        _key: 'method-email',
        type: 'email',
        label: 'General Inquiries',
        value: 'hello@playne.art',
        description: 'For general questions, partnership inquiries, and curriculum information'
      },
      {
        _key: 'method-partnerships',
        type: 'email',
        label: 'Partnerships & Collaborations',
        value: 'partnerships@playne.art',
        description: 'For schools, organizations, and institutions interested in working with PLAYNE'
      },
      {
        _key: 'method-workshops',
        type: 'email',
        label: 'Workshop Requests',
        value: 'workshops@playne.art',
        description: 'To book workshops or request custom educational programming'
      }
    ]
  },
  pressSection: {
    title: 'Press & Media',
    description: 'For media inquiries, interview requests, and press materials about PLAYNE\'s innovative approach to creative life skills education.',
    content: [
      {
        _key: 'press-block-1',
        _type: 'block',
        children: [
          {
            _key: 'press-span-1',
            _type: 'span',
            text: 'PLAYNE is available for interviews, speaking engagements, and media features about creative education, practical life skills curriculum, and the intersection of art and learning.',
          },
        ],
        style: 'normal',
      },
    ],
    pressContacts: [
      {
        _key: 'press-contact-1',
        name: 'Media Relations',
        role: 'Press Contact',
        email: 'press@playne.art',
        phone: '(555) 123-PLAYNE'
      }
    ]
  },
  locationSection: {
    title: 'Location & Hours',
    description: 'PLAYNE operates primarily through partnerships with schools and community organizations, bringing our curriculum directly to learning environments.',
    address: 'Brooklyn, NY\nServing NYC Metro Area and Beyond',
    hours: 'Program delivery by appointment\nWorkshops available weekdays and weekends\nVirtual sessions available nationwide'
  },
  seo: {
    metaTitle: 'Contact PLAYNE - Get in Touch About Creative Life Skills Education',
    metaDescription: 'Contact PLAYNE for partnership opportunities, workshop bookings, and information about our creative life skills curriculum covering anatomy, wellness, nutrition, and financial literacy.',
  },
}

async function populateContactPage() {
  try {
    console.log('📞 Creating Contact Page content based on context materials...')
    
    // First, try to delete any existing contactPage documents
    const existingDocs = await client.fetch('*[_type == "contactPage"]')
    
    if (existingDocs.length > 0) {
      console.log(`📝 Found ${existingDocs.length} existing contactPage document(s), removing them...`)
      
      for (const doc of existingDocs) {
        await client.delete(doc._id)
        console.log(`🗑️  Deleted existing document: ${doc._id}`)
      }
    }
    
    // Create the new document with our desired ID
    const result = await client.create(contactPageContent)
    
    console.log('✅ Contact Page content created successfully!')
    console.log('📄 Document ID:', result._id)
    console.log('')
    console.log('📋 Content Summary:')
    console.log('   📧 General Contact: 3 specialized email addresses')
    console.log('   📰 Press Section: Media relations and interview contacts')
    console.log('   📍 Location: Brooklyn-based, serving NYC metro and beyond')
    console.log('   🕐 Hours: Flexible scheduling for workshops and programs')
    console.log('   🎯 Focus: Partnership and collaboration opportunities')
    console.log('')
    console.log('🔗 Visit http://localhost:3000/studio to see your content')
    console.log('🌐 Visit http://localhost:3000/contact to see the page')
    
  } catch (error) {
    console.error('❌ Error creating Contact Page content:', error.message)
    
    if (error.message.includes('token')) {
      console.log('\n💡 Make sure you have SANITY_API_KEY in your .env.local file')
      console.log('Get it from: https://www.sanity.io/manage → Your Project → API → Tokens')
    }
  }
}

populateContactPage()
