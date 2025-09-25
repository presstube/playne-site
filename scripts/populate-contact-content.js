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

const contactPageContent = {
  _type: 'contactPage',
  title: 'Contact Us',
  subtitle: 'Get in touch with PLAYNE to learn more about our programs',
  generalContactSection: {
    title: 'General Contact',
    description: 'Have questions about PLAYNE programs, partnerships, or how to get involved? We\'d love to hear from you.',
    content: [
      {
        _type: 'block',
        _key: 'general1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'general1span',
            text: 'We\'re here to help answer your questions about PLAYNE programs, discuss partnership opportunities, or provide information about bringing our curriculum to your school or community.',
            marks: [],
          },
        ],
      },
    ],
    contactMethods: [
      {
        _key: 'email',
        type: 'email',
        label: 'Email',
        value: 'hello@playne.org',
        description: 'General inquiries and program information',
      },
      {
        _key: 'phone',
        type: 'phone',
        label: 'Phone',
        value: '(555) 123-PLAYNE',
        description: 'Available Monday-Friday, 9am-5pm EST',
      },
    ],
  },
  pressSection: {
    title: 'Press & Media',
    description: 'For media inquiries, interviews, and press information about PLAYNE.',
    content: [
      {
        _type: 'block',
        _key: 'press1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'press1span',
            text: 'We welcome media coverage of our work and are available for interviews about practical life education, youth development, and our innovative curriculum approach.',
            marks: [],
          },
        ],
      },
    ],
    pressContacts: [
      {
        _key: 'media',
        name: 'Media Relations',
        role: 'Press Inquiries',
        email: 'press@playne.org',
      },
      {
        _key: 'founder',
        name: 'PLAYNE Leadership',
        role: 'Executive Interviews',
        email: 'leadership@playne.org',
      },
    ],
  },
  locationSection: {
    title: 'Location & Service Areas',
    description: 'PLAYNE operates programs in schools and communities nationwide. Contact us to learn about programs in your area.',
    address: 'Currently serving schools and communities nationwide',
    hours: 'Program delivery varies by location and partner schedule',
  },
  seo: {
    metaTitle: 'Contact PLAYNE - Get in Touch',
    metaDescription: 'Get in touch with PLAYNE. Contact us for general inquiries, press information, or to learn more about our practical life education programs for young people.',
  },
}

async function populateContactContent() {
  try {
    console.log('🌱 Populating Contact page content...')
    
    // Check if contact page already exists
    const existingContact = await client.fetch('*[_type == "contactPage"][0]')
    
    if (existingContact) {
      console.log('📝 Updating existing Contact page...')
      const result = await client
        .patch(existingContact._id)
        .set(contactPageContent)
        .commit()
      console.log('✅ Contact page updated successfully!')
      console.log('Document ID:', result._id)
    } else {
      console.log('📝 Creating new Contact page...')
      const result = await client.create(contactPageContent)
      console.log('✅ Contact page created successfully!')
      console.log('Document ID:', result._id)
    }
    
    console.log('🎉 Contact page content population complete!')
    
  } catch (error) {
    console.error('❌ Error populating Contact page content:', error)
    process.exit(1)
  }
}

// Run the script
populateContactContent()
