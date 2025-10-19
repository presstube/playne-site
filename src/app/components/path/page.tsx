import ComponentPathPage from '../../ComponentPathPage/ComponentPathPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Path Component - PLAYNE',
  description: 'Path component demonstration',
}

export default function Page() {
  return <ComponentPathPage />
}

