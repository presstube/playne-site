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

const supportPageContent = {
  _id: 'supportPage',
  _type: 'supportPage',
  title: 'Support PLAYNE',
  subtitle: 'Help us empower young minds through practical life education',
  donationSection: {
    title: 'Make a Donation',
    description: 'Your donation directly supports our mission to provide practical life education to young people. Every contribution helps us reach more students and create more impactful programs.',
    content: [
      {
        _type: 'block',
        _key: 'donation1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'donation1span',
            text: 'Every dollar you donate goes directly toward creating and delivering life-changing educational experiences for young people. Your support helps us develop new curriculum, train educators, and reach underserved communities.',
            marks: [],
          },
        ],
      },
    ],
    donationTiers: [
      {
        _key: 'tier1',
        amount: '$25',
        title: 'Supporter',
        description: 'Provides materials for one student in a PLAYNE workshop',
        benefits: [
          'Thank you email with impact update',
          'Digital supporter badge',
        ],
      },
      {
        _key: 'tier2',
        amount: '$50',
        title: 'Advocate',
        description: 'Supports a full workshop session for a small group',
        benefits: [
          'Quarterly impact newsletter',
          'Access to exclusive content',
          'Supporter recognition on website',
        ],
      },
      {
        _key: 'tier3',
        amount: '$100',
        title: 'Champion',
        description: 'Funds a complete curriculum pillar module for a classroom',
        benefits: [
          'Annual impact report',
          'Invitation to virtual events',
          'Champion recognition',
          'Behind-the-scenes updates',
        ],
      },
      {
        _key: 'tier4',
        amount: '$250',
        title: 'Changemaker',
        description: 'Sponsors a full program series for an entire class',
        benefits: [
          'Personal impact story',
          'Direct program updates',
          'Priority event access',
          'Advisory input opportunities',
        ],
      },
    ],
  },
  sponsorshipSection: {
    title: 'Sponsorship Opportunities',
    description: 'Partner with PLAYNE to make a lasting impact on youth education. Our sponsorship opportunities offer meaningful ways to support our mission while gaining visibility for your organization.',
    content: [
      {
        _type: 'block',
        _key: 'sponsor1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'sponsor1span',
            text: 'Corporate partnerships enable us to scale our impact and reach more communities. We work closely with sponsors to create meaningful collaborations that align with your values and business objectives.',
            marks: [],
          },
        ],
      },
    ],
    sponsorshipLevels: [
      {
        _key: 'level1',
        level: 'bronze',
        title: 'Community Partner',
        description: 'Support local programs and get recognized in our community outreach',
        minAmount: '$500',
        benefits: [
          'Logo on program materials',
          'Social media recognition',
          'Quarterly impact reports',
          'Community event invitations',
        ],
      },
      {
        _key: 'level2',
        level: 'silver',
        title: 'Program Sponsor',
        description: 'Sponsor entire curriculum pillars and help shape educational content',
        minAmount: '$2,500',
        benefits: [
          'Named program sponsorship',
          'Website recognition',
          'Direct program feedback',
          'Annual impact presentation',
          'Co-branded materials',
        ],
      },
      {
        _key: 'level3',
        level: 'gold',
        title: 'Founding Partner',
        description: 'Join us as a founding partner in revolutionizing youth education',
        minAmount: '$10,000',
        benefits: [
          'Prominent brand placement',
          'Co-branded materials',
          'Advisory board participation',
          'Exclusive partnership benefits',
          'Custom collaboration opportunities',
        ],
      },
    ],
  },
  impactSection: {
    title: 'Your Impact',
    description: 'See how your support translates into real change in young people\'s lives.',
    impactStats: [
      {
        _key: 'stat1',
        number: '500+',
        label: 'Students Reached',
        description: 'Young people who have participated in PLAYNE programs',
      },
      {
        _key: 'stat2',
        number: '25+',
        label: 'Partner Schools',
        description: 'Educational institutions implementing our curriculum',
      },
      {
        _key: 'stat3',
        number: '4',
        label: 'Core Pillars',
        description: 'Essential life skills areas we focus on',
      },
      {
        _key: 'stat4',
        number: '95%',
        label: 'Student Satisfaction',
        description: 'Students report increased confidence in life skills',
      },
    ],
  },
  seo: {
    metaTitle: 'Support PLAYNE - Make a Donation or Become a Sponsor',
    metaDescription: 'Support PLAYNE\'s mission to empower young minds through practical life education. Make a donation or become a sponsor to help us reach more students and create lasting impact.',
  },
}

async function populateSupportContent() {
  try {
    console.log('🌱 Populating Support page content...')
    
    // Check if support page already exists
    const existingSupport = await client.fetch('*[_type == "supportPage"][0]')
    
    if (existingSupport) {
      console.log('📝 Updating existing Support page...')
      const result = await client
        .patch(existingSupport._id)
        .set(supportPageContent)
        .commit()
      console.log('✅ Support page updated successfully!')
      console.log('Document ID:', result._id)
    } else {
      console.log('📝 Creating new Support page...')
      const result = await client.createOrReplace(supportPageContent)
      console.log('✅ Support page created successfully!')
      console.log('Document ID:', result._id)
    }
    
    console.log('🎉 Support page content population complete!')
    
  } catch (error) {
    console.error('❌ Error populating Support page content:', error)
    process.exit(1)
  }
}

// Run the script
populateSupportContent()
