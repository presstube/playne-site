#!/usr/bin/env node

/**
 * Simple script to help initialize Sanity project
 * Run with: node scripts/init-sanity.js
 */

const fs = require('fs')
const path = require('path')

console.log('🚀 Sanity Project Setup Helper\n')

const envPath = path.join(process.cwd(), '.env.local')
const envExamplePath = path.join(process.cwd(), '.env.example')

// Check if .env.local already exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local already exists')
} else {
  // Create .env.local from template
  const envTemplate = `# Sanity Configuration
# Replace with your actual Sanity project ID and dataset
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
`

  try {
    fs.writeFileSync(envPath, envTemplate)
    console.log('✅ Created .env.local file')
  } catch (error) {
    console.error('❌ Failed to create .env.local:', error.message)
  }
}

console.log('\n📋 Next Steps:')
console.log('1. Update .env.local with your Sanity project credentials')
console.log('2. Run: npm run dev')
console.log('3. Visit: http://localhost:3000/studio')
console.log('4. Create pages with slugs "home" and "about"')
console.log('\n🔗 Get your Sanity credentials at: https://www.sanity.io/manage')
