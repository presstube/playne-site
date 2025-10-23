// GROQ queries for galleries

// Get all galleries (for gallery index page)
export const allGalleriesQuery = `
  *[_type == "gallery"] | order(date desc, title asc) {
    _id,
    title,
    slug,
    description,
    date,
    location,
    photographer,
    tags,
    featured,
    "imageCount": count(images),
    "coverImage": images[0] {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      altText,
      caption
    }
  }
`

// Get single gallery by slug
export const galleryBySlugQuery = `
  *[_type == "gallery" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    date,
    location,
    photographer,
    tags,
    featured,
    images[] {
      _key,
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      caption,
      altText,
      order,
      photographer
    },
    seo
  }
`

// Get galleries page settings
export const galleriesPageQuery = `
  *[_type == "galleriesPage"][0] {
    title,
    subtitle,
    description,
    isGalleriesVisible,
    seo
  }
`

// Get featured galleries only
export const featuredGalleriesQuery = `
  *[_type == "gallery" && featured == true] | order(date desc) {
    _id,
    title,
    slug,
    description,
    date,
    location,
    photographer,
    tags,
    featured,
    "imageCount": count(images),
    "coverImage": images[0] {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      altText,
      caption
    }
  }
`

// Get galleries by tag
export const galleriesByTagQuery = `
  *[_type == "gallery" && $tag in tags] | order(date desc) {
    _id,
    title,
    slug,
    description,
    date,
    location,
    photographer,
    tags,
    "imageCount": count(images),
    "coverImage": images[0] {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      altText,
      caption
    }
  }
`

// Get all images from all galleries (flat array) - for random selection
export const allGalleryImagesQuery = `
  *[_type == "gallery"] {
    "images": images[] {
      "imageAsset": asset,
      "assetId": asset.asset->_id,
      "url": asset.asset->url,
      "metadata": asset.asset->metadata,
      "dimensions": asset.asset->metadata.dimensions,
      "lqip": asset.asset->metadata.lqip,
      caption,
      altText,
      photographer,
      "galleryTitle": ^.title,
      "gallerySlug": ^.slug.current
    }
  }.images[]
`

