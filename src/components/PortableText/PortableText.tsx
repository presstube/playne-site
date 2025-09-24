import { PortableText as SanityPortableText } from '@portabletext/react'
import { PortableTextBlock } from 'sanity'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import styles from './PortableText.module.css'

interface PortableTextProps {
  content: PortableTextBlock[]
}

const components = {
  types: {
    image: ({ value }: any) => (
      <div className={styles.imageContainer}>
        <Image
          src={urlFor(value).url()}
          alt={value.alt || 'Image'}
          width={800}
          height={600}
          className={styles.image}
        />
      </div>
    ),
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className={styles.h1}>{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className={styles.h2}>{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className={styles.h3}>{children}</h3>
    ),
    normal: ({ children }: any) => (
      <p className={styles.paragraph}>{children}</p>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        className={styles.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
}

export default function PortableText({ content }: PortableTextProps) {
  return <SanityPortableText value={content} components={components} />
}
