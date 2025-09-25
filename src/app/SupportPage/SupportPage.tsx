import styles from './SupportPage.module.css'
import PortableText from '@/components/PortableText/PortableText'
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
  // Fallback content if no Sanity data
  if (!data) {
    return (
      <div className={styles.supportPage}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Support PLAYNE</h1>
          <p className={styles.subtitle}>
            Help us empower young minds through practical life education
          </p>
        </div>

        <section id="donations" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Make a Donation</h2>
            <p className={styles.sectionDescription}>
              Your donation directly supports our mission to provide practical life education to young people. Every contribution helps us reach more students and create more impactful programs.
            </p>
            
            <div className={styles.donationTiers}>
              <div className={styles.donationTier}>
                <div className={styles.tierAmount}>$25</div>
                <h3 className={styles.tierTitle}>Supporter</h3>
                <p className={styles.tierDescription}>
                  Provides materials for one student in a PLAYNE workshop
                </p>
                <button className={styles.donateButton}>Donate $25</button>
              </div>

              <div className={styles.donationTier}>
                <div className={styles.tierAmount}>$50</div>
                <h3 className={styles.tierTitle}>Advocate</h3>
                <p className={styles.tierDescription}>
                  Supports a full workshop session for a small group
                </p>
                <button className={styles.donateButton}>Donate $50</button>
              </div>

              <div className={styles.donationTier}>
                <div className={styles.tierAmount}>$100</div>
                <h3 className={styles.tierTitle}>Champion</h3>
                <p className={styles.tierDescription}>
                  Funds a complete curriculum pillar module for a classroom
                </p>
                <button className={styles.donateButton}>Donate $100</button>
              </div>

              <div className={styles.donationTier}>
                <div className={styles.tierAmount}>$250</div>
                <h3 className={styles.tierTitle}>Changemaker</h3>
                <p className={styles.tierDescription}>
                  Sponsors a full program series for an entire class
                </p>
                <button className={styles.donateButton}>Donate $250</button>
              </div>
            </div>
          </div>
        </section>

        <section id="sponsorship" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Sponsorship Opportunities</h2>
            <p className={styles.sectionDescription}>
              Partner with PLAYNE to make a lasting impact on youth education. Our sponsorship opportunities offer meaningful ways to support our mission while gaining visibility for your organization.
            </p>
            
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
          </div>
        </section>

        <section id="impact" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Your Impact</h2>
            <p className={styles.sectionDescription}>
              See how your support translates into real change in young people's lives.
            </p>
            
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
          </div>
        </section>
      </div>
    )
  }

  // Render with Sanity data
  return (
    <div className={styles.supportPage}>
      <div className={styles.hero}>
        <h1 className={styles.title}>{data.title}</h1>
        <p className={styles.subtitle}>{data.subtitle}</p>
      </div>

      <section id="donations" className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>{data.donationSection.title}</h2>
          <p className={styles.sectionDescription}>
            {data.donationSection.description}
          </p>
          
          <div className={styles.donationContent}>
            <PortableText content={data.donationSection.content} />
          </div>
          
          <div className={styles.donationTiers}>
            {data.donationSection.donationTiers.map((tier, index) => (
              <div key={index} className={styles.donationTier}>
                <div className={styles.tierAmount}>{tier.amount}</div>
                <h3 className={styles.tierTitle}>{tier.title}</h3>
                <p className={styles.tierDescription}>{tier.description}</p>
                {tier.benefits && tier.benefits.length > 0 && (
                  <ul className={styles.tierBenefits}>
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex}>{benefit}</li>
                    ))}
                  </ul>
                )}
                <button className={styles.donateButton}>Donate {tier.amount}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sponsorship" className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>{data.sponsorshipSection.title}</h2>
          <p className={styles.sectionDescription}>
            {data.sponsorshipSection.description}
          </p>
          
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
        </div>
      </section>

      <section id="impact" className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>{data.impactSection.title}</h2>
          <p className={styles.sectionDescription}>
            {data.impactSection.description}
          </p>
          
          <div className={styles.impactStats}>
            {data.impactSection.impactStats.map((stat, index) => (
              <div key={index} className={styles.impactStat}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
                <p className={styles.statDescription}>{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
