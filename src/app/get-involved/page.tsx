import GetInvolvedPage from '../GetInvolvedPage/GetInvolvedPage'
import { client } from '@/sanity/lib/client'
import { getInvolvedPageQuery } from '@/sanity/lib/queries'
import { Metadata } from 'next'

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

async function getGetInvolvedPage(): Promise<GetInvolvedPageData | null> {
  try {
    return await client.fetch(getInvolvedPageQuery)
  } catch (error) {
    console.error('Error fetching get involved page:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const getInvolvedPage = await getGetInvolvedPage()
  
  return {
    title: getInvolvedPage?.seo?.metaTitle || getInvolvedPage?.title || 'Get Involved - PLAYNE',
    description: getInvolvedPage?.seo?.metaDescription || 'Join PLAYNE\'s mission to empower young minds. Partner with us, express your interest, or sign up for updates about our practical life education programs.',
  }
}

export default async function Page() {
  const getInvolvedPage = await getGetInvolvedPage()
  return <GetInvolvedPage data={getInvolvedPage} />
}
