import HomePage from './HomePage/HomePage'
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
    return await client.fetch(pageQuery, { slug: 'home' })
  } catch (error) {
    console.error('Error fetching home page:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage()
  
  return {
    title: page?.seo?.metaTitle || page?.title || 'Home',
    description: page?.seo?.metaDescription || 'Welcome to our website',
  }
}

export default async function Page() {
  const page = await getPage()
  return <HomePage page={page} />
}
