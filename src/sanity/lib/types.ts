// Sanity image types for better TypeScript support

export interface SanityImageAsset {
  _id: string
  url: string
  metadata: {
    dimensions: {
      width: number
      height: number
    }
    lqip?: string
  }
}

export interface SanityImage {
  asset: SanityImageAsset
  hotspot?: {
    x: number
    y: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface SanityReference {
  _type: 'reference'
  _ref: string
}

// SEO types
export interface SeoData {
  metaTitle?: string
  metaDescription?: string
  openGraphImage?: SanityImage
}
