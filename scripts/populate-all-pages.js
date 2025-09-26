#!/usr/bin/env node

/**
 * Populate all page content in Sanity
 * Run with: node scripts/populate-all-pages.js
 */

const { spawn } = require('child_process')
const path = require('path')

const scripts = [
  'populate-home-content.js',
  'populate-about-content.js', 
  'populate-programs-content.js',
  'populate-events-content.js',
  'populate-get-involved-content.js',
  'populate-support-content.js',
  'populate-contact-content.js'
]

async function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Running ${scriptName}...`)
    
    const scriptPath = path.join(__dirname, scriptName)
    const child = spawn('node', [scriptPath], { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${scriptName} completed successfully`)
        resolve()
      } else {
        console.error(`❌ ${scriptName} failed with code ${code}`)
        reject(new Error(`Script failed: ${scriptName}`))
      }
    })
    
    child.on('error', (error) => {
      console.error(`❌ Error running ${scriptName}:`, error.message)
      reject(error)
    })
  })
}

async function populateAllPages() {
  console.log('🎯 Starting population of all PLAYNE pages...\n')
  
  try {
    for (const script of scripts) {
      await runScript(script)
    }
    
    console.log('\n🎉 All pages populated successfully!')
    console.log('🔗 Visit http://localhost:3000/studio to see your content')
    console.log('🌐 Visit http://localhost:3000 to see your website')
    
  } catch (error) {
    console.error('\n💥 Population failed:', error.message)
    console.log('\n💡 Make sure you have:')
    console.log('1. SANITY_API_TOKEN in your .env.local file')
    console.log('2. Correct Sanity project credentials')
    console.log('3. API token has "Editor" permissions')
  }
}

populateAllPages()
