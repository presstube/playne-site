import { client } from '@/sanity/lib/client'
import { allGalleryImagesQuery } from '@/sanity/lib/galleries-queries'
import StoryFragment from './StoryFragment'

export default async function Page() {
  // Fetch all gallery images from Sanity
  const images = await client.fetch(allGalleryImagesQuery)

  return <StoryFragment images={images} />
}

