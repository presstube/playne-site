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

export const programsPageQuery = groq`
  *[_type == "programsPage"][0] {
    _id,
    title,
    subtitle,
    curriculumPillars {
      title,
      description,
      pillars[] {
        title,
        description,
        icon
      }
    },
    learningModules {
      title,
      content,
      isComingSoon,
      modules[] {
        title,
        description,
        pillar,
        duration,
        ageGroup
      }
    },
    seo
  }
`

export const getInvolvedPageQuery = groq`
  *[_type == "getInvolvedPage"][0] {
    _id,
    title,
    subtitle,
    partnersSection {
      title,
      description,
      partnerTypes[] {
        title,
        description
      },
      currentPartners[] {
        name,
        description,
        logo,
        website
      }
    },
    interestFormSection {
      title,
      description,
      formFields {
        nameLabel,
        emailLabel,
        organizationLabel,
        roleLabel,
        interestLabel,
        submitButtonText
      }
    },
    emailSignupSection {
      title,
      description,
      placeholder,
      buttonText,
      disclaimer
    },
    seo
  }
`
