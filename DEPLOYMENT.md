# PLAYNE Website Deployment Guide

## Vercel Deployment Setup

### Prerequisites
1. Sanity project with content populated
2. GitHub repository with latest code
3. Vercel account connected to GitHub

### Environment Variables Required

#### Production Environment (Vercel Dashboard)
```bash
# Required: Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production

# Optional: For webhook authentication (recommended for production)
WEBHOOK_SECRET=generate-random-string-here
```

#### Getting Sanity Credentials
1. Visit [Sanity Management Console](https://www.sanity.io/manage)
2. Select your PLAYNE project
3. Copy the **Project ID** from the project settings
4. Use `production` as the dataset name (or your custom dataset)

### Deployment Steps

#### 1. Connect Repository to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the PLAYNE website repository

#### 2. Configure Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `./` (project root)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

#### 3. Add Environment Variables
In Vercel project settings → Environment Variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID | Production, Preview, Development |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Production, Preview, Development |
| `WEBHOOK_SECRET` | Random secure string | Production |

#### 4. Deploy
- Click "Deploy" to trigger initial build
- Vercel will automatically deploy on future pushes to main branch

### Custom Domain Setup (Optional)

#### 1. Add Domain in Vercel
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `playne.org`)
3. Follow DNS configuration instructions

#### 2. SSL Certificate
- Vercel automatically provisions SSL certificates
- No additional configuration needed

### Build Optimization

#### Current Configuration
- **Static Generation**: All pages pre-built at deploy time
- **Image Optimization**: Sanity CDN with Next.js Image component
- **Caching**: Aggressive caching for static assets (1 year)
- **Bundle Size**: Optimized with package imports and CSS modules

#### Expected Performance
- **Build Time**: ~2-3 minutes for full site
- **Page Load Speed**: <2 seconds (target)
- **Lighthouse Score**: >90 (Performance, Accessibility, SEO)

### Content Update Workflow

#### Current Process (Manual)
1. Edit content in Sanity Studio (`yoursite.com/studio`)
2. Publish changes in Sanity
3. Manually trigger rebuild in Vercel dashboard

#### Automated Process (Phase 3)
1. Edit content in Sanity Studio
2. Publish changes in Sanity
3. Webhook automatically triggers Vercel rebuild
4. Site updates within 3-5 minutes

### Monitoring & Maintenance

#### Vercel Analytics
- Enable in Project Settings → Analytics
- Monitor Core Web Vitals and performance metrics

#### Build Monitoring
- Check build logs for errors
- Monitor build duration and success rate
- Set up notifications for failed deployments

#### Sanity Usage Monitoring
- Monitor API request usage in Sanity dashboard
- Track CDN bandwidth usage
- Review query performance

### Troubleshooting

#### Common Issues

**Build Fails with "Cannot find Sanity project"**
- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
- Check environment variable is set for all environments
- Ensure Sanity project exists and is accessible

**Images Not Loading**
- Verify Sanity CDN configuration in `next.config.ts`
- Check image URLs in browser network tab
- Ensure images exist in Sanity media library

**Slow Build Times**
- Check for unnecessary API calls during build
- Review query complexity and data size
- Consider query result caching

**Content Not Updating**
- Verify content is published (not draft) in Sanity
- Check if webhook is configured (Phase 3)
- Manually trigger rebuild if needed

#### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Sanity Documentation](https://www.sanity.io/docs)

### Security Considerations

#### Environment Variables
- Never commit `.env` files to repository
- Use Vercel's encrypted environment variable storage
- Rotate webhook secrets periodically

#### Sanity Studio Access
- Studio is publicly accessible at `/studio`
- Requires Sanity account authentication
- Consider IP restrictions for production

#### Content Security
- All content fetched from published dataset only
- No sensitive data exposed in client-side code
- Proper CORS configuration in Sanity

---

*Last updated: December 2024*  
*Next: Phase 3 - Webhook Integration*
