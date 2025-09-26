#!/usr/bin/env node

/**
 * Programs Page population script based on context folder content
 * Run with: node scripts/populate-programs-context.js
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

const programsPageContent = {
  _id: 'programsPage',
  _type: 'programsPage',
  title: 'Programs',
  subtitle: 'Practical life education through creativity and hands-on learning',
  curriculumPillars: {
    title: 'Curriculum Pillars',
    description: 'PLAYNE\'s education framework is built on four essential pillars that prepare young people for real life. Each pillar integrates art with practical skills, creating engaging multisensory learning experiences.',
    pillars: [
      {
        _key: 'pillar-anatomy',
        title: 'Anatomy & Body Awareness',
        description: 'We often only learn about our bodies when something goes wrong. PLAYNE classes teach whole-body awareness where students learn about anatomy, movement, and physical expression from head to toes that increases confidence and agility. Through figure drawing, movement exercises, and creative exploration, students develop a deeper understanding of their physical selves.'
      },
      {
        _key: 'pillar-wellness',
        title: 'Wellness & Self-Care',
        description: 'In a time of constant distractions, our programs focus on cultivating mindfulness about ourselves and the world around us. By traveling within, students learn more about how to manage their feelings to reduce stress and anxiety. Using breathing exercises, emotional exploration through art, and mindfulness practices, we support socioemotional learning and self-awareness.'
      },
      {
        _key: 'pillar-nutrition',
        title: 'Nutrition & Healthy Living',
        description: 'Nourishing our bodies starts with knowing what we need to feel our best. Learning about the building blocks of food we eat — how things grow, where our food comes from, and what we need to have a nutritious meal — is a vital part of creating a full life. Students explore food systems, nutrition science, and healthy habits through creative mapping and artistic expression.'
      },
      {
        _key: 'pillar-financial',
        title: 'Financial Literacy',
        description: 'By building a foundation of financial awareness, we design and nurture the vital decision-making skills that help students understand how to invest in themselves and plan for their futures. Through creative budgeting exercises, needs vs. wants exploration, and future planning activities, students develop practical money management skills.'
      }
    ]
  },
  learningModules: {
    title: 'Learning Modules',
    content: [
      {
        _key: 'modules-block-1',
        _type: 'block',
        children: [
          {
            _key: 'modules-span-1',
            _type: 'span',
            text: 'Our comprehensive curriculum includes hands-on workshops and activities designed for different learning levels. Each 45-50 minute lesson begins with a story about our main character, Shantell, and centers on a piece of her art.',
          },
        ],
        style: 'normal',
      },
      {
        _key: 'modules-block-2',
        _type: 'block',
        children: [
          {
            _key: 'modules-span-2',
            _type: 'span',
            text: 'The lessons are designed to be flexible and can be done alone or in groups. All that is needed to join the lessons is a pen or pencil, some paper, and yourself. Activities blend drawing, movement, storytelling, and group discussion to activate the body, mind, and heart.',
          },
        ],
        style: 'normal',
      }
    ],
    isComingSoon: false,
    modules: [
      {
        _key: 'module-body-awareness',
        title: 'Draw Me, Draw You',
        description: 'Students explore human anatomy through figure drawing, movement exercises, and skeleton mapping. Learn about bones, muscles, joints, and how the body moves while creating artistic representations of physical expression.',
        pillar: 'Anatomy & Body Awareness',
        duration: '45 minutes',
        ageGroup: 'All ages (adaptable)'
      },
      {
        _key: 'module-breathing-calm',
        title: 'Drawing Our Way to Calm',
        description: 'Using 2-part breathing exercises and continuous line drawing, students learn mindfulness techniques to manage stress and anxiety. Explore emotions through art while developing self-awareness and coping strategies.',
        pillar: 'Wellness & Self-Care',
        duration: '45 minutes',
        ageGroup: 'All ages (adaptable)'
      },
      {
        _key: 'module-food-journey',
        title: 'Drawing Our Way to Health',
        description: 'Map the journey of food from farm to plate through creative visualization. Students learn about nutrition, food systems, and healthy eating habits while creating artistic representations of food pathways and meal planning.',
        pillar: 'Nutrition & Healthy Living',
        duration: '45 minutes',
        ageGroup: 'All ages (adaptable)'
      },
      {
        _key: 'module-future-finances',
        title: 'Drawing Our Way to Future Finances',
        description: 'Explore budgeting, needs vs. wants, and future planning through creative exercises. Students learn financial decision-making skills while creating artistic representations of their financial goals and spending priorities.',
        pillar: 'Financial Literacy',
        duration: '45 minutes',
        ageGroup: 'All ages (adaptable)'
      }
    ]
  },
  seo: {
    metaTitle: 'Programs - PLAYNE\'s Creative Life Skills Curriculum',
    metaDescription: 'Discover PLAYNE\'s four curriculum pillars: Anatomy & Body Awareness, Wellness & Self-Care, Nutrition & Healthy Living, and Financial Literacy. Art-based learning for practical life skills.',
  },
}

async function populateProgramsPage() {
  try {
    console.log('🏛️  Creating Programs Page content based on context materials...')
    
    // First, try to delete any existing programsPage documents
    const existingDocs = await client.fetch('*[_type == "programsPage"]')
    
    if (existingDocs.length > 0) {
      console.log(`📝 Found ${existingDocs.length} existing programsPage document(s), removing them...`)
      
      for (const doc of existingDocs) {
        await client.delete(doc._id)
        console.log(`🗑️  Deleted existing document: ${doc._id}`)
      }
    }
    
    // Create the new document with our desired ID
    const result = await client.create(programsPageContent)
    
    console.log('✅ Programs Page content created successfully!')
    console.log('📄 Document ID:', result._id)
    console.log('')
    console.log('📋 Content Summary:')
    console.log('   🏛️  Four Curriculum Pillars with detailed descriptions')
    console.log('   📚 Learning Modules: 4 hands-on workshops')
    console.log('   🎨 Art-integrated approach with Shantell Martin\'s work')
    console.log('   ⏱️  45-minute flexible lesson format')
    console.log('   👥 Adaptable for all age groups')
    console.log('')
    console.log('🔗 Visit http://localhost:3000/studio to see your content')
    console.log('🌐 Visit http://localhost:3000/programs to see the page')
    
  } catch (error) {
    console.error('❌ Error creating Programs Page content:', error.message)
    
    if (error.message.includes('token')) {
      console.log('\n💡 Make sure you have SANITY_API_KEY in your .env.local file')
      console.log('Get it from: https://www.sanity.io/manage → Your Project → API → Tokens')
    }
  }
}

populateProgramsPage()
