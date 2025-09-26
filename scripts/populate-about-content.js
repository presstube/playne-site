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

const aboutPageContent = {
  _id: 'aboutPage',
  _type: 'aboutPage',
  title: 'About PLAYNE',
  subtitle: 'Empowering young minds through practical life education',
  mission: {
    title: 'Our Mission',
    content: [
      {
        _type: 'block',
        _key: 'mission1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'mission1span',
            text: 'PLAYNE uses creativity to teach the things we wish we learned in school — how to care for our bodies, understand our emotions, manage money, and find our voice. Through playful, practical lessons rooted in art, we give young people the space to explore ',
            marks: [],
          },
          {
            _type: 'span',
            _key: 'mission1emphasis',
            text: 'who they are',
            marks: ['em'],
          },
          {
            _type: 'span',
            _key: 'mission1span2',
            text: ' before being told who to be.',
            marks: [],
          },
        ],
      },
    ],
  },
  story: {
    title: 'Our Story',
    content: [
      {
        _type: 'block',
        _key: 'story1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'story1span',
            text: 'We believe every young person deserves the tools to thrive, not just in school, but in life. PLAYNE reimagines learning by putting curiosity, wellness, and self-discovery at the center. Through hands-on experiences in classrooms and communities, we help students gain a deeper understanding of themselves and the world around them.',
            marks: [],
          },
        ],
      },
      {
        _type: 'block',
        _key: 'story2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'story2span',
            text: 'Our approach combines art, movement, storytelling, and group discussion to create multisensory learning experiences that engage the body, mind, and heart. We design flexible resources that work in any space — from traditional classrooms to after-school programs and community centers.',
            marks: [],
          },
        ],
      },
    ],
  },
  team: {
    title: 'Our Team',
    content: [
      {
        _type: 'block',
        _key: 'team1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'team1span',
            text: 'Meet the passionate educators and creators behind PLAYNE. Our team brings together expertise in education, art, wellness, and youth development to create transformative learning experiences.',
            marks: [],
          },
        ],
      },
    ],
    members: [
      // Placeholder team members - can be updated later
      {
        _key: 'member1',
        name: 'Team Member 1',
        role: 'Founder & Creative Director',
        bio: 'Passionate about empowering young minds through creative education.',
      },
      {
        _key: 'member2',
        name: 'Team Member 2',
        role: 'Education Specialist',
        bio: 'Expert in curriculum development and youth engagement.',
      },
    ],
  },
  seo: {
    metaTitle: 'About PLAYNE - Empowering Young Minds',
    metaDescription: 'Learn about PLAYNE\'s mission to teach practical life skills through creativity. Discover our approach to wellness, self-discovery, and holistic education for young people.',
  },
}

async function populateAboutContent() {
  try {
    console.log('🌱 Populating About page content...')
    
    // Check if about page already exists
    const existingAbout = await client.fetch('*[_type == "aboutPage"][0]')
    
    if (existingAbout) {
      console.log('📝 Updating existing About page...')
      const result = await client
        .patch(existingAbout._id)
        .set(aboutPageContent)
        .commit()
      console.log('✅ About page updated successfully!')
      console.log('Document ID:', result._id)
    } else {
      console.log('📝 Creating new About page...')
      const result = await client.createOrReplace(aboutPageContent)
      console.log('✅ About page created successfully!')
      console.log('Document ID:', result._id)
    }
    
    console.log('🎉 About page content population complete!')
    
  } catch (error) {
    console.error('❌ Error populating About page content:', error)
    process.exit(1)
  }
}

// Run the script
populateAboutContent()
