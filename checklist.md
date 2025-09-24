# PLAYNE Site Restructure - Iterative Implementation

## Project Overview
Transform the Next.js + Sanity site from "Next Sanity Spike" to PLAYNE website with lean menu structure. **Page-by-page implementation with checkpoints** for testing and feedback.

## Target Site Structure
**6 Main Pages** (top-level routes only):
1. **About** - Mission, Story, Team sections
2. **Programs** - Curriculum Pillars, Learning Modules sections  
3. **Get Involved** - Partners, Forms, Email signup sections
4. **Support PLAYNE** - Donation/sponsor sections
5. **Contact** - General, Press sections
6. **Events** - Talks/workshops (initially hidden)

---

## Phase 1: Foundation Setup ✅

### [✅] Update Site Branding & Navigation
- [✅] Change site title from "Next Sanity Spike" to "PLAYNE" in layout.tsx
- [✅] Update Topnav component with new 6-page structure
- [✅] Add PLAYNE branding elements (interactive logo already in place)
- [✅] Add social media links (Instagram & LinkedIn) placeholder in footer
- [✅] Update responsive navigation for mobile devices

**🛑 CHECKPOINT: Verify branding and navigation before proceeding**

**Status: READY FOR REVIEW** - Navigation now includes all 6 main pages: Home, About, Programs, Get Involved, Support PLAYNE, Contact (plus Studio). Footer includes social media placeholders and copyright. Responsive design implemented.

---

## Phase 2: About Page Implementation

### [ ] Step 1: Create About Route & Basic Component
- [ ] Create `/about` route (page.tsx)
- [ ] Create AboutPage component with placeholder sections
- [ ] Add basic styling and layout structure
- [ ] Test route works and displays placeholder content

**🛑 CHECKPOINT: Verify About page route and basic layout**

### [ ] Step 2: Add About Page Content (Static First)
- [ ] Add Mission section with content from `context/playne-mission-vision-goals.md`
- [ ] Add Story section with placeholder content
- [ ] Add Team section with placeholder content
- [ ] Style all sections appropriately
- [ ] Test responsive design

**🛑 CHECKPOINT: Verify About page content and styling**

### [ ] Step 3: Integrate About Page with Sanity
- [ ] Create `aboutPage` schema in Sanity
- [ ] Create content population script for About page
- [ ] Update About route to fetch from Sanity
- [ ] Test Sanity integration and Studio editing
- [ ] Verify fallback handling

**🛑 CHECKPOINT: Verify About page Sanity integration works fully**

---

## Phase 3: Programs Page Implementation

### [ ] Step 1: Create Programs Route & Basic Component
- [ ] Create `/programs` route (page.tsx)
- [ ] Create ProgramsPage component with placeholder sections
- [ ] Add basic styling and layout structure
- [ ] Test route works and displays placeholder content

**🛑 CHECKPOINT: Verify Programs page route and basic layout**

### [ ] Step 2: Add Programs Page Content (Static First)
- [ ] Add Curriculum Pillars section with content from `context/playne-pillars-of-education.md`
- [ ] Add Learning Modules section with "coming soon" placeholder
- [ ] Style the 4-pillar education framework properly
- [ ] Test responsive design

**🛑 CHECKPOINT: Verify Programs page content and styling**

### [ ] Step 3: Integrate Programs Page with Sanity
- [ ] Create `programsPage` schema in Sanity
- [ ] Create content population script for Programs page
- [ ] Update Programs route to fetch from Sanity
- [ ] Test Sanity integration and Studio editing
- [ ] Verify fallback handling

**🛑 CHECKPOINT: Verify Programs page Sanity integration works fully**

---

## Phase 4: Get Involved Page Implementation

### [ ] Step 1: Create Get Involved Route & Basic Component
- [ ] Create `/get-involved` route (page.tsx)
- [ ] Create GetInvolvedPage component with placeholder sections
- [ ] Add basic styling and layout structure
- [ ] Test route works and displays placeholder content

**🛑 CHECKPOINT: Verify Get Involved page route and basic layout**

### [ ] Step 2: Add Get Involved Page Content (Static First)
- [ ] Add Partners/Collaborators section with placeholder content
- [ ] Add Interest Form section with basic form
- [ ] Add Email List Signup section
- [ ] Style call-to-action elements
- [ ] Test responsive design and form functionality

**🛑 CHECKPOINT: Verify Get Involved page content and styling**

### [ ] Step 3: Integrate Get Involved Page with Sanity
- [ ] Create `getInvolvedPage` schema in Sanity
- [ ] Create content population script for Get Involved page
- [ ] Update Get Involved route to fetch from Sanity
- [ ] Test Sanity integration and Studio editing
- [ ] Verify fallback handling

**🛑 CHECKPOINT: Verify Get Involved page Sanity integration works fully**

---

## Phase 5: Support PLAYNE Page Implementation

### [ ] Step 1: Create Support Route & Basic Component
- [ ] Create `/support` route (page.tsx)
- [ ] Create SupportPage component with placeholder sections
- [ ] Add basic styling and layout structure
- [ ] Test route works and displays placeholder content

