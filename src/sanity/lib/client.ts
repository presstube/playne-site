import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published', // Only fetch published content
  stega: {
    enabled: false, // Disable visual editing for production
    studioUrl: '/studio',
  },
})

// Optimized client for static generation with aggressive caching
export const staticClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true, // Always use CDN for static builds
  perspective: 'published',
  stega: {
    enabled: false,
  },
  // Cache configuration for build-time queries
  requestTagPrefix: 'playne-static',
})
