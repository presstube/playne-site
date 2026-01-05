import ContactPage from '../ContactPage/ContactPage'
import { staticClient } from '@/sanity/lib/client'
import { contactPageQuery } from '@/sanity/lib/queries'
import { Metadata } from 'next'
import { PortableTextBlock } from 'sanity'
import { SeoData } from '@/sanity/lib/types'

interface ContactPageData {
  _id: string
  title: string
  subtitle: string
  generalContactSection: {
    title: string
    description: string
    content: PortableTextBlock[]
    contactMethods: Array<{
      type: string
      label: string
      value: string
      description?: string
    }>
  }
  pressSection: {
    title: string
    description: string
    content: PortableTextBlock[]
    pressContacts: Array<{
      name: string
      role: string
      email: string
      phone?: string
    }>
  }
  locationSection: {
    title: string
    description: string
    address?: string
    hours?: string
  }
  seo?: SeoData
}

async function getContactPage(): Promise<ContactPageData | null> {
  try {
    return await staticClient.fetch(contactPageQuery)
  } catch (error) {
    console.error('Error fetching contact page:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const contactPage = await getContactPage()
  
  return {
    title: contactPage?.seo?.metaTitle || contactPage?.title || 'Contact - PLAYNE',
    description: contactPage?.seo?.metaDescription || 'Get in touch with PLAYNE. Contact us for general inquiries, press information, or to learn more about our practical life education programs.',
  }
}

export default async function Page() {
  const contactPage = await getContactPage()
  return <ContactPage data={contactPage} />
}
