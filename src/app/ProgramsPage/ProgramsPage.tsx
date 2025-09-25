import styles from './ProgramsPage.module.css'

export default function ProgramsPage() {
  return (
    <div className={styles.programsPage}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Programs</h1>
        <p className={styles.subtitle}>
          Practical life education through creativity and hands-on learning
        </p>
      </div>

      <section id="curriculum-pillars" className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Curriculum Pillars</h2>
          <p className={styles.sectionDescription}>
            PLAYNE's education framework is built on four essential pillars that prepare young people for real life.
          </p>
          
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
        </div>
      </section>

      <section id="learning-modules" className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Learning Modules</h2>
          <div className={styles.comingSoon}>
            <p className={styles.comingSoonText}>
              Interactive learning modules are currently in development. These hands-on experiences will bring our curriculum pillars to life through art, movement, storytelling, and group discussion.
            </p>
            <p className={styles.comingSoonSubtext}>
              <em>Coming soon...</em>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
