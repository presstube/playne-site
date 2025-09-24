import styles from './AboutPage.module.css'
import PortableText from '@/components/PortableText/PortableText'
import { PortableTextBlock } from 'sanity'

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
      image?: any
    }>
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

interface AboutPageProps {
  data: AboutPageData | null
}

export default function AboutPage({ data }: AboutPageProps) {
  // Fallback content if no Sanity data
  if (!data) {
    return (
      <div className={styles.aboutPage}>
        <div className={styles.hero}>
          <h1 className={styles.title}>About PLAYNE</h1>
          <p className={styles.subtitle}>
            Empowering young minds through practical life education
          </p>
        </div>

        <section id="mission" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <div className={styles.missionContent}>
              <p className={styles.missionText}>
                PLAYNE uses creativity to teach the things we wish we learned in school — how to care for our bodies, understand our emotions, manage money, and find our voice. Through playful, practical lessons rooted in art, we give young people the space to explore <em>who they are</em> before being told who to be.
              </p>
            </div>
          </div>
        </section>

        <section id="story" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Our Story</h2>
            <div className={styles.storyContent}>
              <p className={styles.storyText}>
                We believe every young person deserves the tools to thrive, not just in school, but in life. PLAYNE reimagines learning by putting curiosity, wellness, and self-discovery at the center. Through hands-on experiences in classrooms and communities, we help students gain a deeper understanding of themselves and the world around them.
              </p>
              <p className={styles.storyText}>
                <em>More of our story coming soon...</em>
              </p>
            </div>
          </div>
        </section>

        <section id="team" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Our Team</h2>
            <div className={styles.teamContent}>
              <p className={styles.teamText}>
                Meet the passionate educators and creators behind PLAYNE.
              </p>
              <div className={styles.teamPlaceholder}>
                <p><em>Team member profiles coming soon...</em></p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Render with Sanity data
  return (
    <div className={styles.aboutPage}>
      <div className={styles.hero}>
        <h1 className={styles.title}>{data.title}</h1>
        <p className={styles.subtitle}>{data.subtitle}</p>
      </div>

      <section id="mission" className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>{data.mission.title}</h2>
          <div className={styles.missionContent}>
            <PortableText content={data.mission.content} />
          </div>
        </div>
      </section>

      <section id="story" className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>{data.story.title}</h2>
          <div className={styles.storyContent}>
            <PortableText content={data.story.content} />
          </div>
        </div>
      </section>

      <section id="team" className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>{data.team.title}</h2>
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
        </div>
      </section>
    </div>
  )
}
