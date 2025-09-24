#!/usr/bin/env node

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
  apiVersion: '2024-01-01'
})

const homePageContent = {
  _type: 'page',
  title: 'Welcome to Our Website',
  slug: {
    _type: 'slug',
    current: 'home'
  },
  content: [
    {
      _type: 'block',
      _key: 'home1',
      style: 'h1',
      children: [
        {
          _type: 'span',
          text: 'Welcome to Our Amazing Website'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'home2',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'This is the homepage content managed through Sanity CMS. You can edit this content in the Sanity Studio at '
        },
        {
          _type: 'span',
          text: '/studio',
          marks: ['strong']
        },
        {
          _type: 'span',
          text: '.'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'home3',
      style: 'h2',
      children: [
        {
          _type: 'span',
          text: 'Features'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'home4',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Our website includes:'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'home5',
      listItem: 'bullet',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Next.js 15 with App Router'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'home6',
      listItem: 'bullet',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Sanity CMS integration'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'home7',
      listItem: 'bullet',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Responsive design with Tailwind CSS'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'home8',
      listItem: 'bullet',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'TypeScript support'
        }
      ]
    }
  ],
  seo: {
    metaTitle: 'Welcome - Our Amazing Website',
    metaDescription: 'Discover our amazing website built with Next.js and Sanity CMS.'
  }
}

const aboutPageContent = {
  _type: 'page',
  title: 'About Us',
  slug: {
    _type: 'slug',
    current: 'about'
  },
  content: [
    {
      _type: 'block',
      _key: 'about1',
      style: 'h1',
      children: [
        {
          _type: 'span',
          text: 'About Our Company'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'about2',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'We are a forward-thinking company that specializes in creating modern web experiences using cutting-edge technologies.'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'about3',
      style: 'h2',
      children: [
        {
          _type: 'span',
          text: 'Our Mission'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'about4',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Our mission is to deliver exceptional digital experiences that combine beautiful design with powerful functionality. We believe in the power of '
        },
        {
          _type: 'span',
          text: 'modern web technologies',
          marks: ['strong']
        },
        {
          _type: 'span',
          text: ' to create websites that are both user-friendly and maintainable.'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'about5',
      style: 'h2',
      children: [
        {
          _type: 'span',
          text: 'Why Choose Us?'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'about6',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'We use the latest technologies and best practices:'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'about7',
      listItem: 'number',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'React and Next.js for fast, SEO-friendly applications'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'about8',
      listItem: 'number',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Sanity CMS for flexible content management'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'about9',
      listItem: 'number',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'TypeScript for type-safe development'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'about10',
      listItem: 'number',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Tailwind CSS for responsive, modern design'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'about11',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Contact us today to learn more about how we can help bring your vision to life!'
        }
      ]
    }
  ],
  seo: {
    metaTitle: 'About Us - Learn More About Our Company',
    metaDescription: 'Learn about our mission, values, and expertise in modern web development using Next.js and Sanity CMS.'
  }
}

async function populateContent() {
  try {
    console.log('🚀 Creating sample content...')
    
    // Create home page
    const homeResult = await client.create(homePageContent)
    console.log('✅ Created home page:', homeResult._id)
    
    // Create about page
    const aboutResult = await client.create(aboutPageContent)
    console.log('✅ Created about page:', aboutResult._id)
    
    console.log('\n🎉 Sample content created successfully!')
    console.log('Visit http://localhost:3000 to see your content!')
    console.log('Visit http://localhost:3000/studio to edit content in Sanity Studio')
    
  } catch (error) {
    console.error('❌ Error creating content:', error)
  }
}

populateContent()
