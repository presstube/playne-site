import styles from './AboutPage.module.css'
import PortableText from '@/components/PortableText/PortableText'
import Headline from '@/components/Headline/Headline'
import PageSection from '@/components/PageSection/PageSection'
import { PortableTextBlock } from 'sanity'
import { SanityImage, SeoData } from '@/sanity/lib/types'

interface AboutPageData {
  _id: string
  title: string
  subtitle: string
  mission: {
    title: string
    content: PortableTextBlock[]
  }
  story: {
    title: string
    content: PortableTextBlock[]
  }
  team: {
    title: string
    content: PortableTextBlock[]
    members: Array<{
      name: string
      role: string
      bio: string
        image?: SanityImage
    }>
  }
  seo?: SeoData
}

interface AboutPageProps {
  data: AboutPageData | null
}

export default function AboutPage({ data }: AboutPageProps) {
  // Fallback content if no Sanity data
  if (!data) {
    return (
      <div className={styles.aboutPage}>
        <div className={styles.brandHeader}>
          <Headline 
            text="About PLAYNE"
            caseType="all-caps"
            align="center"
            fg="var(--brand-offwhite)"
            bg="var(--brand-black)"
          />
          <p className={styles.brandSubtitle}>
            Empowering young minds through practical life education
          </p>
        </div>

        <PageSection id="mission" title="Our Mission">
          <div className={styles.missionContent}>
            <p className={styles.missionText}>
              PLAYNE uses creativity to teach the things we wish we learned in school — how to care for our bodies, understand our emotions, manage money, and find our voice. Through playful, practical lessons rooted in art, we give young people the space to explore <em>who they are</em> before being told who to be.
            </p>
          </div>
        </PageSection>

        <PageSection id="story" title="Our Story">
          <div className={styles.storyContent}>
            <p className={styles.storyText}>
              We believe every young person deserves the tools to thrive, not just in school, but in life. PLAYNE reimagines learning by putting curiosity, wellness, and self-discovery at the center. Through hands-on experiences in classrooms and communities, we help students gain a deeper understanding of themselves and the world around them.
            </p>
            <p className={styles.storyText}>
              <em>More of our story coming soon...</em>
            </p>
          </div>
        </PageSection>

        <PageSection id="team" title="Our Team">
          <div className={styles.teamContent}>
            <p className={styles.teamText}>
              Meet the passionate educators and creators behind PLAYNE.
            </p>
            <div className={styles.teamPlaceholder}>
              <p><em>Team member profiles coming soon...</em></p>
            </div>
          </div>
        </PageSection>
      </div>
    )
  }

  // Render with Sanity data
  return (
    <div className={styles.aboutPage}>
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

      <PageSection id="mission" title={data.mission.title}>
        <div className={styles.missionContent}>
          <PortableText content={data.mission.content} />
        </div>
      </PageSection>

      <PageSection id="story" title={data.story.title}>
        <div className={styles.storyContent}>
          <PortableText content={data.story.content} />
        </div>
      </PageSection>

      <PageSection id="team" title={data.team.title}>
        <div className={styles.teamContent}>
          <PortableText content={data.team.content} />
          {data.team.members && data.team.members.length > 0 && (
            <div className={styles.teamMembers}>
              {data.team.members.map((member, index) => (
                <div key={index} className={styles.teamMember}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberRole}>{member.role}</p>
                  <p className={styles.memberBio}>{member.bio}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageSection>
    </div>
  )
}
