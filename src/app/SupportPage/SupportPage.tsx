'use client'

import styles from './SupportPage.module.css'
import PortableText from '@/components/PortableText/PortableText'
import PageHero from '@/components/PageHero/PageHero'
import PageSection from '@/components/PageSection/PageSection'
import DonationCard from '@/components/DonationCard/DonationCard'
import { PortableTextBlock } from 'sanity'

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
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

interface SupportPageProps {
  data: SupportPageData | null
}

export default function SupportPage({ data }: SupportPageProps) {
  const handleDonate = (amount: string) => {
    // TODO: Implement donation functionality
    console.log(`Donate ${amount} clicked`)
    // This could redirect to a payment processor, open a modal, etc.
  }

  // Fallback content if no Sanity data
  if (!data) {
    return (
      <div className={styles.supportPage}>
        <PageHero 
          title="Support PLAYNE" 
          subtitle="Help us empower young minds through practical life education" 
        />

        <PageSection 
          id="donations" 
          title="Make a Donation"
          description="Your donation directly supports our mission to provide practical life education to young people. Every contribution helps us reach more students and create more impactful programs."
        >
            
            <div className={styles.donationTiers}>
              <DonationCard
                amount="$25"
                title="Supporter"
                description="Provides materials for one student in a PLAYNE workshop"
                onDonate={handleDonate}
              />

              <DonationCard
                amount="$50"
                title="Advocate"
                description="Supports a full workshop session for a small group"
                onDonate={handleDonate}
              />

              <DonationCard
                amount="$100"
                title="Champion"
                description="Funds a complete curriculum pillar module for a classroom"
                onDonate={handleDonate}
              />

              <DonationCard
                amount="$250"
                title="Changemaker"
                description="Sponsors a full program series for an entire class"
                onDonate={handleDonate}
              />
            </div>
        </PageSection>

        <PageSection 
          id="sponsorship" 
          title="Sponsorship Opportunities"
          description="Partner with PLAYNE to make a lasting impact on youth education. Our sponsorship opportunities offer meaningful ways to support our mission while gaining visibility for your organization."
        >
            
            <div className={styles.sponsorshipLevels}>
              <div className={styles.sponsorshipLevel}>
                <h3 className={styles.levelTitle}>Community Partner</h3>
                <p className={styles.levelDescription}>
                  Support local programs and get recognized in our community outreach
                </p>
                <ul className={styles.benefitsList}>
                  <li>Logo on program materials</li>
                  <li>Social media recognition</li>
                  <li>Quarterly impact reports</li>
                </ul>
              </div>

              <div className={styles.sponsorshipLevel}>
                <h3 className={styles.levelTitle}>Program Sponsor</h3>
                <p className={styles.levelDescription}>
                  Sponsor entire curriculum pillars and help shape educational content
                </p>
                <ul className={styles.benefitsList}>
                  <li>Named program sponsorship</li>
                  <li>Website recognition</li>
                  <li>Direct program feedback</li>
                  <li>Annual impact presentation</li>
                </ul>
              </div>

              <div className={styles.sponsorshipLevel}>
                <h3 className={styles.levelTitle}>Founding Partner</h3>
                <p className={styles.levelDescription}>
                  Join us as a founding partner in revolutionizing youth education
                </p>
                <ul className={styles.benefitsList}>
                  <li>Prominent brand placement</li>
                  <li>Co-branded materials</li>
                  <li>Advisory board participation</li>
                  <li>Exclusive partnership benefits</li>
                </ul>
              </div>
            </div>
        </PageSection>

        <PageSection 
          id="impact" 
          title="Your Impact"
          description="See how your support translates into real change in young people's lives."
        >
            
            <div className={styles.impactStats}>
              <div className={styles.impactStat}>
                <div className={styles.statNumber}>500+</div>
                <div className={styles.statLabel}>Students Reached</div>
                <p className={styles.statDescription}>
                  Young people who have participated in PLAYNE programs
                </p>
              </div>

              <div className={styles.impactStat}>
                <div className={styles.statNumber}>25+</div>
                <div className={styles.statLabel}>Partner Schools</div>
                <p className={styles.statDescription}>
                  Educational institutions implementing our curriculum
                </p>
              </div>

              <div className={styles.impactStat}>
                <div className={styles.statNumber}>4</div>
                <div className={styles.statLabel}>Core Pillars</div>
                <p className={styles.statDescription}>
                  Essential life skills areas we focus on
                </p>
              </div>
            </div>
        </PageSection>
      </div>
    )
  }

  // Render with Sanity data
  return (
    <div className={styles.supportPage}>
      <PageHero title={data.title} subtitle={data.subtitle} />

      <PageSection 
        id="donations" 
        title={data.donationSection.title}
        description={data.donationSection.description}
      >
          
          <div className={styles.donationContent}>
            <PortableText content={data.donationSection.content} />
          </div>
          
          <div className={styles.donationTiers}>
            {data.donationSection.donationTiers.map((tier, index) => (
              <DonationCard
                key={index}
                amount={tier.amount}
                title={tier.title}
                description={tier.description}
                benefits={tier.benefits}
                onDonate={handleDonate}
              />
            ))}
          </div>
      </PageSection>

      <PageSection 
        id="sponsorship" 
        title={data.sponsorshipSection.title}
        description={data.sponsorshipSection.description}
      >
          
          <div className={styles.sponsorshipContent}>
            <PortableText content={data.sponsorshipSection.content} />
          </div>
          
          <div className={styles.sponsorshipLevels}>
            {data.sponsorshipSection.sponsorshipLevels.map((level, index) => (
              <div key={index} className={styles.sponsorshipLevel}>
                <h3 className={styles.levelTitle}>{level.title}</h3>
                {level.minAmount && (
                  <div className={styles.levelAmount}>{level.minAmount}+</div>
                )}
                <p className={styles.levelDescription}>{level.description}</p>
                {level.benefits && level.benefits.length > 0 && (
                  <ul className={styles.benefitsList}>
                    {level.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex}>{benefit}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
      </PageSection>

      <PageSection 
        id="impact" 
        title={data.impactSection.title}
        description={data.impactSection.description}
      >
          
          <div className={styles.impactStats}>
            {data.impactSection.impactStats.map((stat, index) => (
              <div key={index} className={styles.impactStat}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
                <p className={styles.statDescription}>{stat.description}</p>
              </div>
            ))}
          </div>
      </PageSection>
    </div>
  )
}
