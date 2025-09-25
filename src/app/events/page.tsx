import EventsPage from '../EventsPage/EventsPage'
import { client } from '@/sanity/lib/client'
import { eventsPageQuery } from '@/sanity/lib/queries'
import { Metadata } from 'next'
import { PortableTextBlock } from 'sanity'

interface Event {
  _id: string
  title: string
  slug: string
  date: string
  time?: string
  location: string
  description: PortableTextBlock[]
  eventType: 'talk' | 'workshop' | 'webinar' | 'conference' | 'other'
  isVirtual: boolean
  registrationUrl?: string
  capacity?: number
  image?: any
  tags?: string[]
}

interface EventsPageData {
  _id: string
  title: string
  subtitle: string
  description: string
  upcomingEvents: Event[]
  pastEvents: Event[]
  isEventsVisible: boolean
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

async function getEventsPage(): Promise<EventsPageData | null> {
  try {
    return await client.fetch(eventsPageQuery)
  } catch (error) {
    console.error('Error fetching events page:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const eventsPage = await getEventsPage()
  
  return {
    title: eventsPage?.seo?.metaTitle || eventsPage?.title || 'Events - PLAYNE',
    description: eventsPage?.seo?.metaDescription || 'Join PLAYNE for talks, workshops, and educational events. Learn about practical life education and connect with our community.',
  }
}

export default async function Page() {
  const eventsPage = await getEventsPage()
  return <EventsPage data={eventsPage} />
}
