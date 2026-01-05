import ComponentPhotoPathPage from '../../ComponentPhotoPathPage/ComponentPhotoPathPage'
import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { allGalleryImagesQuery } from '@/sanity/lib/galleries-queries'
import { pickRandomImage } from '@/lib/image-hat'

export const metadata: Metadata = {
  title: 'PhotoPath Component - PLAYNE',
  description: 'PhotoPath component demonstration',
}

// Force dynamic rendering for fresh random selection on each request
export const dynamic = 'force-dynamic'

export default async function Page() {
  // Fetch all gallery image metadata
  const allImages = await client.fetch(allGalleryImagesQuery)
  
  // Pick one at random on the server
  const randomImage = pickRandomImage(allImages)
  
  return <ComponentPhotoPathPage image={randomImage} />
}

