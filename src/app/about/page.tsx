import AboutPage from '../AboutPage/AboutPage'
import { client } from '@/sanity/lib/client'
import { aboutPageQuery } from '@/sanity/lib/queries'
import { Metadata } from 'next'
import { PortableTextBlock } from 'sanity'

interface AboutPageData {
  _id: string
  title: string
  subtitle: string
  mission: {
    title: string
    content: PortableTextBlock[]
  }
  story: {
    title: string
    content: PortableTextBlock[]
  }
  team: {
    title: string
    content: PortableTextBlock[]
    members: Array<{
      name: string
      role: string
      bio: string
      image?: any
    }>
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

async function getAboutPage(): Promise<AboutPageData | null> {
  try {
    return await client.fetch(aboutPageQuery)
  } catch (error) {
    console.error('Error fetching about page:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const aboutPage = await getAboutPage()
  
  return {
    title: aboutPage?.seo?.metaTitle || aboutPage?.title || 'About - PLAYNE',
    description: aboutPage?.seo?.metaDescription || 'Learn about PLAYNE\'s mission to empower young minds through practical life education',
  }
}

export default async function Page() {
  const aboutPage = await getAboutPage()
  return <AboutPage data={aboutPage} />
}