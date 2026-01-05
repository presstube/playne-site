import { Metadata } from 'next'
import { LandingThemeProvider } from '@/contexts/LandingThemeContext'
import Landing1Page from '@/app/Landing1Page/Landing1Page'

export const metadata: Metadata = {
  title: 'Landing 1 | PLAYNE',
  description: 'PLAYNE landing page',
}

export default function Page() {
  return (
    <LandingThemeProvider>
      <Landing1Page />
    </LandingThemeProvider>
  )
}

