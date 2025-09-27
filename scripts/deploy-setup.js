#!/usr/bin/env node

/**
 * PLAYNE Website Deployment Setup Script
 * 
 * This script helps set up the deployment environment and validates configuration.
 * Run before deploying to Vercel to ensure everything is properly configured.
 */

const fs = require('fs')
const path = require('path')

console.log('🚀 PLAYNE Website Deployment Setup\n')

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json')
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Run this script from the project root.')
  process.exit(1)
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
if (packageJson.name !== 'sanity-site') {
  console.error('❌ Error: This doesn\'t appear to be the PLAYNE website project.')
  process.exit(1)
}

console.log('✅ Project validation passed')

// Check required files
const requiredFiles = [
  'next.config.ts',
  'vercel.json',
  'src/sanity/lib/client.ts',
  'src/sanity/lib/queries.ts',
  'DEPLOYMENT.md'
]

console.log('\n📁 Checking required files...')
let allFilesExist = true

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - MISSING`)
    allFilesExist = false
  }
})

if (!allFilesExist) {
  console.error('\n❌ Some required files are missing. Please ensure all files are in place.')
  process.exit(1)
}

// Check environment variables
console.log('\n🔧 Environment Variables Check...')

const requiredEnvVars = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET'
]

const missingEnvVars = []

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}: ${process.env[envVar]}`)
  } else {
    console.log(`⚠️  ${envVar}: Not set (required for production)`)
    missingEnvVars.push(envVar)
  }
})

if (missingEnvVars.length > 0) {
  console.log('\n📝 Environment Variables Setup:')
  console.log('For local development, create .env.local with:')
  console.log('')
  missingEnvVars.forEach(envVar => {
    if (envVar === 'NEXT_PUBLIC_SANITY_PROJECT_ID') {
      console.log(`${envVar}=your-sanity-project-id`)
    } else if (envVar === 'NEXT_PUBLIC_SANITY_DATASET') {
      console.log(`${envVar}=production`)
    }
  })
  console.log('')
  console.log('For Vercel deployment, add these in:')
  console.log('Vercel Dashboard → Project Settings → Environment Variables')
}

// Test build (optional)
console.log('\n🏗️  Build Test (optional):')
console.log('To test the build locally, run:')
console.log('  npm run build')
console.log('')

// Deployment checklist
console.log('📋 Vercel Deployment Checklist:')
console.log('')
console.log('1. ✅ Push code to GitHub repository')
console.log('2. ⏳ Connect repository to Vercel')
console.log('3. ⏳ Add environment variables in Vercel dashboard')
console.log('4. ⏳ Deploy and test')
console.log('5. ⏳ Set up custom domain (optional)')
console.log('6. ⏳ Configure Sanity webhook (Phase 3)')
console.log('')

console.log('📚 Next Steps:')
console.log('1. Review DEPLOYMENT.md for detailed instructions')
console.log('2. Ensure Sanity project has content populated')
console.log('3. Follow Vercel deployment steps in DEPLOYMENT.md')
console.log('')

console.log('🎉 Setup validation complete!')
console.log('Ready for Vercel deployment!')
