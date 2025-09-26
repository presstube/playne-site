#!/usr/bin/env node

const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function checkAboutContent() {
  try {
    console.log('🔍 Checking existing About Page content...')
    
    const aboutPages = await client.fetch('*[_type == "aboutPage"]')
    
    console.log(`📄 Found ${aboutPages.length} aboutPage document(s):`)
    
    aboutPages.forEach((doc, index) => {
      console.log(`\n${index + 1}. Document ID: ${doc._id}`)
      console.log(`   Title: ${doc.title || 'No title'}`)
      console.log(`   Subtitle: ${doc.subtitle || 'No subtitle'}`)
      console.log(`   Has Mission: ${doc.mission ? 'Yes' : 'No'}`)
      console.log(`   Has Story: ${doc.story ? 'Yes' : 'No'}`)
      console.log(`   Has Team: ${doc.team ? 'Yes' : 'No'}`)
    })
    
  } catch (error) {
    console.error('❌ Error checking content:', error.message)
  }
}

checkAboutContent()
