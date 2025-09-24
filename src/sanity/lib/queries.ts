import { groq } from 'next-sanity'

export const pageQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    content,
    seo
  }
`

export const pagesQuery = groq`
  *[_type == "page"] {
    _id,
    title,
    slug,
    seo
  }
`
