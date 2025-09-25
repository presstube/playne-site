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

// Generate dates for upcoming and past events
const today = new Date()
const futureDate1 = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
const futureDate2 = new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000) // 4 weeks from now
const pastDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) // 1 week ago

const sampleEvents = [
  {
    _type: 'event',
    title: 'Introduction to Practical Life Education',
    slug: { 
      _type: 'slug',
      current: 'intro-practical-life-education' 
    },
    date: futureDate1.toISOString().split('T')[0], // Format as YYYY-MM-DD
    time: '2:00 PM - 3:30 PM EST',
    location: 'Virtual Event - Zoom',
    description: [
      {
        _type: 'block',
        _key: 'event1desc',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'event1span1',
            text: 'Join us for an introduction to PLAYNE\'s approach to practical life education. Learn about our curriculum pillars and how we\'re empowering young minds through creative, hands-on learning experiences.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'event1desc2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'event1span2',
            text: 'This webinar will cover our four core pillars: Anatomy & Body Awareness, Wellness & Self-Care, Nutrition & Healthy Living, and Financial Literacy. Perfect for educators, parents, and community leaders interested in practical life skills education.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    eventType: 'webinar',
    isVirtual: true,
    registrationUrl: 'https://zoom.us/webinar/register/example',
    capacity: 100,
    tags: ['education', 'curriculum', 'introduction', 'webinar'],
  },
  {
    _type: 'event',
    title: 'Financial Literacy Workshop for Educators',
    slug: { 
      _type: 'slug',
      current: 'financial-literacy-workshop-educators' 
    },
    date: futureDate2.toISOString().split('T')[0],
    time: '10:00 AM - 12:00 PM EST',
    location: 'Community Learning Center, 123 Education Ave, Learning City',
    description: [
      {
        _type: 'block',
        _key: 'event2desc',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'event2span1',
            text: 'A hands-on workshop for educators interested in incorporating financial literacy into their curriculum. Learn practical activities and creative approaches to teaching money management to young people.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'event2desc2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'event2span2',
            text: 'Workshop includes: budgeting games, savings challenges, entrepreneurship activities, and age-appropriate investment concepts. Take home a complete toolkit of resources.',
            marks: ['strong'],
          },
        ],
        markDefs: [],
      },
    ],
    eventType: 'workshop',
    isVirtual: false,
    registrationUrl: 'https://eventbrite.com/e/financial-literacy-workshop',
    capacity: 25,
    tags: ['financial-literacy', 'workshop', 'educators', 'hands-on'],
  },
  {
    _type: 'event',
    title: 'Wellness & Self-Care: A Community Talk',
    slug: { 
      _type: 'slug',
      current: 'wellness-self-care-community-talk' 
    },
    date: pastDate.toISOString().split('T')[0],
    time: '7:00 PM - 8:30 PM EST',
    location: 'Public Library Main Branch, Community Room',
    description: [
      {
        _type: 'block',
        _key: 'event3desc',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'event3span1',
            text: 'An inspiring community talk about the importance of teaching wellness and self-care to young people. Discover practical strategies for helping youth develop healthy habits and emotional resilience.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'event3desc2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'event3span2',
            text: 'Featured topics included mindfulness practices, stress management techniques, and building healthy relationships. Thank you to everyone who attended!',
            marks: ['em'],
          },
        ],
        markDefs: [],
      },
    ],
    eventType: 'talk',
    isVirtual: false,
    capacity: 75,
    tags: ['wellness', 'self-care', 'community', 'mindfulness'],
  },
]

async function generateSampleEvents() {
  try {
    console.log('🎪 Generating sample events for PLAYNE...')
    console.log(`📅 Creating ${sampleEvents.length} sample events (1 past, 2 upcoming)`)
    
    let createdCount = 0
    let skippedCount = 0
    
    for (const event of sampleEvents) {
      // Check if event with this slug already exists
      const existingEvent = await client.fetch(
        `*[_type == "event" && slug.current == $slug][0]`,
        { slug: event.slug.current }
      )
      
      if (existingEvent) {
        console.log(`⏭️  Skipping "${event.title}" - already exists`)
        skippedCount++
      } else {
        const result = await client.create(event)
        console.log(`✅ Created "${event.title}" (${event.eventType})`)
        console.log(`   📍 ${event.location}`)
        console.log(`   📅 ${event.date} ${event.time || ''}`)
        console.log(`   🏷️  Tags: ${event.tags.join(', ')}`)
        console.log(`   📄 Document ID: ${result._id}`)
        console.log('')
        createdCount++
      }
    }
    
    console.log('🎉 Sample events generation complete!')
    console.log(`📊 Summary: ${createdCount} created, ${skippedCount} skipped`)
    
    if (createdCount > 0) {
      console.log('')
      console.log('💡 Next steps:')
      console.log('   1. Enable events visibility in Sanity Studio:')
      console.log('      - Go to Events Page document')
      console.log('      - Set "Show Events Page?" to true')
      console.log('   2. Visit /events to see your sample events!')
      console.log('   3. Edit events in Sanity Studio under "Event" documents')
    }
    
  } catch (error) {
    console.error('❌ Error generating sample events:', error)
    process.exit(1)
  }
}

// Run the script
generateSampleEvents()
