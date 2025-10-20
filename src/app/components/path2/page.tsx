import ComponentPath2Page from '../../ComponentPath2Page/ComponentPath2Page'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Path2 Component - PLAYNE',
  description: 'Path2 component demonstration with explicit Bézier curves',
}

export default function Page() {
  return <ComponentPath2Page />
}

