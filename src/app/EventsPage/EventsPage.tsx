import styles from './EventsPage.module.css'
import PortableText from '@/components/PortableText/PortableText'
import PageHero from '@/components/PageHero/PageHero'
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

function EventCard({ event }: { event: Event }) {
  return (
    <div className={styles.eventCard}>
      <div className={styles.eventHeader}>
        <div className={styles.eventDate}>
          <div className={styles.eventDateText}>{formatDate(event.date)}</div>
          {event.time && <div className={styles.eventTime}>{event.time}</div>}
        </div>
        <div className={styles.eventType}>
          <span className={`${styles.eventTypeTag} ${styles[event.eventType]}`}>
            {event.eventType}
          </span>
          {event.isVirtual && (
            <span className={styles.virtualTag}>Virtual</span>
          )}
        </div>
      </div>
      
      <div className={styles.eventContent}>
        <h3 className={styles.eventTitle}>{event.title}</h3>
        <div className={styles.eventLocation}>{event.location}</div>
        
        <div className={styles.eventDescription}>
          <PortableText content={event.description} />
        </div>
        
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
            <a 
              href={event.registrationUrl} 
              className={styles.registerButton}
              target="_blank" 
              rel="noopener noreferrer"
            >
              Register
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EventsPage({ data }: EventsPageProps) {
  // Fallback content if no Sanity data or events are hidden
  if (!data || !data.isEventsVisible) {
    return (
      <div className={styles.eventsPage}>
        <PageHero 
          title="Events" 
          subtitle="Join us for talks, workshops, and educational experiences" 
        />

        <section className={styles.section}>
          <div className={styles.sectionContent}>
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
          </div>
        </section>
      </div>
    )
  }

  // Render with Sanity data
  return (
    <div className={styles.eventsPage}>
      <PageHero title={data.title} subtitle={data.subtitle} />

      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <p className={styles.pageDescription}>{data.description}</p>
          
          {data.upcomingEvents && data.upcomingEvents.length > 0 && (
            <div className={styles.eventsSection}>
              <h2 className={styles.sectionTitle}>Upcoming Events</h2>
              <div className={styles.eventsList}>
                {data.upcomingEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}
          
          {data.pastEvents && data.pastEvents.length > 0 && (
            <div className={styles.eventsSection}>
              <h2 className={styles.sectionTitle}>Past Events</h2>
              <div className={styles.eventsList}>
                {data.pastEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
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
              <a href="/get-involved" className={styles.notifyButton}>
                Get Notified
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
