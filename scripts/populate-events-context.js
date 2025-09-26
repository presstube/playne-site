#!/usr/bin/env node

/**
 * Events Page population script based on context folder content
 * Run with: node scripts/populate-events-context.js
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

const eventsPageContent = {
  _id: 'eventsPage',
  _type: 'eventsPage',
  title: 'Events',
  subtitle: 'Join us for talks, workshops, and community gatherings',
  description: 'Connect with the PLAYNE community through educational events, creative workshops, and inspiring conversations about practical life education.',
  isEventsVisible: true,
  seo: {
    metaTitle: 'Events - PLAYNE Community Gatherings and Workshops',
    metaDescription: 'Join PLAYNE for educational events, creative workshops, and community gatherings focused on practical life skills education through art and creativity.',
  },
}

// Sample events based on PLAYNE's curriculum pillars
const sampleEvents = [
  {
    _type: 'event',
    title: 'Drawing Our Way to Calm: Mindfulness Workshop',
    slug: { current: 'drawing-our-way-to-calm-workshop' },
    date: '2025-10-15',
    time: '2:00 PM - 3:30 PM EST',
    location: 'PLAYNE Community Center, Brooklyn NY',
    description: [
      {
        _key: 'event1-desc-1',
        _type: 'block',
        children: [
          {
            _key: 'event1-span-1',
            _type: 'span',
            text: 'Join us for a hands-on workshop exploring mindfulness and emotional wellness through art. Learn 2-part breathing techniques while creating continuous line drawings inspired by Shantell Martin\'s work.',
          },
        ],
        style: 'normal',
      },
      {
        _key: 'event1-desc-2',
        _type: 'block',
        children: [
          {
            _key: 'event1-span-2',
            _type: 'span',
            text: 'Perfect for educators, parents, and anyone interested in creative approaches to stress management and self-care. All materials provided.',
          },
        ],
        style: 'normal',
      },
    ],
    eventType: 'workshop',
    isVirtual: false,
    registrationUrl: 'https://playne.art/register',
    capacity: 25,
    tags: ['wellness', 'mindfulness', 'art', 'self-care'],
  },
  {
    _type: 'event',
    title: 'Financial Literacy Through Creative Expression',
    slug: { current: 'financial-literacy-creative-expression' },
    date: '2025-11-02',
    time: '10:00 AM - 11:30 AM EST',
    location: 'Virtual Event (Zoom)',
    description: [
      {
        _key: 'event2-desc-1',
        _type: 'block',
        children: [
          {
            _key: 'event2-span-1',
            _type: 'span',
            text: 'Discover how to teach financial awareness and budgeting skills through art-based activities. This educator-focused session will demonstrate PLAYNE\'s approach to making financial literacy engaging and accessible for young learners.',
          },
        ],
        style: 'normal',
      },
    ],
    eventType: 'webinar',
    isVirtual: true,
    registrationUrl: 'https://playne.art/register',
    capacity: 100,
    tags: ['financial-literacy', 'education', 'teachers', 'curriculum'],
  },
  {
    _type: 'event',
    title: 'PLAYNE Community Open House',
    slug: { current: 'playne-community-open-house' },
    date: '2025-11-20',
    time: '6:00 PM - 8:00 PM EST',
    location: 'PLAYNE Community Center, Brooklyn NY',
    description: [
      {
        _key: 'event3-desc-1',
        _type: 'block',
        children: [
          {
            _key: 'event3-span-1',
            _type: 'span',
            text: 'Join us for an evening of community connection, art-making, and conversation about practical life education. Meet the PLAYNE team, explore our curriculum pillars, and connect with other educators and families passionate about creative learning.',
          },
        ],
        style: 'normal',
      },
      {
        _key: 'event3-desc-2',
        _type: 'block',
        children: [
          {
            _key: 'event3-span-2',
            _type: 'span',
            text: 'Light refreshments provided. Bring your curiosity and creativity!',
          },
        ],
        style: 'normal',
      },
    ],
    eventType: 'other',
    isVirtual: false,
    registrationUrl: 'https://playne.art/register',
    capacity: 50,
    tags: ['community', 'networking', 'open-house', 'family-friendly'],
  },
]

async function populateEventsPage() {
  try {
    console.log('📅 Creating Events Page content based on context materials...')
    
    // First, delete any existing eventsPage documents
    const existingEventsPages = await client.fetch('*[_type == "eventsPage"]')
    
    if (existingEventsPages.length > 0) {
      console.log(`📝 Found ${existingEventsPages.length} existing eventsPage document(s), removing them...`)
      
      for (const doc of existingEventsPages) {
        await client.delete(doc._id)
        console.log(`🗑️  Deleted existing eventsPage: ${doc._id}`)
      }
    }
    
    // Create the events page
    const eventsPageResult = await client.create(eventsPageContent)
    console.log('✅ Events Page content created successfully!')
    console.log('📄 Events Page ID:', eventsPageResult._id)
    
    // Create sample events
    console.log('\n📅 Creating sample events...')
    
    // Delete any existing events first
    const existingEvents = await client.fetch('*[_type == "event"]')
    if (existingEvents.length > 0) {
      console.log(`🗑️  Removing ${existingEvents.length} existing event(s)...`)
      for (const event of existingEvents) {
        await client.delete(event._id)
      }
    }
    
    // Create new sample events
    for (const event of sampleEvents) {
      const eventResult = await client.create(event)
      console.log(`✅ Created event: "${event.title}"`)
    }
    
    console.log('')
    console.log('📋 Content Summary:')
    console.log('   📅 Events Page: Community-focused content with toggle visibility')
    console.log('   🎪 Sample Events: 3 events covering different curriculum pillars')
    console.log('   🎯 Event Types: Workshop, Webinar, Community gathering')
    console.log('   📍 Locations: Mix of in-person and virtual events')
    console.log('   🏷️  Tags: Organized by topic and audience')
    console.log('')
    console.log('🔗 Visit http://localhost:3000/studio to see your content')
    console.log('🌐 Visit http://localhost:3000/events to see the page')
    
  } catch (error) {
    console.error('❌ Error creating Events content:', error.message)
    
    if (error.message.includes('token')) {
      console.log('\n💡 Make sure you have SANITY_API_KEY in your .env.local file')
      console.log('Get it from: https://www.sanity.io/manage → Your Project → API → Tokens')
    }
  }
}

populateEventsPage()
