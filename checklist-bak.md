# PLAYNE Site Restructure Checklist

## Project Overview
Restructure the Next.js + Sanity site to match the PLAYNE site specification for soft launch. Transform from basic "Next Sanity Spike" to a proper PLAYNE website with the lean menu structure.

## Current State Analysis ✅
- **Architecture**: Next.js 15 + Sanity CMS with CSS Modules pattern
- **Existing Structure**: Basic home and about pages with Sanity integration
- **Navigation**: Simple topnav with Home, About, and Studio links
- **Content Sources**: Rich context files in `/context` folder with PLAYNE mission, pillars, lesson plans

## Target Site Structure (Based on PLAYNE-site-spec.md)

**Top-Level Pages Only** (lean approach for soft launch):

1. **About** - Single page with subsections:
   - Mission (from playne-mission-vision-goals.md)
   - Story 
   - Team

2. **Programs** - Single page with subsections:
   - Curriculum Pillars Overview (from playne-pillars-of-education.md)
   - Learning Modules (coming soon placeholder)

3. **Events** - Single page (initially hidden/coming soon):
   - Talks/Workshops placeholder

4. **Get Involved** - Single page with subsections:
   - Partners/Collaborators
   - Interest Form
   - Email List Signup

5. **Support PLAYNE** - Single page with subsections:
   - Donate/Sponsor information

6. **Contact** - Single page with subsections:
   - General Contact
   - Press Inquiries

+ Social Media Links (Instagram & LinkedIn)

---

## Phase 1: Foundation & Navigation

### [ ] Update Site Branding
- [ ] Change site title from "Next Sanity Spike" to "PLAYNE" in layout.tsx
- [ ] Update metadata throughout the application
- [ ] Update Topnav brand link text and styling

### [ ] Restructure Navigation
- [ ] Update Topnav component to reflect new menu structure (6 main pages)
- [ ] Remove dropdown/submenu complexity - keep navigation simple
- [ ] Implement mobile-responsive navigation
- [ ] Add social media links (Instagram & LinkedIn) to header/footer

### [ ] Update Root Layout
- [ ] Add PLAYNE branding elements
- [ ] Position social media links appropriately
- [ ] Ensure consistent styling across all pages

---

## Phase 2: About Page with Sanity Integration

### [ ] Create About Page Sanity Schema
- [ ] Create `aboutPage` schema in Sanity with sections for Mission, Story, Team
- [ ] Define fields for mission content, story content, team members
- [ ] Add SEO fields (meta title, description)

### [ ] Populate About Page Content in Sanity
- [ ] Seed mission content from `context/playne-mission-vision-goals.md`
- [ ] Add placeholder story content
- [ ] Add placeholder team member data
- [ ] Create content population script for About page

### [ ] Build About Page Route & Component
- [ ] Create `/about` route with Sanity data fetching
- [ ] Build AboutPage component with Mission, Story, and Team sections
- [ ] Implement smooth scrolling navigation between sections
- [ ] Style all sections appropriately

### [ ] Test About Page Integration
- [ ] Verify Sanity content displays correctly
- [ ] Test responsive design across devices
- [ ] Validate SEO metadata

---

## Phase 3: New Main Sections

### [ ] Programs Page with Sanity Integration
- [ ] Create `programsPage` schema in Sanity with Curriculum Pillars and Learning Modules sections
- [ ] Seed curriculum pillars content from `context/playne-pillars-of-education.md`
- [ ] Add "coming soon" placeholder for Learning Modules
- [ ] Create `/programs` route with Sanity data fetching
- [ ] Build ProgramsPage component with proper styling for 4-pillar framework
- [ ] Test Programs page integration

### [ ] Get Involved Page with Sanity Integration
- [ ] Create `getInvolvedPage` schema in Sanity with Partners, Forms, Email sections
- [ ] Populate initial content for partners/collaborators section
- [ ] Create `/get-involved` route with Sanity data fetching
- [ ] Build GetInvolvedPage component with form functionality
- [ ] Style call-to-action elements throughout
- [ ] Test Get Involved page integration

### [ ] Support PLAYNE Page with Sanity Integration
- [ ] Create `supportPage` schema in Sanity for donation/sponsor content
- [ ] Populate compelling support messaging content
- [ ] Create `/support` route with Sanity data fetching
- [ ] Build SupportPage component with donation calls-to-action
- [ ] Prepare structure for future payment integration
- [ ] Test Support page integration

