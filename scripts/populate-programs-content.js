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

const programsPageContent = {
  _id: 'programsPage',
  _type: 'programsPage',
  title: 'Programs',
  subtitle: 'Practical life education through creativity and hands-on learning',
  curriculumPillars: {
    title: 'Curriculum Pillars',
    description: 'PLAYNE\'s education framework is built on four essential pillars that prepare young people for real life.',
    pillars: [
      {
        _key: 'anatomy',
        title: 'Anatomy & Body Awareness',
        description: 'We often only learn about our bodies when something goes wrong. Playne classes teach whole-body awareness where students learn about anatomy, movement, and physical expression from head to toes that increases confidence and agility.',
      },
      {
        _key: 'wellness',
        title: 'Wellness & Self-Care',
        description: 'In a time of constant distractions, our programs focus on cultivating mindfulness about ourselves and the world around us. By traveling within, students learn more about how to manage their feelings to reduce stress and anxiety.',
      },
      {
        _key: 'nutrition',
        title: 'Nutrition & Healthy Living',
        description: 'Nourishing our bodies starts with knowing what we need to feel our best. Learning about the building blocks of food we eat — how things grow, where our food comes from, and what we need to have a nutritious meal — is a vital part of creating a full life.',
      },
      {
        _key: 'financial',
        title: 'Financial Literacy',
        description: 'By building a foundation of financial awareness, we design and nurture the vital decision-making skills that help students understand how to invest in themselves and plan for their futures.',
      },
    ],
  },
  learningModules: {
    title: 'Learning Modules',
    content: [
      {
        _type: 'block',
        _key: 'modules1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'modules1span',
            text: 'Interactive learning modules are currently in development. These hands-on experiences will bring our curriculum pillars to life through art, movement, storytelling, and group discussion.',
            marks: [],
          },
        ],
      },
      {
        _type: 'block',
        _key: 'modules2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'modules2span',
            text: 'Coming soon...',
            marks: ['em'],
          },
        ],
      },
    ],
    isComingSoon: true,
    modules: [
      // Placeholder modules for future development
      {
        _key: 'module1',
        title: 'Body Mapping Workshop',
        description: 'Interactive exploration of anatomy through art and movement',
        pillar: 'anatomy',
        duration: '45 minutes',
        ageGroup: '12-16 years',
      },
      {
        _key: 'module2',
        title: 'Mindful Moments',
        description: 'Guided meditation and stress management techniques',
        pillar: 'wellness',
        duration: '30 minutes',
        ageGroup: '14-18 years',
      },
    ],
  },
  seo: {
    metaTitle: 'Programs - PLAYNE Education',
    metaDescription: 'Discover PLAYNE\'s curriculum pillars: Anatomy & Body Awareness, Wellness & Self-Care, Nutrition & Healthy Living, and Financial Literacy. Practical life education through creativity.',
  },
}

async function populateProgramsContent() {
  try {
    console.log('🌱 Populating Programs page content...')
    
    // Check if programs page already exists
    const existingPrograms = await client.fetch('*[_type == "programsPage"][0]')
    
    if (existingPrograms) {
      console.log('📝 Updating existing Programs page...')
      const result = await client
        .patch(existingPrograms._id)
        .set(programsPageContent)
        .commit()
      console.log('✅ Programs page updated successfully!')
      console.log('Document ID:', result._id)
    } else {
      console.log('📝 Creating new Programs page...')
      const result = await client.createOrReplace(programsPageContent)
      console.log('✅ Programs page created successfully!')
      console.log('Document ID:', result._id)
    }
    
    console.log('🎉 Programs page content population complete!')
    
  } catch (error) {
    console.error('❌ Error populating Programs page content:', error)
    process.exit(1)
  }
}

// Run the script
populateProgramsContent()
