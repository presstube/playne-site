import styles from './EventsPage.module.css'
import PortableText from '@/components/PortableText/PortableText'
import Headline from '@/components/Headline/Headline'
import PageSection from '@/components/PageSection/PageSection'
import EventCard from '@/components/EventCard/EventCard'
import LinkButton from '@/components/LinkButton/LinkButton'
import { PortableTextBlock } from 'sanity'
import { SanityImage, SeoData } from '@/sanity/lib/types'

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
  image?: SanityImage
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
  seo?: SeoData
}

interface EventsPageProps {
  data: EventsPageData | null
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function EventCardWrapper({ event }: { event: Event }) {
  const formattedDate = formatDate(event.date)
  const eventType = event.isVirtual ? `${event.eventType} (Virtual)` : event.eventType
  
  return (
    <EventCard
      title={event.title}
      date={formattedDate}
      time={event.time}
      location={event.location}
      type={eventType}
      description={<PortableText content={event.description} />}
    >
      {event.tags && event.tags.length > 0 && (
        <div className={styles.eventTags}>
          {event.tags.map((tag, index) => (
            <span key={index} className={styles.eventTag}>{tag}</span>
          ))}
        </div>
      )}
      
      <div className={styles.eventFooter}>
        {event.capacity && (
          <div className={styles.eventCapacity}>
            Capacity: {event.capacity} people
          </div>
        )}
        {event.registrationUrl && (
          <LinkButton 
            href={event.registrationUrl} 
            variant="primary"
            size="medium"
            external
          >
            Register
          </LinkButton>
        )}
      </div>
    </EventCard>
  )
}

export default function EventsPage({ data }: EventsPageProps) {
  // Fallback content if no Sanity data or events are hidden
  if (!data || !data.isEventsVisible) {
    return (
      <div className={styles.eventsPage}>
        <div className={styles.brandHeader}>
          <Headline 
            text="Events"
            caseType="all-caps"
            align="center"
            fg="var(--brand-offwhite)"
            bg="var(--brand-black)"
          />
          <p className={styles.brandSubtitle}>
            Join us for talks, workshops, and educational experiences
          </p>
        </div>

        <PageSection>
          <div className={styles.comingSoon}>
              <h2 className={styles.comingSoonTitle}>Events Coming Soon</h2>
              <p className={styles.comingSoonDescription}>
                We're planning exciting talks and workshops about practical life education. 
                Stay tuned for announcements about upcoming events where you can learn more 
                about PLAYNE's approach to empowering young minds.
              </p>
              <div className={styles.comingSoonActions}>
                <p className={styles.comingSoonText}>
                  Want to be notified when we announce events? 
                  <a href="/get-involved" className={styles.comingSoonLink}>
                    Sign up for our email list
                  </a>
                </p>
              </div>
          </div>
        </PageSection>
      </div>
    )
  }

  // Render with Sanity data
  return (
    <div className={styles.eventsPage}>
      <div className={styles.brandHeader}>
        <Headline 
          text={data.title}
          caseType="all-caps"
          align="center"
          fg="var(--brand-offwhite)"
          bg="var(--brand-black)"
        />
        {data.subtitle && (
          <p className={styles.brandSubtitle}>{data.subtitle}</p>
        )}
      </div>

      <PageSection>
        <p className={styles.pageDescription}>{data.description}</p>
          
          {data.upcomingEvents && data.upcomingEvents.length > 0 && (
            <div className={styles.eventsSection}>
              <h2 className={styles.sectionTitle}>Upcoming Events</h2>
              <div className={styles.eventsList}>
                {data.upcomingEvents.map((event) => (
                  <EventCardWrapper key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}
          
          {data.pastEvents && data.pastEvents.length > 0 && (
            <div className={styles.eventsSection}>
              <h2 className={styles.sectionTitle}>Past Events</h2>
              <div className={styles.eventsList}>
                {data.pastEvents.map((event) => (
                  <EventCardWrapper key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}
          
          {(!data.upcomingEvents || data.upcomingEvents.length === 0) && 
           (!data.pastEvents || data.pastEvents.length === 0) && (
            <div className={styles.noEvents}>
              <h2 className={styles.noEventsTitle}>No Events Yet</h2>
              <p className={styles.noEventsDescription}>
                We're planning our first events. Check back soon or sign up for updates!
              </p>
              <LinkButton href="/get-involved" variant="primary" size="medium">
                Get Notified
              </LinkButton>
            </div>
          )}
      </PageSection>
    </div>
  )
}
