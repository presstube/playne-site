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

const eventsPageContent = {
  _type: 'eventsPage',
  title: 'Events',
  subtitle: 'Join us for talks, workshops, and educational experiences',
  description: 'Connect with the PLAYNE community through our educational events, workshops, and talks about practical life education.',
  isEventsVisible: false, // Initially hidden as per spec
  seo: {
    metaTitle: 'Events - PLAYNE',
    metaDescription: 'Join PLAYNE for talks, workshops, and educational events. Learn about practical life education and connect with our community.',
  },
}

// Sample events for when they're ready to be shown
const sampleEvents = [
  {
    _type: 'event',
    title: 'Introduction to Practical Life Education',
    slug: { current: 'intro-practical-life-education' },
    date: '2024-03-15',
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
            _key: 'event1span',
            text: 'Join us for an introduction to PLAYNE\'s approach to practical life education. Learn about our curriculum pillars and how we\'re empowering young minds through creative, hands-on learning experiences.',
            marks: [],
          },
        ],
      },
    ],
    eventType: 'webinar',
    isVirtual: true,
    registrationUrl: 'https://example.com/register',
    capacity: 100,
    tags: ['education', 'curriculum', 'introduction'],
  },
  {
    _type: 'event',
    title: 'Financial Literacy Workshop for Educators',
    slug: { current: 'financial-literacy-workshop' },
    date: '2024-03-22',
    time: '10:00 AM - 12:00 PM EST',
    location: 'Community Center, Downtown',
    description: [
      {
        _type: 'block',
        _key: 'event2desc',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'event2span',
            text: 'A hands-on workshop for educators interested in incorporating financial literacy into their curriculum. Learn practical activities and creative approaches to teaching money management to young people.',
            marks: [],
          },
        ],
      },
    ],
    eventType: 'workshop',
    isVirtual: false,
    registrationUrl: 'https://example.com/register-workshop',
    capacity: 25,
    tags: ['financial-literacy', 'workshop', 'educators'],
  },
]

async function populateEventsContent() {
  try {
    console.log('🌱 Populating Events page content...')
    
    // Check if events page already exists
    const existingEventsPage = await client.fetch('*[_type == "eventsPage"][0]')
    
    if (existingEventsPage) {
      console.log('📝 Updating existing Events page...')
      const result = await client
        .patch(existingEventsPage._id)
        .set(eventsPageContent)
        .commit()
      console.log('✅ Events page updated successfully!')
      console.log('Document ID:', result._id)
    } else {
      console.log('📝 Creating new Events page...')
      const result = await client.create(eventsPageContent)
      console.log('✅ Events page created successfully!')
      console.log('Document ID:', result._id)
    }
    
    console.log('📅 Note: Events page is initially hidden (isEventsVisible: false)')
    console.log('   You can enable it in Sanity Studio when ready to show events.')
    
    // Optionally create sample events (commented out for now)
    /*
    console.log('📝 Creating sample events...')
    for (const event of sampleEvents) {
      const existingEvent = await client.fetch(`*[_type == "event" && slug.current == "${event.slug.current}"][0]`)
      if (!existingEvent) {
        await client.create(event)
        console.log(`✅ Created sample event: ${event.title}`)
      }
    }
    */
    
    console.log('🎉 Events page content population complete!')
    
  } catch (error) {
    console.error('❌ Error populating Events page content:', error)
    process.exit(1)
  }
}

// Run the script
populateEventsContent()
