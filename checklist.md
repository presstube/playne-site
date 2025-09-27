# Site-Wide Navigation Feature Implementation

## Overview
Implement left/right arrow key navigation and mobile swipe navigation between all top-level pages with wrapping behavior.

## Requirements
- ✅ Navigation should wrap around (Contact → Home, Home ← Contact)
- ✅ Include all pages in navigation sequence
- ✅ No visual indicators for navigation
- ✅ Same behavior on desktop and mobile
- ✅ No page transition animations

## Navigation Sequence
1. `/` (Home)
2. `/about` (About)
3. `/programs` (Programs)
4. `/events` (Events)
5. `/get-involved` (Get Involved)
6. `/support` (Support PLAYNE)
7. `/contact` (Contact)
8. Wraps back to `/` (Home)

## Technical Implementation Plan

### Phase 1: Create PageNavigation Component ⏳
- [ ] Create `src/components/PageNavigation/PageNavigation.tsx`
- [ ] Create `src/components/PageNavigation/PageNavigation.module.css`
- [ ] Define navigation routes array matching Topnav structure
- [ ] Implement keyboard event listeners for arrow keys
- [ ] Add Next.js router integration for programmatic navigation
- [ ] Handle circular navigation logic (wrapping)

### Phase 2: Add Native Touch/Swipe Detection ⏳
- [ ] Implement native TouchEvent API handlers
- [ ] Add touchstart, touchmove, touchend event listeners
- [ ] Calculate swipe distance and direction detection
- [ ] Set minimum swipe threshold (50px horizontal)
- [ ] Distinguish horizontal swipes from vertical scrolling
- [ ] Prevent conflicts with browser navigation gestures

### Phase 3: Integration with RootLayout ⏳
- [ ] Import PageNavigation component in RootLayout.tsx
- [ ] Pass current pathname to PageNavigation component
- [ ] Test navigation across all 7 pages
- [ ] Verify wrapping behavior works correctly
- [ ] Ensure no interference with existing navigation

### Phase 4: Accessibility & Edge Cases ⏳
- [ ] Maintain proper focus management during navigation
- [ ] Add screen reader announcements for page changes
- [ ] Prevent keyboard navigation when focus is in form inputs
- [ ] Handle edge cases (page zoom, orientation changes)
- [ ] Test with keyboard-only navigation
- [ ] Verify touch events don't interfere with other interactions

### Phase 5: Testing & Validation ⏳
- [ ] Test keyboard navigation on all pages
- [ ] Test swipe navigation on mobile devices
- [ ] Verify wrapping works in both directions
- [ ] Test with different screen sizes and orientations
- [ ] Validate accessibility with screen readers
- [ ] Performance testing (no impact on page load)

## Architecture Details

### Component Location
- **Primary**: `src/components/PageNavigation/PageNavigation.tsx`
- **Integration**: `src/app/RootLayout/RootLayout.tsx`

### Technology Stack
- **Keyboard**: Native `keydown` event listeners
- **Touch**: Native `TouchEvent` API (no external libraries)
- **Routing**: Next.js `useRouter` and `usePathname` hooks
- **Styling**: CSS Modules (minimal, no visual indicators)

### Key Features
- Zero external dependencies
- Circular navigation (wrapping)
- All 7 pages included
- Same behavior across devices
- No visual feedback or animations
- Accessibility compliant

## Success Criteria
- [ ] Left/right arrow keys navigate between pages
- [ ] Left/right swipes navigate between pages on mobile
- [ ] Navigation wraps around (last → first, first → last)
- [ ] All 7 pages are included in navigation sequence
- [ ] No visual indicators or animations
- [ ] Same behavior on desktop and mobile
- [ ] No performance impact
- [ ] Accessibility maintained
- [ ] No conflicts with existing functionality

## Notes
- Exclude `/studio` route from navigation (admin-only)
- Respect existing project architecture and patterns
- Follow component co-location principles
- Maintain zero external dependencies approach
- Ensure keyboard navigation doesn't interfere with form inputs

---

*Created: December 2024*  
*Status: Planning Complete - Ready for Implementation*
