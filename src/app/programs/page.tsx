import ProgramsPage from '../ProgramsPage/ProgramsPage'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Programs - PLAYNE',
    description: 'Discover PLAYNE\'s curriculum pillars: Anatomy & Body Awareness, Wellness & Self-Care, Nutrition & Healthy Living, and Financial Literacy',
  }
}

export default function Page() {
  return <ProgramsPage />
}
