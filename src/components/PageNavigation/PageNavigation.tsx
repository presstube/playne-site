'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import styles from './PageNavigation.module.css'

// Navigation routes in order (matching Topnav structure)
const NAVIGATION_ROUTES = [
  '/',
  '/about',
  '/programs',
  '/events',
  '/get-involved',
  '/support',
  '/contact'
]

interface PageNavigationProps {
  currentPath: string
}

export default function PageNavigation({ currentPath }: PageNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Get current page index
  const getCurrentPageIndex = (): number => {
    const index = NAVIGATION_ROUTES.indexOf(pathname)
    return index === -1 ? 0 : index // Default to home if not found
  }

  // Get page name for announcements
  const getPageName = (route: string): string => {
    const pageNames: { [key: string]: string } = {
      '/': 'Home',
      '/about': 'About',
      '/programs': 'Programs',
      '/events': 'Events',
      '/get-involved': 'Get Involved',
      '/support': 'Support PLAYNE',
      '/contact': 'Contact'
    }
    return pageNames[route] || 'Page'
  }

  // Announce page change to screen readers
  const announcePageChange = (route: string) => {
    const pageName = getPageName(route)
    const announcement = `Navigated to ${pageName} page`
    
    // Create temporary element for screen reader announcement
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', 'polite')
    announcer.setAttribute('aria-atomic', 'true')
    announcer.style.position = 'absolute'
    announcer.style.left = '-10000px'
    announcer.style.width = '1px'
    announcer.style.height = '1px'
    announcer.style.overflow = 'hidden'
    
    document.body.appendChild(announcer)
    announcer.textContent = announcement
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  }

  // Navigate to previous page (with wrapping)
  const navigateToPrevious = () => {
    const currentIndex = getCurrentPageIndex()
    const previousIndex = currentIndex === 0 ? NAVIGATION_ROUTES.length - 1 : currentIndex - 1
    const targetRoute = NAVIGATION_ROUTES[previousIndex]
    router.push(targetRoute)
    announcePageChange(targetRoute)
  }

  // Navigate to next page (with wrapping)
  const navigateToNext = () => {
    const currentIndex = getCurrentPageIndex()
    const nextIndex = currentIndex === NAVIGATION_ROUTES.length - 1 ? 0 : currentIndex + 1
    const targetRoute = NAVIGATION_ROUTES[nextIndex]
    router.push(targetRoute)
    announcePageChange(targetRoute)
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle arrow keys when not focused on form elements
      const activeElement = document.activeElement
      const isFormElement = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT' ||
        activeElement.getAttribute('contenteditable') === 'true'
      )

      if (isFormElement) {
        return // Don't interfere with form input
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          navigateToPrevious()
          break
        case 'ArrowRight':
          event.preventDefault()
          navigateToNext()
          break
      }
    }

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [pathname]) // Re-attach when pathname changes

  // Hammer.js swipe detection (client-side only)
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    let hammer: any = null

    // Dynamic import to avoid SSR issues
    import('hammerjs').then((HammerModule) => {
      const Hammer = HammerModule.default
      
      // Create Hammer instance on document body
      hammer = new Hammer(document.body)
      
      // Configure swipe recognition
      hammer.get('swipe').set({
        direction: Hammer.DIRECTION_HORIZONTAL,
        threshold: 50,
        velocity: 0.3
      })

      // Handle swipe events
      const handleSwipe = (event: any) => {
        if (event.direction === Hammer.DIRECTION_LEFT) {
          // Swipe left - go to next page
          navigateToNext()
        } else if (event.direction === Hammer.DIRECTION_RIGHT) {
          // Swipe right - go to previous page
          navigateToPrevious()
        }
      }

      // Add swipe listener
      hammer.on('swipe', handleSwipe)
    }).catch((error) => {
      console.warn('Failed to load Hammer.js:', error)
    })

    // Cleanup function
    return () => {
      if (hammer) {
        hammer.destroy()
      }
    }
  }, [pathname]) // Re-attach when pathname changes

  // This component renders nothing visible (no visual indicators)
  return <div className={styles.pageNavigation} aria-hidden="true" />
}
