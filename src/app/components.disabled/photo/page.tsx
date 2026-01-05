import ComponentPhotoPage from '../../ComponentPhotoPage/ComponentPhotoPage'
import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { allGalleryImagesQuery } from '@/sanity/lib/galleries-queries'
import { pickRandomImage } from '@/lib/image-hat'

export const metadata: Metadata = {
  title: 'Photo Component - PLAYNE',
  description: 'Photo component demonstration',
}

// Force dynamic rendering for fresh random selection on each request
export const dynamic = 'force-dynamic'

export default async function Page() {
  // Fetch all gallery image metadata
  const allImages = await client.fetch(allGalleryImagesQuery)
  
  // Pick one at random on the server
  const randomImage = pickRandomImage(allImages)
  
  return <ComponentPhotoPage image={randomImage} />
}