**🛑 CHECKPOINT: Verify Support page route and basic layout**

### [ ] Step 2: Add Support Page Content (Static First)
- [ ] Add donation/sponsor information sections
- [ ] Add compelling support messaging
- [ ] Style donation calls-to-action
- [ ] Test responsive design

**🛑 CHECKPOINT: Verify Support page content and styling**

### [ ] Step 3: Integrate Support Page with Sanity
- [ ] Create `supportPage` schema in Sanity
- [ ] Create content population script for Support page
- [ ] Update Support route to fetch from Sanity
- [ ] Test Sanity integration and Studio editing
- [ ] Verify fallback handling

**🛑 CHECKPOINT: Verify Support page Sanity integration works fully**

---

## Phase 6: Contact Page Implementation

### [ ] Step 1: Create Contact Route & Basic Component
- [ ] Create `/contact` route (page.tsx)
- [ ] Create ContactPage component with placeholder sections
- [ ] Add basic styling and layout structure
- [ ] Test route works and displays placeholder content

**🛑 CHECKPOINT: Verify Contact page route and basic layout**

### [ ] Step 2: Add Contact Page Content (Static First)
- [ ] Add General Contact section
- [ ] Add Press Inquiry section
- [ ] Add contact form functionality
- [ ] Style contact sections appropriately
- [ ] Test responsive design and form functionality

**🛑 CHECKPOINT: Verify Contact page content and styling**

### [ ] Step 3: Integrate Contact Page with Sanity
- [ ] Create `contactPage` schema in Sanity
- [ ] Create content population script for Contact page
- [ ] Update Contact route to fetch from Sanity
- [ ] Test Sanity integration and Studio editing
- [ ] Verify fallback handling

**🛑 CHECKPOINT: Verify Contact page Sanity integration works fully**

---

## Phase 7: Events Page Implementation (Hidden Initially)

### [ ] Step 1: Create Events Route & Basic Component
- [ ] Create `/events` route (page.tsx)
- [ ] Create EventsPage component with placeholder sections
- [ ] Add basic styling and layout structure
- [ ] Test route works and displays placeholder content

**🛑 CHECKPOINT: Verify Events page route and basic layout**

### [ ] Step 2: Add Events Page Content (Static First)
- [ ] Add talks/workshops placeholder content
- [ ] Style events sections appropriately
- [ ] Test responsive design

**🛑 CHECKPOINT: Verify Events page content and styling**

### [ ] Step 3: Integrate Events Page with Sanity
- [ ] Create `eventsPage` schema in Sanity
- [ ] Create content population script for Events page
- [ ] Update Events route to fetch from Sanity
- [ ] Test Sanity integration and Studio editing
- [ ] Verify fallback handling

### [ ] Step 4: Implement Navigation Toggle
- [ ] Add toggle mechanism to hide/show Events link in navigation
- [ ] Document how to enable Events section
- [ ] Test toggle functionality

**🛑 CHECKPOINT: Verify Events page integration and toggle mechanism**

---

## Phase 8: Final Integration & Testing

### [ ] Cross-Page Integration
- [ ] Update navigation to link to all new pages
- [ ] Ensure consistent styling across all pages
- [ ] Test all internal links and navigation flows
- [ ] Verify SEO metadata for all pages

### [ ] Content Management Testing
- [ ] Test content updates through Sanity Studio for all pages
- [ ] Verify content changes reflect on frontend
- [ ] Test fallback content handling
- [ ] Document content management workflows

### [ ] Final Quality Assurance
- [ ] Test full site on mobile and desktop
- [ ] Verify all forms work correctly
- [ ] Check loading performance
- [ ] Validate accessibility basics
- [ ] Test social media links

**🛑 FINAL CHECKPOINT: Complete site review and sign-off**

---

## Implementation Strategy

**3-Step Process Per Page:**
1. **Route & Component** - Get the page working with static content
2. **Content & Styling** - Make it look good and add real content
3. **Sanity Integration** - Connect to CMS for easy updates

**Benefits of This Approach:**
- ✅ **Incremental Progress** - See results after each step
- ✅ **Early Testing** - Catch issues before they compound
- ✅ **Flexible Feedback** - Easy to adjust direction at checkpoints
- ✅ **Reduced Risk** - Smaller changes, easier to debug
- ✅ **Clear Milestones** - Obvious stopping points for review

---

## Content Sources Reference
- **Mission/Vision**: `context/playne-mission-vision-goals.md`
- **Education Pillars**: `context/playne-pillars-of-education.md`
- **Lesson Plans**: Various lesson plan files for future content
- **Brand Guidelines**: `context/Playne-Brand_Guidelines-Final.pdf`

---

## Success Criteria
- [ ] All 6 main pages functional and styled
- [ ] Navigation works across all pages
- [ ] Content manageable through Sanity Studio
- [ ] Mobile responsive design
- [ ] PLAYNE branding throughout
- [ ] Ready for soft launch

---

## Notes & Learnings
*Add notes about challenges, solutions, and learnings during implementation*

**Current Status:** Ready to begin Phase 1 - Foundation Setup