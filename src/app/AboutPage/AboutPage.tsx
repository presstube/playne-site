import styles from './AboutPage.module.css'
import PortableText from '@/components/PortableText/PortableText'
import Link from 'next/link'
import { PortableTextBlock } from 'sanity'

interface Page {
  _id: string
  title: string
  content: PortableTextBlock[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

interface AboutPageProps {
  page: Page | null
}

export default function AboutPage({ page }: AboutPageProps) {
  if (!page) {
    return (
      <div className={styles.setupContainer}>
        <h1 className={styles.setupTitle}>About Us</h1>
        <p className={styles.setupDescription}>
          This is the about page. To add content, please:
        </p>
        <ol className={styles.setupList}>
          <li>1. Set up your Sanity project credentials</li>
          <li>2. Go to <Link href="/studio" className={styles.setupLink}>/studio</Link></li>
          <li>3. Create a new page with slug &quot;about&quot;</li>
        </ol>
      </div>
    )
  }

  return (
    <div className={styles.aboutPage}>
      <h1 className={styles.title}>{page.title}</h1>
      {page.content && <PortableText content={page.content} />}
    </div>
  )
}
