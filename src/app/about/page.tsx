import AboutPage from '../AboutPage/AboutPage'
import { client } from '@/sanity/lib/client'
import { pageQuery } from '@/sanity/lib/queries'
import { Metadata } from 'next'
import { PortableTextBlock } from 'sanity'

interface Page {
  _id: string
  title: string
  content: PortableTextBlock[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

async function getPage(): Promise<Page | null> {
  try {
    return await client.fetch(pageQuery, { slug: 'about' })
  } catch (error) {
    console.error('Error fetching about page:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage()
  
  return {
    title: page?.seo?.metaTitle || page?.title || 'About',
    description: page?.seo?.metaDescription || 'Learn more about us',
  }
}

export default async function Page() {
  const page = await getPage()
  return <AboutPage page={page} />
}