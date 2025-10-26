import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization')
  const url = request.nextUrl

  // Check if password is set
  const password = process.env.SITE_PASSWORD
  if (!password) {
    // No password set, allow access
    return NextResponse.next()
  }

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === 'playne' && pwd === password) {
      return NextResponse.next()
    }
  }

  url.pathname = '/api/auth'

  return NextResponse.rewrite(url)
}

// Only protect the main site routes, exclude static assets and Next.js internals
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|fonts|images|svg|.*\\..*$).*)',
  ],
}

