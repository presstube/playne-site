// Test Sanity token permissions
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('next-sanity')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function testToken() {
  console.log('Testing Sanity token permissions...\n')
  console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
  console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET)
  console.log('Token exists:', !!process.env.SANITY_API_TOKEN)
  console.log('Token prefix:', process.env.SANITY_API_TOKEN?.substring(0, 10) + '...\n')

  try {
    // Test READ
    console.log('1. Testing READ permission...')
    const docs = await client.fetch('*[_type == "pageConfiguration"][0..2]')
    console.log('✓ READ works - found', docs.length, 'documents\n')

    // Test CREATE
    console.log('2. Testing CREATE permission...')
    const testDoc = {
      _type: 'pageConfiguration',
      pageSlug: { _type: 'slug', current: 'test-permissions' },
      title: 'Permission Test',
      componentConfig: {
        configJson: '{"test": true}',
      },
      lastSavedAt: new Date().toISOString(),
      lastSavedBy: 'token-test',
    }
    const created = await client.create(testDoc)
    console.log('✓ CREATE works - created doc:', created._id, '\n')

    // Test UPDATE
    console.log('3. Testing UPDATE permission...')
    const updated = await client
      .patch(created._id)
      .set({ title: 'Permission Test Updated' })
      .commit()
    console.log('✓ UPDATE works - updated doc:', updated._id, '\n')

    // Test DELETE
    console.log('4. Testing DELETE permission...')
    await client.delete(created._id)
    console.log('✓ DELETE works - cleaned up test doc\n')

    console.log('✅ All permissions verified! Token has EDITOR role.')
  } catch (error) {
    console.error('❌ Permission error:', error.message)
    console.error('\nFull error:', error.response?.body || error)
    console.log('\n⚠️  Generate new token with EDITOR permissions at:')
    console.log('   https://www.sanity.io/manage')
  }
}

testToken()

