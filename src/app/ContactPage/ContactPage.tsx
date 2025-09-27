'use client'

import { FormEvent, useState } from 'react'
import styles from './ContactPage.module.css'
import PortableText from '@/components/PortableText/PortableText'
import PageHero from '@/components/PageHero/PageHero'
import PageSection from '@/components/PageSection/PageSection'
import TextInput from '@/components/TextInput/TextInput'
import TextArea from '@/components/TextArea/TextArea'
import FormRow from '@/components/FormRow/FormRow'
import Button from '@/components/Button/Button'
import { PortableTextBlock } from 'sanity'

interface ContactPageData {
  _id: string
  title: string
  subtitle: string
  generalContactSection: {
    title: string
    description: string
    content: PortableTextBlock[]
    contactMethods: Array<{
      type: string
      label: string
      value: string
      description?: string
    }>
  }
  pressSection: {
    title: string
    description: string
    content: PortableTextBlock[]
    pressContacts: Array<{
      name: string
      role: string
      email: string
      phone?: string
    }>
  }
  locationSection: {
    title: string
    description: string
    address?: string
    hours?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

interface ContactPageProps {
  data: ContactPageData | null
}

export default function ContactPage({ data }: ContactPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  const handleContactFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const formData = new FormData(e.currentTarget)
      const formValues = Object.fromEntries(formData.entries())
      
      // TODO: Replace with actual form submission endpoint
      console.log('Contact form submitted:', formValues)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitMessage('Thank you for your message! We\'ll get back to you soon.')
      e.currentTarget.reset()
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitMessage('Sorry, there was an error sending your message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fallback content if no Sanity data
  if (!data) {
    return (
      <div className={styles.contactPage}>
        <PageHero 
          title="Contact Us" 
          subtitle="Get in touch with PLAYNE to learn more about our programs" 
        />

        <PageSection 
          id="general-contact" 
          title="General Contact"
          description="Have questions about PLAYNE programs, partnerships, or how to get involved? We'd love to hear from you."
        >
            
            <div className={styles.contactMethods}>
              <div className={styles.contactMethod}>
                <h3 className={styles.methodLabel}>Email</h3>
                <a href="mailto:hello@playne.org" className={styles.methodValue}>
                  hello@playne.org
                </a>
                <p className={styles.methodDescription}>
                  General inquiries and program information
                </p>
              </div>

              <div className={styles.contactMethod}>
                <h3 className={styles.methodLabel}>Phone</h3>
                <a href="tel:+1234567890" className={styles.methodValue}>
                  (123) 456-7890
                </a>
                <p className={styles.methodDescription}>
                  Available Monday-Friday, 9am-5pm
                </p>
              </div>
            </div>

            <div className={styles.contactForm}>
              <h3 className={styles.formTitle}>Send us a message</h3>
              <form className={styles.form} onSubmit={handleContactFormSubmit}>
                <FormRow>
                  <TextInput
                    label="First Name"
                    name="firstName"
                    required
                    disabled={isSubmitting}
                  />
                  <TextInput
                    label="Last Name"
                    name="lastName"
                    required
                    disabled={isSubmitting}
                  />
                </FormRow>

                <TextInput
                  label="Email"
                  type="email"
                  name="email"
                  required
                  disabled={isSubmitting}
                />

                <TextInput
                  label="Subject"
                  name="subject"
                  required
                  disabled={isSubmitting}
                />

                <TextArea
                  label="Message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us how we can help..."
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
                  Send Message
                </Button>
              </form>
            </div>
        </PageSection>

        <PageSection 
          id="press" 
          title="Press & Media"
          description="For media inquiries, interviews, and press information about PLAYNE."
        >
            
            <div className={styles.pressContacts}>
              <div className={styles.pressContact}>
                <h3 className={styles.contactName}>Media Relations</h3>
                <p className={styles.contactRole}>Press Inquiries</p>
                <a href="mailto:press@playne.org" className={styles.contactEmail}>
                  press@playne.org
                </a>
              </div>
            </div>
        </PageSection>

        <PageSection 
          id="location" 
          title="Location"
          description="PLAYNE operates programs in schools and communities. Contact us to learn about programs in your area."
        >
            
            <div className={styles.locationInfo}>
              <div className={styles.locationDetail}>
                <h3 className={styles.locationLabel}>Service Areas</h3>
                <p className={styles.locationValue}>
                  Currently serving schools and communities nationwide
                </p>
              </div>
            </div>
        </PageSection>
      </div>
    )
  }

  // Render with Sanity data
  return (
    <div className={styles.contactPage}>
      <PageHero title={data.title} subtitle={data.subtitle} />

      <PageSection 
        id="general-contact" 
        title={data.generalContactSection.title}
        description={data.generalContactSection.description}
      >
          
          <div className={styles.generalContent}>
            <PortableText content={data.generalContactSection.content} />
          </div>
          
          <div className={styles.contactMethods}>
            {data.generalContactSection.contactMethods.map((method, index) => (
              <div key={index} className={styles.contactMethod}>
                <h3 className={styles.methodLabel}>{method.label}</h3>
                <a 
                  href={method.type === 'email' ? `mailto:${method.value}` : method.type === 'phone' ? `tel:${method.value}` : method.value}
                  className={styles.methodValue}
                >
                  {method.value}
                </a>
                {method.description && (
                  <p className={styles.methodDescription}>{method.description}</p>
                )}
              </div>
            ))}
          </div>

          <div className={styles.contactForm}>
            <h3 className={styles.formTitle}>Send us a message</h3>
            <form className={styles.form} onSubmit={handleContactFormSubmit}>
              <FormRow>
                <TextInput
                  label="First Name"
                  name="firstName"
                  required
                  disabled={isSubmitting}
                />
                <TextInput
                  label="Last Name"
                  name="lastName"
                  required
                  disabled={isSubmitting}
                />
              </FormRow>

              <TextInput
                label="Email"
                type="email"
                name="email"
                required
                disabled={isSubmitting}
              />

              <TextInput
                label="Subject"
                name="subject"
                required
                disabled={isSubmitting}
              />

              <TextArea
                label="Message"
                name="message"
                required
                rows={5}
                placeholder="Tell us how we can help..."
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
                Send Message
              </Button>
            </form>
          </div>
      </PageSection>

      <PageSection 
        id="press" 
        title={data.pressSection.title}
        description={data.pressSection.description}
      >
          
          <div className={styles.pressContent}>
            <PortableText content={data.pressSection.content} />
          </div>
          
          <div className={styles.pressContacts}>
            {data.pressSection.pressContacts.map((contact, index) => (
              <div key={index} className={styles.pressContact}>
                <h3 className={styles.contactName}>{contact.name}</h3>
                <p className={styles.contactRole}>{contact.role}</p>
                <a href={`mailto:${contact.email}`} className={styles.contactEmail}>
                  {contact.email}
                </a>
                {contact.phone && (
                  <a href={`tel:${contact.phone}`} className={styles.contactPhone}>
                    {contact.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
      </PageSection>

      <PageSection 
        id="location" 
        title={data.locationSection.title}
        description={data.locationSection.description}
      >
          
          <div className={styles.locationInfo}>
            {data.locationSection.address && (
              <div className={styles.locationDetail}>
                <h3 className={styles.locationLabel}>Address</h3>
                <p className={styles.locationValue}>{data.locationSection.address}</p>
              </div>
            )}
            {data.locationSection.hours && (
              <div className={styles.locationDetail}>
                <h3 className={styles.locationLabel}>Hours</h3>
                <p className={styles.locationValue}>{data.locationSection.hours}</p>
              </div>
            )}
          </div>
      </PageSection>
    </div>
  )
}
