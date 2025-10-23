import styles from './ProgramsPage.module.css'
import PortableText from '@/components/PortableText/PortableText'
import HeadlineSub from '@/components/HeadlineSub/HeadlineSub'
import PageSection from '@/components/PageSection/PageSection'
import Card from '@/components/Card/Card'
import { PortableTextBlock } from 'sanity'
import { SeoData } from '@/sanity/lib/types'

interface ProgramsPageData {
  _id: string
  title: string
  subtitle: string
  curriculumPillars: {
    title: string
    description: string
    pillars: Array<{
      title: string
      description: string
      icon?: string
    }>
  }
  learningModules: {
    title: string
    content: PortableTextBlock[]
    isComingSoon: boolean
    modules: Array<{
      title: string
      description: string
      pillar: string
      duration: string
      ageGroup: string
    }>
  }
  seo?: SeoData
}

interface ProgramsPageProps {
  data: ProgramsPageData | null
}

export default function ProgramsPage({ data }: ProgramsPageProps) {
  // Fallback content if no Sanity data
  if (!data) {
    return (
      <div className={styles.programsPage}>
        <div className={styles.brandHeader}>
          <div className={styles.brandHeaderInner}>
            <HeadlineSub 
              headline="Programs"
              sub="Practical life education through creativity and hands-on learning"
              align="center"
              fg="var(--brand-offwhite)"
              bg="var(--brand-black)"
            />
          </div>
        </div>

        <PageSection 
          id="curriculum-pillars" 
          title="Curriculum Pillars"
          description="PLAYNE's education framework is built on four essential pillars that prepare young people for real life."
        >
            
            <div className={styles.pillarsGrid}>
              <Card
                variant="accent"
                title="Anatomy & Body Awareness"
                body="We often only learn about our bodies when something goes wrong. Playne classes teach whole-body awareness where students learn about anatomy, movement, and physical expression from head to toes that increases confidence and agility."
              />

              <Card
                variant="accent"
                title="Wellness & Self-Care"
                body="In a time of constant distractions, our programs focus on cultivating mindfulness about ourselves and the world around us. By traveling within, students learn more about how to manage their feelings to reduce stress and anxiety."
              />

              <Card
                variant="accent"
                title="Nutrition & Healthy Living"
                body="Nourishing our bodies starts with knowing what we need to feel our best. Learning about the building blocks of food we eat — how things grow, where our food comes from, and what we need to have a nutritious meal — is a vital part of creating a full life."
              />

              <Card
                variant="accent"
                title="Financial Literacy"
                body="By building a foundation of financial awareness, we design and nurture the vital decision-making skills that help students understand how to invest in themselves and plan for their futures."
              />
            </div>
        </PageSection>

        <PageSection id="learning-modules" title="Learning Modules">
            <div className={styles.comingSoon}>
              <p className={styles.comingSoonText}>
                Interactive learning modules are currently in development. These hands-on experiences will bring our curriculum pillars to life through art, movement, storytelling, and group discussion.
              </p>
              <p className={styles.comingSoonSubtext}>
                <em>Coming soon...</em>
              </p>
            </div>
        </PageSection>
      </div>
    )
  }

  // Render with Sanity data
  return (
    <div className={styles.programsPage}>
      <div className={styles.brandHeader}>
        <div className={styles.brandHeaderInner}>
          <HeadlineSub 
            headline={data.title}
            sub={data.subtitle}
            align="center"
            fg="var(--brand-offwhite)"
            bg="var(--brand-black)"
          />
        </div>
      </div>

      <PageSection 
        id="curriculum-pillars" 
        title={data.curriculumPillars.title}
        description={data.curriculumPillars.description}
      >
          
          <div className={styles.pillarsGrid}>
            {data.curriculumPillars.pillars.map((pillar, index) => (
              <Card
                key={index}
                variant="accent"
                title={pillar.title}
                body={pillar.description}
              />
            ))}
          </div>
      </PageSection>

      <PageSection id="learning-modules" title={data.learningModules.title}>
          
          {data.learningModules.isComingSoon ? (
            <div className={styles.comingSoon}>
              <PortableText content={data.learningModules.content} />
            </div>
          ) : (
            <div className={styles.modulesContent}>
              <PortableText content={data.learningModules.content} />
              
              {data.learningModules.modules && data.learningModules.modules.length > 0 && (
                <div className={styles.modulesGrid}>
                  {data.learningModules.modules.map((module, index) => (
                    <div key={index} className={styles.module}>
                      <h3 className={styles.moduleTitle}>{module.title}</h3>
                      <p className={styles.moduleDescription}>{module.description}</p>
                      <div className={styles.moduleDetails}>
                        <span className={styles.moduleDetail}>Duration: {module.duration}</span>
                        <span className={styles.moduleDetail}>Age: {module.ageGroup}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
      </PageSection>
    </div>
  )
}
