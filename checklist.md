# PLAYNE Website Deployment Checklist

## Overview
Deploy PLAYNE website to Vercel with optimal static generation and Sanity CMS integration. Focus on minimal footprint and simple, reliable content update workflow.

## Strategy Decision: Full Rebuild vs ISR
**Chosen Approach:** Full rebuild on Sanity publish
- ✅ Simpler architecture with single webhook
- ✅ Guaranteed consistency across all pages
- ✅ Easier debugging and deployment history
- ✅ Appropriate for 7-page site with moderate content updates
- ⚠️ 2-3 minute delay for content updates (acceptable tradeoff)

---

## Phase 1: Next.js Configuration Optimization ⏳

### 1.1 Configure next.config.ts for Static Generation
- [ ] Add static export optimization settings
- [ ] Configure image optimization for Sanity images
- [ ] Set up proper caching headers
- [ ] Configure build output optimization
- [ ] Add compression and performance settings

### 1.2 Optimize Sanity Client Configuration
- [ ] Enable CDN for production (`useCdn: true`)
- [ ] Configure proper API version and caching
- [ ] Optimize GROQ queries for minimal data transfer
- [ ] Add query result caching where appropriate
- [ ] Review and optimize all existing queries in `src/sanity/lib/queries.ts`

### 1.3 Environment Configuration
- [ ] Create `.env.example` with required variables
- [ ] Document environment setup for deployment
- [ ] Verify all environment variables are properly typed
- [ ] Test environment variable loading in production build

---

## Phase 2: Vercel Deployment Setup ⏳

### 2.1 Vercel Project Configuration
- [ ] Create new Vercel project from GitHub repository
- [ ] Configure build settings and output directory
- [ ] Set up custom domain (if applicable)
- [ ] Configure SSL and security headers

### 2.2 Environment Variables Setup
- [ ] Add `NEXT_PUBLIC_SANITY_PROJECT_ID` to Vercel
- [ ] Add `NEXT_PUBLIC_SANITY_DATASET` to Vercel
- [ ] Add `SANITY_API_KEY` for webhook authentication (if needed)
- [ ] Test environment variable access in deployed environment

### 2.3 Build Optimization
- [ ] Configure Vercel build settings for optimal performance
- [ ] Set up proper caching strategies
- [ ] Configure static asset optimization
- [ ] Test build times and output size

---

## Phase 3: Sanity-to-Vercel Integration ⏳

### 3.1 Webhook Configuration
- [ ] Create Vercel deploy hook URL
- [ ] Configure Sanity webhook to trigger on document publish
- [ ] Set up webhook for all relevant document types:
  - [ ] homePage
  - [ ] aboutPage  
  - [ ] programsPage
  - [ ] eventsPage
  - [ ] getInvolvedPage
  - [ ] supportPage
  - [ ] contactPage
  - [ ] event (individual events)
- [ ] Test webhook triggers with sample content updates

### 3.2 Content Update Workflow
- [ ] Document content editor workflow (Sanity Studio → Publish → Auto-deploy)
- [ ] Set up notification system for successful deployments
- [ ] Create rollback procedure for failed deployments
- [ ] Test end-to-end content update process

### 3.3 Fallback Strategies
- [ ] Configure graceful handling of Sanity API failures
- [ ] Set up monitoring for webhook delivery failures
- [ ] Document manual deployment process as backup
- [ ] Test site functionality when Sanity is unavailable

---

## Phase 4: Performance & Monitoring ⏳

### 4.1 Performance Optimization
- [ ] Implement Sanity image optimization pipeline
- [ ] Configure Next.js Image component for Sanity images
- [ ] Optimize font loading (PLAYNE custom fonts)
- [ ] Minimize JavaScript bundle size
- [ ] Configure proper cache headers for static assets

### 4.2 Monitoring Setup
- [ ] Set up Vercel Analytics
- [ ] Configure build time monitoring
- [ ] Set up uptime monitoring
- [ ] Monitor Sanity API usage and costs
- [ ] Set up error tracking and alerting

### 4.3 Testing & Validation
- [ ] Test all 7 pages load correctly
- [ ] Verify all Sanity content displays properly
- [ ] Test responsive design across devices
- [ ] Validate SEO metadata generation
- [ ] Test site-wide navigation functionality
- [ ] Verify form submissions work (Contact page)

---

## Phase 5: Documentation & Handoff ⏳

### 5.1 Deployment Documentation
- [ ] Document deployment process and configuration
- [ ] Create troubleshooting guide for common issues
- [ ] Document environment variable requirements
- [ ] Create content editor guide for Sanity Studio

### 5.2 Maintenance Procedures
- [ ] Document how to update dependencies
- [ ] Create backup and restore procedures
- [ ] Document scaling considerations
- [ ] Set up regular health checks

---

## Success Criteria

### Performance Targets
- [ ] **Build Time:** < 3 minutes for full site rebuild
- [ ] **Page Load Speed:** < 2 seconds for all pages
- [ ] **Lighthouse Score:** > 90 for Performance, Accessibility, SEO
- [ ] **Bundle Size:** Optimized JavaScript and CSS delivery

### Functionality Requirements
- [ ] All 7 pages render correctly with Sanity content
- [ ] Site-wide navigation works (keyboard/swipe)
- [ ] Contact form submissions function properly
- [ ] Events display dynamically from Sanity
- [ ] SEO metadata generates correctly for all pages
- [ ] Responsive design works across all devices

### Content Management
- [ ] Content editors can publish updates via Sanity Studio
- [ ] Site rebuilds automatically within 5 minutes of publish
- [ ] No manual intervention required for content updates
- [ ] Rollback capability for problematic content changes

---

## Environment Variables Required

```bash
# Production Environment (Vercel)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production

# Optional: For webhook authentication
SANITY_API_KEY=your-api-key
WEBHOOK_SECRET=your-webhook-secret
```

---

## Architecture Notes

### Current Codebase Strengths
- ✅ Next.js 15 App Router with proper SSG setup
- ✅ Component co-location with CSS Modules (17 components)
- ✅ Comprehensive Sanity schemas for all content
- ✅ SEO-ready with dynamic metadata
- ✅ PLAYNE brand integration complete
- ✅ Site navigation system implemented

### Deployment Strategy
- **Static Generation:** All pages pre-built at deploy time
- **Content Updates:** Full rebuild on Sanity publish (simple & reliable)
- **Hosting:** Vercel with CDN for optimal performance
- **CMS:** Sanity Studio at `/studio` for content management

---

## Risk Mitigation

### Potential Issues & Solutions
1. **Sanity API Limits:** Monitor usage, implement caching
2. **Build Failures:** Set up monitoring and rollback procedures  
3. **Content Editor Errors:** Provide clear documentation and training
4. **Performance Degradation:** Regular monitoring and optimization
5. **Webhook Failures:** Manual deployment backup process

---

*Created: December 2024*  
*Status: 🚀 Ready to Begin Implementation*

## Next Steps
1. Begin with Phase 1: Next.js configuration optimization
2. Test each phase thoroughly before proceeding
3. Update this checklist as tasks are completed
4. Document any deviations or additional requirements discovered
