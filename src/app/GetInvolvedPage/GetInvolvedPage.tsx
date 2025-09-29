'use client'

import { FormEvent, useState } from 'react'
import styles from './GetInvolvedPage.module.css'
import Headline from '@/components/Headline/Headline'
import PageSection from '@/components/PageSection/PageSection'
import TextInput from '@/components/TextInput/TextInput'
import TextArea from '@/components/TextArea/TextArea'
import Select from '@/components/Select/Select'
import Button from '@/components/Button/Button'
import { SanityImage, SeoData } from '@/sanity/lib/types'

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
      logo?: SanityImage
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
  seo?: SeoData
}

interface GetInvolvedPageProps {
  data: GetInvolvedPageData | null
}

export default function GetInvolvedPage({ data }: GetInvolvedPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  const handleInterestFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const formData = new FormData(e.currentTarget)
      const formValues = Object.fromEntries(formData.entries())
      
      // TODO: Replace with actual form submission endpoint
      console.log('Form submitted:', formValues)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitMessage('Thank you for your interest! We\'ll be in touch soon.')
      e.currentTarget.reset()
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitMessage('Sorry, there was an error submitting your form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email')
      
      // TODO: Replace with actual email signup endpoint
      console.log('Email signup:', email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitMessage('Thank you for signing up! You\'ll receive updates soon.')
      e.currentTarget.reset()
    } catch (error) {
      console.error('Email signup error:', error)
      setSubmitMessage('Sorry, there was an error signing you up. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fallback content if no Sanity data
  if (!data) {
    return (
      <div className={styles.getInvolvedPage}>
        <div className={styles.brandHeader}>
          <Headline 
            text="Get Involved"
            caseType="all-caps"
            align="center"
            fg="var(--brand-offwhite)"
            bg="var(--brand-black)"
          />
          <p className={styles.brandSubtitle}>
            Join us in empowering young minds through practical life education
          </p>
        </div>

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
            
            <form className={styles.interestForm} onSubmit={handleInterestFormSubmit}>
              <TextInput
                label="Name"
                name="name"
                required
                disabled={isSubmitting}
              />

              <TextInput
                label="Email"
                type="email"
                name="email"
                required
                disabled={isSubmitting}
              />

              <TextInput
                label="Organization"
                name="organization"
                disabled={isSubmitting}
              />

              <Select
                label="Your Role"
                name="role"
                placeholder="Select your role"
                disabled={isSubmitting}
                options={[
                  { value: 'educator', label: 'Educator' },
                  { value: 'administrator', label: 'Administrator' },
                  { value: 'community-leader', label: 'Community Leader' },
                  { value: 'parent', label: 'Parent' },
                  { value: 'student', label: 'Student' },
                  { value: 'other', label: 'Other' }
                ]}
              />

              <TextArea
                label="How would you like to get involved?"
                name="interest"
                required
                rows={4}
                placeholder="Tell us about your interest in PLAYNE programs..."
                disabled={isSubmitting}
              />

              {submitMessage && (
                <div className={`${styles.submitMessage} ${submitMessage.includes('error') ? styles.submitError : styles.submitSuccess}`}>
                  {submitMessage}
                </div>
              )}

              <Button 
                type="submit" 
                variant="submit" 
                size="large" 
                fullWidth 
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Submit Interest
              </Button>
            </form>
        </PageSection>

        <PageSection 
          id="email-signup" 
          title="Stay Updated"
          description="Sign up for our email list to receive updates about new programs, resources, and opportunities to get involved."
        >
            
            <form className={styles.emailForm} onSubmit={handleEmailSignupSubmit}>
              <div className={styles.emailFormGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  className={styles.emailInput}
                  required
                  disabled={isSubmitting}
                />
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="medium"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Sign Up
                </Button>
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
          
          <form className={styles.interestForm} onSubmit={handleInterestFormSubmit}>
            <TextInput
              label={data.interestFormSection.formFields.nameLabel}
              name="name"
              required
              disabled={isSubmitting}
            />

            <TextInput
              label={data.interestFormSection.formFields.emailLabel}
              type="email"
              name="email"
              required
              disabled={isSubmitting}
            />

            <TextInput
              label={data.interestFormSection.formFields.organizationLabel}
              name="organization"
              disabled={isSubmitting}
            />

            <Select
              label={data.interestFormSection.formFields.roleLabel}
              name="role"
              placeholder="Select your role"
              disabled={isSubmitting}
              options={[
                { value: 'educator', label: 'Educator' },
                { value: 'administrator', label: 'Administrator' },
                { value: 'community-leader', label: 'Community Leader' },
                { value: 'parent', label: 'Parent' },
                { value: 'student', label: 'Student' },
                { value: 'other', label: 'Other' }
              ]}
            />

            <TextArea
              label={data.interestFormSection.formFields.interestLabel}
              name="interest"
              required
              rows={4}
              placeholder="Tell us about your interest in PLAYNE programs..."
              disabled={isSubmitting}
            />

            {submitMessage && (
              <div className={`${styles.submitMessage} ${submitMessage.includes('error') ? styles.submitError : styles.submitSuccess}`}>
                {submitMessage}
              </div>
            )}

            <Button 
              type="submit" 
              variant="submit" 
              size="large" 
              fullWidth 
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {data.interestFormSection.formFields.submitButtonText}
            </Button>
          </form>
      </PageSection>

      <PageSection 
        id="email-signup" 
        title={data.emailSignupSection.title}
        description={data.emailSignupSection.description}
      >
          
          <form className={styles.emailForm} onSubmit={handleEmailSignupSubmit}>
            <div className={styles.emailFormGroup}>
              <input
                type="email"
                name="email"
                placeholder={data.emailSignupSection.placeholder}
                className={styles.emailInput}
                required
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                variant="primary" 
                size="medium"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {data.emailSignupSection.buttonText}
              </Button>
            </div>
            <p className={styles.emailDisclaimer}>
              {data.emailSignupSection.disclaimer}
            </p>
          </form>
      </PageSection>
    </div>
  )
}
