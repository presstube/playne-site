import { PortableText as SanityPortableText } from '@portabletext/react'
import { PortableTextBlock } from 'sanity'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface PortableTextProps {
  content: PortableTextBlock[]
}

const components = {
  types: {
    image: ({ value }: any) => (
      <div className="my-8">
        <Image
          src={urlFor(value).url()}
          alt={value.alt || 'Image'}
          width={800}
          height={600}
          className="rounded-lg"
        />
      </div>
    ),
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold mb-6 text-gray-900">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-semibold mb-4 text-gray-800">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-semibold mb-3 text-gray-800">{children}</h3>
    ),
    normal: ({ children }: any) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        className="text-blue-600 hover:text-blue-800 underline"
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
