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

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    _id,
    title,
    subtitle,
    mission {
      title,
      content
    },
    story {
      title,
      content
    },
    team {
      title,
      content,
      members[] {
        name,
        role,
        bio,
        image
      }
    },
    seo
  }
`
