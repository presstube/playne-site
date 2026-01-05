import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export default async function BlankPage() {
  // 1. Load all gallery images with metadata
  const images = await client.fetch(`
    *[_type == "gallery"] {
      "images": images[] {
        "imageAsset": asset.asset,
        "dimensions": asset.asset->metadata.dimensions,
        "url": asset.asset->url,
        caption,
        altText
      }
    }.images[]
  `)

  // 2. Pick one from a hat
  const randomImage = images[Math.floor(Math.random() * images.length)]

  // 3. Generate URL for max 1200px (displays at 600px retina)
  const imageUrl = urlFor(randomImage.imageAsset)
    .maxWidth(1200)
    .maxHeight(1200)
    .fit('max')
    .quality(90)
    .url()

  // 4. Console log the metadata
  console.log('\n=== RANDOMLY SELECTED IMAGE ===')
  console.log('Dimensions:', randomImage.dimensions)
  console.log('Original URL:', randomImage.url)
  console.log('Generated URL:', imageUrl)
  console.log('Alt Text:', randomImage.altText)

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f0f0'
    }}>
      <img
        src={imageUrl}
        alt={randomImage.altText}
        style={{
          maxWidth: '600px',
          maxHeight: '600px',
          objectFit: 'contain'
        }}
      />
    </div>
  )
}