### [ ] Contact Page with Sanity Integration
- [ ] Create `contactPage` schema in Sanity with General and Press sections
- [ ] Populate contact information and messaging
- [ ] Create `/contact` route with Sanity data fetching
- [ ] Build ContactPage component with contact form functionality
- [ ] Test Contact page integration

---

## Phase 4: Sanity Schema & Content Population

### [ ] Create Comprehensive Sanity Schemas
- [ ] Review and update all page schemas for consistency
- [ ] Ensure proper field types and validation
- [ ] Add shared components (SEO fields, rich text, etc.)

### [ ] Content Population Scripts
- [ ] Create master content population script
- [ ] Seed all pages with content from context files
- [ ] Add placeholder content for sections without source material
- [ ] Verify all content displays correctly in Sanity Studio

### [ ] Content Quality Assurance
- [ ] Review all populated content for accuracy
- [ ] Ensure consistent formatting across pages
- [ ] Test content updates through Sanity Studio
- [ ] Validate rich text and media handling

---

## Phase 5: Events Section (Hidden Initially)

### [ ] Events Page with Sanity Integration (Hidden Initially)
- [ ] Create `eventsPage` schema in Sanity for talks/workshops content
- [ ] Add placeholder content for events
- [ ] Create `/events` route with Sanity data fetching
- [ ] Build EventsPage component
- [ ] Implement hide/show toggle mechanism for navigation
- [ ] Test Events page integration

### [ ] Add Navigation Toggle Mechanism
- [ ] Create easy way to show/hide events link in navigation
- [ ] Prepare for content addition when ready
- [ ] Document how to enable events section

---

## Implementation Approach

**Section-by-Section Strategy**: For each page, we will implement in this order:
1. **Sanity Schema Creation** - Define content structure and fields
2. **Content Population** - Seed Sanity with data from context files  
3. **Route Creation** - Build Next.js page with Sanity data fetching
4. **Component Development** - Create page component with proper styling
5. **Integration Testing** - Verify Sanity content displays correctly

This ensures each page is fully functional with Sanity backing before moving to the next, allowing for incremental testing and deployment.

---

## Technical Implementation Notes

### File Structure Changes (Simplified - Single Pages Only)
```
src/app/
├── about/
│   ├── page.tsx (Next.js entry point)
│   └── AboutPage/ (component with Mission, Story, Team sections)
├── programs/
│   ├── page.tsx (Next.js entry point)
│   └── ProgramsPage/ (component with Curriculum Pillars, Learning Modules sections)
├── get-involved/
│   ├── page.tsx (Next.js entry point)
│   └── GetInvolvedPage/ (component with Partners, Forms, Email signup sections)
├── support/
│   ├── page.tsx (Next.js entry point)
│   └── SupportPage/ (component with donation/sponsor sections)
├── contact/
│   ├── page.tsx (Next.js entry point)
│   └── ContactPage/ (component with General, Press sections)
└── events/ (initially hidden)
    ├── page.tsx (Next.js entry point)
    └── EventsPage/ (component with talks/workshops sections)
```

### Content Management Strategy
- **Primary Source**: Sanity CMS for all page content (enables easy updates)
- **Content Seeding**: Use context files to populate initial Sanity content
- **Hybrid Approach**: Static content from context files as fallback, Sanity as primary source
- **Section-by-Section Implementation**: Install each page route + Sanity schema + content population together

### Key Considerations
- **Soft Launch Ready**: Clean, simple implementation that can ship quickly
- **Future Expandable**: Structure allows easy content addition
- **SEO Optimized**: Proper metadata for each section
- **Mobile Responsive**: Following existing CSS Modules pattern
- **Accessibility**: Proper semantic HTML and navigation patterns

---

## Content Sources Reference
- **Mission/Vision**: `context/playne-mission-vision-goals.md`
- **Education Pillars**: `context/playne-pillars-of-education.md`
- **Lesson Plans**: Various lesson plan files for future Programs content
- **Brand Guidelines**: `context/Playne-Brand_Guidelines-Final.pdf`

---

## Success Criteria
- [ ] Site reflects PLAYNE branding throughout
- [ ] Navigation matches lean menu specification
- [ ] All main sections are accessible and functional
- [ ] Content from context files is properly integrated
- [ ] Mobile responsive design maintained
- [ ] SEO metadata updated for all pages
- [ ] Social media links properly positioned
- [ ] Events section ready to unhide when content available
- [ ] Site ready for soft launch

---

## Notes & Learnings
*Add notes about challenges, solutions, and learnings during implementation*

