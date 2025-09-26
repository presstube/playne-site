import styles from './HomePage.module.css'
import PortableText from '@/components/PortableText/PortableText'
import Link from 'next/link'
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

interface HomePageProps {
  data: HomePageData | null
}

export default function HomePage({ data }: HomePageProps) {
  if (!data) {
    return (
      <div className={styles.setupContainer}>
        <h1 className={styles.setupTitle}>Welcome to PLAYNE</h1>
        <p className={styles.setupDescription}>
          This is the home page. To add content, please:
        </p>
        <ol className={styles.setupList}>
          <li>1. Set up your Sanity project credentials</li>
          <li>2. Go to <Link href="/studio" className={styles.setupLink}>/studio</Link></li>
          <li>3. Create a new "Home Page" document</li>
        </ol>
      </div>
    )
  }

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      {data.heroSection && (
        <section className={styles.heroSection}>
          {data.heroSection.headline && (
            <h1 className={styles.heroHeadline}>{data.heroSection.headline}</h1>
          )}
          {data.heroSection.description && (
            <div className={styles.heroDescription}>
              <PortableText content={data.heroSection.description} />
            </div>
          )}
          {data.heroSection.ctaButton && data.heroSection.ctaButton.text && (
            <Link 
              href={data.heroSection.ctaButton.link || '#'} 
              className={styles.heroButton}
            >
              {data.heroSection.ctaButton.text}
            </Link>
          )}
        </section>
      )}

      {/* Introduction Section */}
      {data.introSection && (
        <section className={styles.introSection}>
          {data.introSection.title && (
            <h2 className={styles.sectionTitle}>{data.introSection.title}</h2>
          )}
          {data.introSection.content && (
            <div className={styles.introContent}>
              <PortableText content={data.introSection.content} />
            </div>
          )}
        </section>
      )}

      {/* Featured Programs Section */}
      {data.featuredPrograms && (
        <section className={styles.programsSection}>
          {data.featuredPrograms.title && (
            <h2 className={styles.sectionTitle}>{data.featuredPrograms.title}</h2>
          )}
          {data.featuredPrograms.description && (
            <p className={styles.sectionDescription}>{data.featuredPrograms.description}</p>
          )}
          {data.featuredPrograms.programs && data.featuredPrograms.programs.length > 0 && (
            <div className={styles.programsGrid}>
              {data.featuredPrograms.programs.map((program, index) => (
                <div key={index} className={styles.programCard}>
                  {program.icon && (
                    <div className={styles.programIcon}>{program.icon}</div>
                  )}
                  <h3 className={styles.programTitle}>{program.title}</h3>
                  <p className={styles.programDescription}>{program.description}</p>
                  {program.link && (
                    <Link href={program.link} className={styles.programLink}>
                      Learn More
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Call to Action Section */}
      {data.callToActionSection && (
        <section className={styles.ctaSection}>
          {data.callToActionSection.title && (
            <h2 className={styles.ctaTitle}>{data.callToActionSection.title}</h2>
          )}
          {data.callToActionSection.description && (
            <p className={styles.ctaDescription}>{data.callToActionSection.description}</p>
          )}
          <div className={styles.ctaButtons}>
            {data.callToActionSection.primaryButton && data.callToActionSection.primaryButton.text && (
              <Link 
                href={data.callToActionSection.primaryButton.link || '#'} 
                className={styles.ctaPrimaryButton}
              >
                {data.callToActionSection.primaryButton.text}
              </Link>
            )}
            {data.callToActionSection.secondaryButton && data.callToActionSection.secondaryButton.text && (
              <Link 
                href={data.callToActionSection.secondaryButton.link || '#'} 
                className={styles.ctaSecondaryButton}
              >
                {data.callToActionSection.secondaryButton.text}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Fallback content if no structured content exists */}
      {!data.heroSection && !data.introSection && !data.featuredPrograms && !data.callToActionSection && (
        <div className={styles.fallbackContent}>
          <h1 className={styles.title}>{data.title}</h1>
          {data.subtitle && (
            <p className={styles.subtitle}>{data.subtitle}</p>
          )}
        </div>
      )}
    </div>
  )
}
