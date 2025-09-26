import styles from './ProgramsPage.module.css'
import PortableText from '@/components/PortableText/PortableText'
import PageHero from '@/components/PageHero/PageHero'
import PageSection from '@/components/PageSection/PageSection'
import { PortableTextBlock } from 'sanity'

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
      icon?: any
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
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

interface ProgramsPageProps {
  data: ProgramsPageData | null
}

export default function ProgramsPage({ data }: ProgramsPageProps) {
  // Fallback content if no Sanity data
  if (!data) {
    return (
      <div className={styles.programsPage}>
        <PageHero 
          title="Programs" 
          subtitle="Practical life education through creativity and hands-on learning" 
        />

        <PageSection 
          id="curriculum-pillars" 
          title="Curriculum Pillars"
          description="PLAYNE's education framework is built on four essential pillars that prepare young people for real life."
        >
            
            <div className={styles.pillarsGrid}>
              <div className={styles.pillar}>
                <h3 className={styles.pillarTitle}>Anatomy & Body Awareness</h3>
                <p className={styles.pillarDescription}>
                  We often only learn about our bodies when something goes wrong. Playne classes teach whole-body awareness where students learn about anatomy, movement, and physical expression from head to toes that increases confidence and agility.
                </p>
              </div>

              <div className={styles.pillar}>
                <h3 className={styles.pillarTitle}>Wellness & Self-Care</h3>
                <p className={styles.pillarDescription}>
                  In a time of constant distractions, our programs focus on cultivating mindfulness about ourselves and the world around us. By traveling within, students learn more about how to manage their feelings to reduce stress and anxiety.
                </p>
              </div>

              <div className={styles.pillar}>
                <h3 className={styles.pillarTitle}>Nutrition & Healthy Living</h3>
                <p className={styles.pillarDescription}>
                  Nourishing our bodies starts with knowing what we need to feel our best. Learning about the building blocks of food we eat — how things grow, where our food comes from, and what we need to have a nutritious meal — is a vital part of creating a full life.
                </p>
              </div>

              <div className={styles.pillar}>
                <h3 className={styles.pillarTitle}>Financial Literacy</h3>
                <p className={styles.pillarDescription}>
                  By building a foundation of financial awareness, we design and nurture the vital decision-making skills that help students understand how to invest in themselves and plan for their futures.
                </p>
              </div>
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
      <PageHero title={data.title} subtitle={data.subtitle} />

      <PageSection 
        id="curriculum-pillars" 
        title={data.curriculumPillars.title}
        description={data.curriculumPillars.description}
      >
          
          <div className={styles.pillarsGrid}>
            {data.curriculumPillars.pillars.map((pillar, index) => (
              <div key={index} className={styles.pillar}>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarDescription}>
                  {pillar.description}
                </p>
              </div>
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
