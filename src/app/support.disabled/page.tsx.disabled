import SupportPage from '../SupportPage/SupportPage'
import { staticClient } from '@/sanity/lib/client'
import { supportPageQuery } from '@/sanity/lib/queries'
import { Metadata } from 'next'
import { PortableTextBlock } from 'sanity'
import { SeoData } from '@/sanity/lib/types'

interface SupportPageData {
  _id: string
  title: string
  subtitle: string
  donationSection: {
    title: string
    description: string
    content: PortableTextBlock[]
    donationTiers: Array<{
      amount: string
      title: string
      description: string
      benefits: string[]
    }>
  }
  sponsorshipSection: {
    title: string
    description: string
    content: PortableTextBlock[]
    sponsorshipLevels: Array<{
      level: string
      title: string
      description: string
      benefits: string[]
      minAmount?: string
    }>
  }
  impactSection: {
    title: string
    description: string
    impactStats: Array<{
      number: string
      label: string
      description: string
    }>
  }
  seo?: SeoData
}

async function getSupportPage(): Promise<SupportPageData | null> {
  try {
    return await staticClient.fetch(supportPageQuery)
  } catch (error) {
    console.error('Error fetching support page:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const supportPage = await getSupportPage()
  
  return {
    title: supportPage?.seo?.metaTitle || supportPage?.title || 'Support PLAYNE',
    description: supportPage?.seo?.metaDescription || 'Support PLAYNE\'s mission to empower young minds through practical life education. Make a donation or become a sponsor to help us reach more students.',
  }
}

export default async function Page() {
  const supportPage = await getSupportPage()
  return <SupportPage data={supportPage} />
}
