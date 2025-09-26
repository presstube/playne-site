import HomePage from './HomePage/HomePage'
import { client } from '@/sanity/lib/client'
import { homePageQuery } from '@/sanity/lib/queries'
import { Metadata } from 'next'
import { PortableTextBlock } from 'sanity'

interface HomePageData {
  _id: string
  title: string
  subtitle?: string
  heroSection?: {
    headline?: string
    description?: PortableTextBlock[]
    ctaButton?: {
      text?: string
      link?: string
    }
    heroImage?: any
  }
  introSection?: {
    title?: string
    content?: PortableTextBlock[]
  }
  featuredPrograms?: {
    title?: string
    description?: string
    programs?: Array<{
      title: string
      description: string
      icon?: string
      link?: string
    }>
  }
  callToActionSection?: {
    title?: string
    description?: string
    primaryButton?: {
      text?: string
      link?: string
    }
    secondaryButton?: {
      text?: string
      link?: string
    }
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

async function getHomePage(): Promise<HomePageData | null> {
  try {
    return await client.fetch(homePageQuery)
  } catch (error) {
    console.error('Error fetching home page:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePage()
  
  return {
    title: homePage?.seo?.metaTitle || homePage?.title || 'Home - PLAYNE',
    description: homePage?.seo?.metaDescription || 'Empowering young minds through practical life education',
  }
}

export default async function Page() {
  const homePage = await getHomePage()
  return <HomePage data={homePage} />
}
