// Image Hat - Utility for random gallery image selection

export interface GalleryImage {
  imageAsset: any // Full Sanity image object for urlFor()
  assetId: string
  url: string
  metadata: any
  dimensions: { width: number; height: number; aspectRatio: number }
  lqip: string
  caption: string
  altText: string
  photographer?: string
  galleryTitle: string
  gallerySlug: string
}

/**
 * Pick one random image from an array of gallery images
 */
export function pickRandomImage(images: GalleryImage[]): GalleryImage | null {
  if (!images || images.length === 0) return null
  return images[Math.floor(Math.random() * images.length)]
}

/**
 * Pick multiple random images (shuffled)
 */
export function pickRandomImages(
  images: GalleryImage[],
  count: number
): GalleryImage[] {
  if (!images || images.length === 0) return []
  const shuffled = [...images].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, images.length))
}

/**
 * Filter images by gallery slug
 */
export function filterByGallery(
  images: GalleryImage[],
  gallerySlug: string
): GalleryImage[] {
  return images.filter((img) => img.gallerySlug === gallerySlug)
}

/**
 * Filter images by photographer
 */
export function filterByPhotographer(
  images: GalleryImage[],
  photographer: string
): GalleryImage[] {
  return images.filter(
    (img) => img.photographer?.toLowerCase().includes(photographer.toLowerCase())
  )
}

