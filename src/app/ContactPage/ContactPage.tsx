import styles from './ContactPage.module.css'
import PortableText from '@/components/PortableText/PortableText'
import PageHero from '@/components/PageHero/PageHero'
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
  // Fallback content if no Sanity data
  if (!data) {
    return (
      <div className={styles.contactPage}>
        <PageHero 
          title="Contact Us" 
          subtitle="Get in touch with PLAYNE to learn more about our programs" 
        />

        <section id="general-contact" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>General Contact</h2>
            <p className={styles.sectionDescription}>
              Have questions about PLAYNE programs, partnerships, or how to get involved? We'd love to hear from you.
            </p>
            
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
              <form className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName" className={styles.label}>First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName" className={styles.label}>Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className={styles.input}
                    />
                  </div>
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
                  <label htmlFor="subject" className={styles.label}>Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className={styles.textarea}
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button type="submit" className={styles.submitButton}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        <section id="press" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Press & Media</h2>
            <p className={styles.sectionDescription}>
              For media inquiries, interviews, and press information about PLAYNE.
            </p>
            
            <div className={styles.pressContacts}>
              <div className={styles.pressContact}>
                <h3 className={styles.contactName}>Media Relations</h3>
                <p className={styles.contactRole}>Press Inquiries</p>
                <a href="mailto:press@playne.org" className={styles.contactEmail}>
                  press@playne.org
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="location" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Location</h2>
            <p className={styles.sectionDescription}>
              PLAYNE operates programs in schools and communities. Contact us to learn about programs in your area.
            </p>
            
            <div className={styles.locationInfo}>
              <div className={styles.locationDetail}>
                <h3 className={styles.locationLabel}>Service Areas</h3>
                <p className={styles.locationValue}>
                  Currently serving schools and communities nationwide
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
    <div className={styles.contactPage}>
      <PageHero title={data.title} subtitle={data.subtitle} />

      <section id="general-contact" className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>{data.generalContactSection.title}</h2>
          <p className={styles.sectionDescription}>
            {data.generalContactSection.description}
          </p>
          
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
            <form className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName" className={styles.label}>First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName" className={styles.label}>Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className={styles.input}
                  />
                </div>
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
                <label htmlFor="subject" className={styles.label}>Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className={styles.textarea}
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section id="press" className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>{data.pressSection.title}</h2>
          <p className={styles.sectionDescription}>
            {data.pressSection.description}
          </p>
          
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
        </div>
      </section>

      <section id="location" className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>{data.locationSection.title}</h2>
          <p className={styles.sectionDescription}>
            {data.locationSection.description}
          </p>
          
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
        </div>
      </section>
    </div>
  )
}
