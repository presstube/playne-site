import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

// Create a client with write permissions for API routes
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false, // Important: disable CDN for write operations
  token: process.env.SANITY_API_TOKEN, // Write token for mutations
})

// GET - Fetch page configuration from Sanity
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    
    const query = `*[_type == "pageConfiguration" && pageSlug.current == $slug][0]{
      title,
      metaDescription,
      socialImage,
      "componentConfig": componentConfig.configJson,
      lastSavedAt
    }`
    
    const config = await writeClient.fetch(query, { slug })
    
    if (!config) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      )
    }
    
    // Parse the JSON string back to object
    if (config.componentConfig) {
      try {
        config.componentConfig = JSON.parse(config.componentConfig)
      } catch (e) {
        console.error('Failed to parse component config JSON:', e)
        config.componentConfig = {}
      }
    }
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching page config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    )
  }
}

// POST - Save page configuration to Sanity
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    const body = await request.json()
    const { componentConfig, title, metaDescription } = body
    
    // Validate required fields
    if (!componentConfig) {
      return NextResponse.json(
        { error: 'componentConfig is required' },
        { status: 400 }
      )
    }
    
    // Check if document exists
    const existingDoc = await writeClient.fetch(
      `*[_type == "pageConfiguration" && pageSlug.current == $slug][0]{ _id }`
    )
    
    const docData = {
      _type: 'pageConfiguration',
      pageSlug: { _type: 'slug', current: slug },
      title: title || `Story: ${slug}`,
      metaDescription: metaDescription || '',
      componentConfig: {
        configJson: JSON.stringify(componentConfig, null, 2),
      },
      lastSavedAt: new Date().toISOString(),
      lastSavedBy: 'system', // TODO: Add real user tracking
    }
    
    let result
    if (existingDoc) {
      // Update existing document
      result = await writeClient
        .patch(existingDoc._id)
        .set(docData)
        .commit()
    } else {
      // Create new document
      result = await writeClient.create(docData)
    }
    
    return NextResponse.json({ 
      success: true, 
      id: result._id,
      message: existingDoc ? 'Configuration updated' : 'Configuration created'
    })
  } catch (error) {
    console.error('Error saving page config:', error)
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    )
  }
}

