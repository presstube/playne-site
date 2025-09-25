import ProgramsPage from '../ProgramsPage/ProgramsPage'
import { client } from '@/sanity/lib/client'
import { programsPageQuery } from '@/sanity/lib/queries'
import { Metadata } from 'next'
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

async function getProgramsPage(): Promise<ProgramsPageData | null> {
  try {
    return await client.fetch(programsPageQuery)
  } catch (error) {
    console.error('Error fetching programs page:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const programsPage = await getProgramsPage()
  
  return {
    title: programsPage?.seo?.metaTitle || programsPage?.title || 'Programs - PLAYNE',
    description: programsPage?.seo?.metaDescription || 'Discover PLAYNE\'s curriculum pillars: Anatomy & Body Awareness, Wellness & Self-Care, Nutrition & Healthy Living, and Financial Literacy',
  }
}

export default async function Page() {
  const programsPage = await getProgramsPage()
  return <ProgramsPage data={programsPage} />
}
