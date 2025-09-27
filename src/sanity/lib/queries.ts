import { groq } from 'next-sanity'

// Common SEO projection for consistent metadata
const seoProjection = `
  seo {
    metaTitle,
    metaDescription,
    openGraphImage {
      asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    }
  }
`

// Common image projection for optimized image handling
const imageProjection = `
  asset-> {
    _id,
    url,
    metadata {
      dimensions {
        width,
        height
      },
      lqip
    }
  }
`

export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    _id,
    title,
    subtitle,
    heroSection {
      headline,
      description,
      ctaButton {
        text,
        link
      },
      heroImage {
        ${imageProjection}
      }
    },
    introSection {
      title,
      content
    },
    featuredPrograms {
      title,
      description,
      programs[] {
        title,
        description,
        icon,
        link
      }
    },
    callToActionSection {
      title,
      description,
      primaryButton {
        text,
        link
      },
      secondaryButton {
        text,
        link
      }
    },
    ${seoProjection}
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
        image {
          ${imageProjection}
        }
      }
    },
    ${seoProjection}
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
    ${seoProjection}
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
        logo {
          ${imageProjection}
        },
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
    ${seoProjection}
  }
`

export const supportPageQuery = groq`
  *[_type == "supportPage"][0] {
    _id,
    title,
    subtitle,
    donationSection {
      title,
      description,
      content,
      donationTiers[] {
        amount,
        title,
        description,
        benefits
      }
    },
    sponsorshipSection {
      title,
      description,
      content,
      sponsorshipLevels[] {
        level,
        title,
        description,
        minAmount,
        benefits
      }
    },
    impactSection {
      title,
      description,
      impactStats[] {
        number,
        label,
        description
      }
    },
    ${seoProjection}
  }
`

export const contactPageQuery = groq`
  *[_type == "contactPage"][0] {
    _id,
    title,
    subtitle,
    generalContactSection {
      title,
      description,
      content,
      contactMethods[] {
        type,
        label,
        value,
        description
      }
    },
    pressSection {
      title,
      description,
      content,
      pressContacts[] {
        name,
        role,
        email,
        phone
      }
    },
    locationSection {
      title,
      description,
      address,
      hours
    },
    ${seoProjection}
  }
`

export const eventsPageQuery = groq`
  *[_type == "eventsPage"][0] {
    _id,
    title,
    subtitle,
    description,
    isEventsVisible,
    ${seoProjection},
    "upcomingEvents": *[_type == "event" && date >= now()] | order(date asc) {
      _id,
      title,
      slug,
      date,
      time,
      location,
      description,
      eventType,
      isVirtual,
      registrationUrl,
      capacity,
      image {
        ${imageProjection}
      },
      tags
    },
    "pastEvents": *[_type == "event" && date < now()] | order(date desc) {
      _id,
      title,
      slug,
      date,
      time,
      location,
      description,
      eventType,
      isVirtual,
      registrationUrl,
      capacity,
      image {
        ${imageProjection}
      },
      tags
    }
  }
`
