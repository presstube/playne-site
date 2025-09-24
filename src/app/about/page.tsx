import { client } from '@/sanity/lib/client'
import { pageQuery } from '@/sanity/lib/queries'
import Layout from '@/components/Layout'
import PortableText from '@/components/PortableText'
import { Metadata } from 'next'
import Link from 'next/link'
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

export default async function About() {
  const page = await getPage()

  if (!page) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-gray-600 mb-8">
            This is the about page. To add content, please:
          </p>
          <ol className="text-left max-w-md mx-auto space-y-2 text-gray-700">
            <li>1. Set up your Sanity project credentials</li>
            <li>2. Go to <Link href="/studio" className="text-blue-600 hover:underline">/studio</Link></li>
            <li>3. Create a new page with slug &quot;about&quot;</li>
          </ol>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{page.title}</h1>
        {page.content && <PortableText content={page.content} />}
      </div>
    </Layout>
  )
}
