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

const getInvolvedPageContent = {
  _id: 'getInvolvedPage',
  _type: 'getInvolvedPage',
  title: 'Get Involved',
  subtitle: 'Join us in empowering young minds through practical life education',
  partnersSection: {
    title: 'Partners & Collaborators',
    description: 'We believe in the power of collaboration. PLAYNE works with schools, community organizations, educators, and advocates who share our vision of holistic youth education.',
    partnerTypes: [
      {
        _key: 'educational',
        title: 'Educational Institutions',
        description: 'Schools and educational programs looking to integrate practical life skills into their curriculum.',
      },
      {
        _key: 'community',
        title: 'Community Organizations',
        description: 'Youth centers, after-school programs, and community groups focused on youth development.',
      },
      {
        _key: 'educators',
        title: 'Individual Educators',
        description: 'Teachers, counselors, and mentors passionate about holistic education and youth empowerment.',
      },
    ],
    currentPartners: [
      // Placeholder for future partners
      {
        _key: 'partner1',
        name: 'Partner Organization 1',
        description: 'Description of partnership and collaboration.',
        website: 'https://example.com',
      },
    ],
  },
  interestFormSection: {
    title: 'Express Your Interest',
    description: 'Interested in bringing PLAYNE programs to your community? Let us know how you\'d like to get involved.',
    formFields: {
      nameLabel: 'Name',
      emailLabel: 'Email',
      organizationLabel: 'Organization',
      roleLabel: 'Your Role',
      interestLabel: 'How would you like to get involved?',
      submitButtonText: 'Submit Interest',
    },
  },
  emailSignupSection: {
    title: 'Stay Updated',
    description: 'Sign up for our email list to receive updates about new programs, resources, and opportunities to get involved.',
    placeholder: 'Enter your email address',
    buttonText: 'Sign Up',
    disclaimer: 'We respect your privacy and will never share your information. Unsubscribe at any time.',
  },
  seo: {
    metaTitle: 'Get Involved - PLAYNE',
    metaDescription: 'Join PLAYNE\'s mission to empower young minds. Partner with us, express your interest, or sign up for updates about our practical life education programs.',
  },
}

async function populateGetInvolvedContent() {
  try {
    console.log('🌱 Populating Get Involved page content...')
    
    // Check if get involved page already exists
    const existingGetInvolved = await client.fetch('*[_type == "getInvolvedPage"][0]')
    
    if (existingGetInvolved) {
      console.log('📝 Updating existing Get Involved page...')
      const result = await client
        .patch(existingGetInvolved._id)
        .set(getInvolvedPageContent)
        .commit()
      console.log('✅ Get Involved page updated successfully!')
      console.log('Document ID:', result._id)
    } else {
      console.log('📝 Creating new Get Involved page...')
      const result = await client.createOrReplace(getInvolvedPageContent)
      console.log('✅ Get Involved page created successfully!')
      console.log('Document ID:', result._id)
    }
    
    console.log('🎉 Get Involved page content population complete!')
    
  } catch (error) {
    console.error('❌ Error populating Get Involved page content:', error)
    process.exit(1)
  }
}

// Run the script
populateGetInvolvedContent()
