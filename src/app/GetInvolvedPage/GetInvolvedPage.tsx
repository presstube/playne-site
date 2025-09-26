import styles from './GetInvolvedPage.module.css'
import PageHero from '@/components/PageHero/PageHero'
import PageSection from '@/components/PageSection/PageSection'

interface GetInvolvedPageData {
  _id: string
  title: string
  subtitle: string
  partnersSection: {
    title: string
    description: string
    partnerTypes: Array<{
      title: string
      description: string
    }>
    currentPartners: Array<{
      name: string
      description: string
      logo?: any
      website: string
    }>
  }
  interestFormSection: {
    title: string
    description: string
    formFields: {
      nameLabel: string
      emailLabel: string
      organizationLabel: string
      roleLabel: string
      interestLabel: string
      submitButtonText: string
    }
  }
  emailSignupSection: {
    title: string
    description: string
    placeholder: string
    buttonText: string
    disclaimer: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

interface GetInvolvedPageProps {
  data: GetInvolvedPageData | null
}

export default function GetInvolvedPage({ data }: GetInvolvedPageProps) {
  // Fallback content if no Sanity data
  if (!data) {
    return (
      <div className={styles.getInvolvedPage}>
        <PageHero 
          title="Get Involved" 
          subtitle="Join us in empowering young minds through practical life education" 
        />

        <PageSection 
          id="partners" 
          title="Partners & Collaborators"
          description="We believe in the power of collaboration. PLAYNE works with schools, community organizations, educators, and advocates who share our vision of holistic youth education."
        >
            
            <div className={styles.partnerTypes}>
              <div className={styles.partnerType}>
                <h3 className={styles.partnerTypeTitle}>Educational Institutions</h3>
                <p className={styles.partnerTypeDescription}>
                  Schools and educational programs looking to integrate practical life skills into their curriculum.
                </p>
              </div>

              <div className={styles.partnerType}>
                <h3 className={styles.partnerTypeTitle}>Community Organizations</h3>
                <p className={styles.partnerTypeDescription}>
                  Youth centers, after-school programs, and community groups focused on youth development.
                </p>
              </div>

              <div className={styles.partnerType}>
                <h3 className={styles.partnerTypeTitle}>Individual Educators</h3>
                <p className={styles.partnerTypeDescription}>
                  Teachers, counselors, and mentors passionate about holistic education and youth empowerment.
                </p>
              </div>
            </div>
        </PageSection>

        <PageSection 
          id="interest-form" 
          title="Express Your Interest"
          description="Interested in bringing PLAYNE programs to your community? Let us know how you'd like to get involved."
        >
            
            <form className={styles.interestForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="organization" className={styles.label}>Organization</label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="role" className={styles.label}>Your Role</label>
                <select id="role" name="role" className={styles.select}>
                  <option value="">Select your role</option>
                  <option value="educator">Educator</option>
                  <option value="administrator">Administrator</option>
                  <option value="community-leader">Community Leader</option>
                  <option value="parent">Parent</option>
                  <option value="student">Student</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="interest" className={styles.label}>How would you like to get involved? *</label>
                <textarea
                  id="interest"
                  name="interest"
                  required
                  rows={4}
                  className={styles.textarea}
                  placeholder="Tell us about your interest in PLAYNE programs..."
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Submit Interest
              </button>
            </form>
        </PageSection>

        <PageSection 
          id="email-signup" 
          title="Stay Updated"
          description="Sign up for our email list to receive updates about new programs, resources, and opportunities to get involved."
        >
            
            <form className={styles.emailForm}>
              <div className={styles.emailFormGroup}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className={styles.emailInput}
                  required
                />
                <button type="submit" className={styles.emailButton}>
                  Sign Up
                </button>
              </div>
              <p className={styles.emailDisclaimer}>
                We respect your privacy and will never share your information. Unsubscribe at any time.
              </p>
            </form>
        </PageSection>
      </div>
    )
  }

  // Render with Sanity data
  return (
    <div className={styles.getInvolvedPage}>
      <PageHero title={data.title} subtitle={data.subtitle} />

      <PageSection 
        id="partners" 
        title={data.partnersSection.title}
        description={data.partnersSection.description}
      >
          
          <div className={styles.partnerTypes}>
            {data.partnersSection.partnerTypes.map((partnerType, index) => (
              <div key={index} className={styles.partnerType}>
                <h3 className={styles.partnerTypeTitle}>{partnerType.title}</h3>
                <p className={styles.partnerTypeDescription}>
                  {partnerType.description}
                </p>
              </div>
            ))}
          </div>

          {data.partnersSection.currentPartners && data.partnersSection.currentPartners.length > 0 && (
            <div className={styles.currentPartners}>
              <h3 className={styles.currentPartnersTitle}>Current Partners</h3>
              <div className={styles.partnersGrid}>
                {data.partnersSection.currentPartners.map((partner, index) => (
                  <div key={index} className={styles.partner}>
                    <h4 className={styles.partnerName}>{partner.name}</h4>
                    <p className={styles.partnerDescription}>{partner.description}</p>
                    {partner.website && (
                      <a href={partner.website} className={styles.partnerLink} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
      </PageSection>

      <PageSection 
        id="interest-form" 
        title={data.interestFormSection.title}
        description={data.interestFormSection.description}
      >
          
          <form className={styles.interestForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>{data.interestFormSection.formFields.nameLabel} *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>{data.interestFormSection.formFields.emailLabel} *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="organization" className={styles.label}>{data.interestFormSection.formFields.organizationLabel}</label>
              <input
                type="text"
                id="organization"
                name="organization"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role" className={styles.label}>{data.interestFormSection.formFields.roleLabel}</label>
              <select id="role" name="role" className={styles.select}>
                <option value="">Select your role</option>
                <option value="educator">Educator</option>
                <option value="administrator">Administrator</option>
                <option value="community-leader">Community Leader</option>
                <option value="parent">Parent</option>
                <option value="student">Student</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="interest" className={styles.label}>{data.interestFormSection.formFields.interestLabel} *</label>
              <textarea
                id="interest"
                name="interest"
                required
                rows={4}
                className={styles.textarea}
                placeholder="Tell us about your interest in PLAYNE programs..."
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              {data.interestFormSection.formFields.submitButtonText}
            </button>
          </form>
      </PageSection>

      <PageSection 
        id="email-signup" 
        title={data.emailSignupSection.title}
        description={data.emailSignupSection.description}
      >
          
          <form className={styles.emailForm}>
            <div className={styles.emailFormGroup}>
              <input
                type="email"
                placeholder={data.emailSignupSection.placeholder}
                className={styles.emailInput}
                required
              />
              <button type="submit" className={styles.emailButton}>
                {data.emailSignupSection.buttonText}
              </button>
            </div>
            <p className={styles.emailDisclaimer}>
              {data.emailSignupSection.disclaimer}
            </p>
          </form>
      </PageSection>
    </div>
  )
}
