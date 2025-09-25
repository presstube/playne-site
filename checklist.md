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

### [✅] Step 1: Create About Route & Basic Component
- [✅] Create `/about` route (page.tsx) - simplified for static content first
- [✅] Create AboutPage component with Mission, Story, Team sections
- [✅] Add comprehensive styling and layout structure
- [✅] Add section navigation and responsive design

**🛑 CHECKPOINT: Verify About page route and basic layout**

**Status: READY FOR REVIEW** - About page now has hero section, Mission content from context files, Story placeholder, Team placeholder, and fixed navigation sidebar. Fully responsive design implemented.

### [ ] Step 2: Add About Page Content (Static First)
- [ ] Add Mission section with content from `context/playne-mission-vision-goals.md`
- [ ] Add Story section with placeholder content
- [ ] Add Team section with placeholder content
- [ ] Style all sections appropriately
- [ ] Test responsive design

**🛑 CHECKPOINT: Verify About page content and styling**

### [✅] Step 3: Integrate About Page with Sanity
- [✅] Create `aboutPage` schema in Sanity with Mission, Story, Team sections
- [✅] Create content population script for About page
- [✅] Update About route to fetch from Sanity with proper TypeScript interfaces
- [✅] Update AboutPage component to render Sanity data with PortableText
- [✅] Add fallback handling for when Sanity data is unavailable
- [✅] Add team member display functionality

**🛑 CHECKPOINT: Verify About page Sanity integration works fully**

**Status: COMPLETE** ✅ - About page is now fully Sanity-backed with schema, queries, and component integration. Content has been successfully populated in Sanity with real PLAYNE mission, story, and team data. Page is live and ready for content management through Sanity Studio.

---

## Phase 3: Programs Page Implementation

### [✅] Step 1: Create Programs Route & Basic Component
- [✅] Create `/programs` route (page.tsx) with proper metadata
- [✅] Create ProgramsPage component with Curriculum Pillars and Learning Modules sections
- [✅] Add comprehensive styling with 4-pillar grid layout
- [✅] Include real content from PLAYNE pillars of education
- [✅] Add responsive design and hover effects

**🛑 CHECKPOINT: Verify Programs page route and basic layout**

**Status: READY FOR REVIEW** - Programs page now displays all 4 curriculum pillars (Anatomy, Wellness, Nutrition, Financial Literacy) with real PLAYNE content in an attractive grid layout. Learning Modules section shows "coming soon" placeholder. Fully responsive design implemented.

### [ ] Step 2: Add Programs Page Content (Static First)
- [ ] Add Curriculum Pillars section with content from `context/playne-pillars-of-education.md`
- [ ] Add Learning Modules section with "coming soon" placeholder
- [ ] Style the 4-pillar education framework properly
- [ ] Test responsive design

**🛑 CHECKPOINT: Verify Programs page content and styling**

### [✅] Step 3: Integrate Programs Page with Sanity
- [✅] Create `programsPage` schema in Sanity with Curriculum Pillars and Learning Modules
- [✅] Create content population script with real PLAYNE pillar content
- [✅] Update Programs route to fetch from Sanity with TypeScript interfaces
- [✅] Update ProgramsPage component to render Sanity data with PortableText
- [✅] Add fallback handling for when Sanity data is unavailable
- [✅] Add learning modules display functionality for future use

**🛑 CHECKPOINT: Verify Programs page Sanity integration works fully**

**Status: COMPLETE** ✅ - Programs page is now fully Sanity-backed with schema, queries, and component integration. Content has been successfully populated in Sanity with real PLAYNE curriculum pillars data. Page supports both "coming soon" mode and full learning modules display. Ready for content management through Sanity Studio.

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

### [✅] Step 3: Integrate Get Involved Page with Sanity
- [✅] Create `getInvolvedPage` schema in Sanity with Partners, Interest Form, and Email Signup sections
- [✅] Create content population script with comprehensive form configuration
- [✅] Update Get Involved route to fetch from Sanity with TypeScript interfaces
- [✅] Update GetInvolvedPage component to render Sanity data dynamically
- [✅] Add fallback handling for when Sanity data is unavailable
- [✅] Add current partners display functionality for future partnerships

**🛑 CHECKPOINT: Verify Get Involved page Sanity integration works fully**

**Status: COMPLETE** ✅ - Get Involved page is now fully Sanity-backed with schema, queries, and component integration. Content has been successfully populated in Sanity with partner types, form configuration, and email signup settings. Page includes functional forms and is ready for content management through Sanity Studio.

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

### [✅] Step 3: Integrate Support Page with Sanity
- [✅] Create `supportPage` schema in Sanity with Donation, Sponsorship, and Impact sections
- [✅] Create content population script with donation tiers and sponsorship levels
- [✅] Update Support route to fetch from Sanity with TypeScript interfaces
- [✅] Update SupportPage component to render Sanity data with PortableText
- [✅] Add fallback handling for when Sanity data is unavailable
- [✅] Add comprehensive donation and sponsorship functionality

**🛑 CHECKPOINT: Verify Support page Sanity integration works fully**

**Status: COMPLETE** ✅ - Support PLAYNE page is now fully Sanity-backed with schema, queries, and component integration. Content has been successfully populated in Sanity with donation tiers ($25-$250), sponsorship levels (Community Partner to Founding Partner), and impact statistics. Page includes professional donation buttons and sponsorship information, ready for content management through Sanity Studio.

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