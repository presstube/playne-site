import ComponentPhotoPathPage from '../../ComponentPhotoPathPage/ComponentPhotoPathPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PhotoPath Component - PLAYNE',
  description: 'PhotoPath component demonstration',
}

export default function Page() {
  return <ComponentPhotoPathPage />
}

