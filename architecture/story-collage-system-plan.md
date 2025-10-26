# Story Collage System Plan

## Overview

A system for creating, curating, and managing visual story pages (collages) with randomizable, seed-based components. The system provides:

1. **Sanity CMS** as the source of truth for published page configurations
2. **Local Storage (LSO)** for ephemeral, session-based experimentation
3. **Simple password protection** for the entire site during development
4. **Visual controls** (colored triangles) for save/reset operations

## Implementation Status

### ✅ Phase 0: Foundation (COMPLETE)
- [x] Created `/story/1` page (moved from `/story-1`)
- [x] Updated all LSO keys to use `story1-` prefix
- [x] Isolated from `home-1` experimental page
- [x] Configured RootLayout to render story routes "frameless" (no site nav/footer)
- [x] Implemented site-wide password protection (middleware + basic auth)
- [x] Updated plan documentation

### 🔄 Next Phases
- [ ] Phase 1: Site-wide Password Protection (COMPLETE, already done in Phase 0)
- [ ] Phase 2: Sanity Schema for Page Configurations
- [ ] Phase 3: API Routes for Save/Load
- [ ] Phase 4: Update story/1 Page Logic with Green Triangle
- [ ] Phase 5: Sanity Client Token Configuration

## Layout Architecture Decision

### Current Implementation: Frameless Story Routes

**What we did:**
- Story routes (`/story/*`) render **without** the site's standard Topnav, PageNavigation, and footer
- Updated `RootLayout.tsx` to detect `/story` routes: `pathname?.startsWith('/story')`
- This follows the existing pattern for `/components` routes (experimental pages)

**Why frameless:**
1. **Story pages are immersive collages** - they should fill the viewport without chrome
2. **Each story has its own Footer component** - baked into the collage itself as a design element
3. **Consistent with experimental pages** - `/components` routes are also frameless
4. **Clean canvas** - stories are self-contained visual experiences, not traditional site pages

### Should We Keep It Frameless?

**✅ RECOMMENDATION: Keep frameless, but add navigation affordance**

**Reasoning:**
- Story collages are **intentionally immersive** - the site nav would break the visual flow
- The built-in Footer component provides branding and navigation (home, about, programs, etc.)
- Stories are meant to be **destinations**, not part of the standard site hierarchy
- Similar to Sanity Studio (`/studio`) or component demos (`/components`) - they're tools/experiences, not content pages

**However, consider adding:**
1. **A subtle "back to site" link** (top-left corner, small, unobtrusive)
2. **Or keyboard shortcut** (e.g., "Esc" to return to main site)
3. **Or keep fully frameless** - visitors arrive via direct links or home page

**If we need to bring back the layout:**
- It's a one-line change: remove `|| pathname?.startsWith('/story')` from `RootLayout.tsx`
- But this would compromise the immersive collage experience
- Better to add opt-in navigation within the story itself

### Alternate Approach (Not Recommended)

If stories needed to be part of the main site nav:
- Keep them frameless
- Add a dedicated "Stories" link in Topnav
- Have a `/story` index page that lists all story collages
- Each story (`/story/1`, `/story/2`) remains frameless

**Verdict:** Keep frameless. The immersive experience is the point.

## File Structure Changes

```
src/app/
  ├── components/           # Experimental pages (frameless)
  │   └── home-1/          # Original experiment (unchanged)
  │       ├── page.tsx
  │       └── page.module.css
  │
  ├── story/               # Story collage pages (frameless)
  │   └── 1/               # Story #1 - PRIMARY IMPLEMENTATION
  │       ├── page.tsx     # Component logic, LSO management
  │       └── page.module.css
  │
  ├── RootLayout/
  │   └── RootLayout.tsx   # Updated: frameless for /story routes
  │
  └── api/
      └── auth/
          └── route.ts     # Password protection endpoint

middleware.ts              # Site-wide basic auth
```

## Access URLs

- **Story 1**: `http://localhost:3000/story/1` (frameless, immersive)
- **Original Experiment**: `http://localhost:3000/components/home-1` (frameless, unchanged)
- **Main Site**: `http://localhost:3000` (with standard layout)

---

## Goals

- Enable content team to curate and publish specific "story" configurations
- Allow designers/developers to experiment locally without affecting published state
- Preserve reproducibility through seed-based randomization
- Maintain version history through Sanity's built-in versioning
- Support future A/B testing and preview/staging workflows

## Current State

**home-1 page** (`/components/home-1`):
- Hardcoded `HOME1_DEFAULTS` object in page component
- Per-component state stored in LSO with `home1-` prefix
- Red triangle clears LSO and resets to hardcoded defaults
- "L" key logs current component state to console
- Components: BrandHero, Headline, HeadlineSub, Photo, PathContainer, Shape, TitleBodyQuote
- **Status**: Experimental page, unchanged by this implementation

**story/1 page** (`/story/1`) **[NEW - PRIMARY IMPLEMENTATION]**:
- Copy of home-1 page, serving as the first "story collage" implementation
- Uses `STORY1_DEFAULTS` object in page component
- Per-component state stored in LSO with `story1-` prefix (separate from home-1)
- Red triangle clears LSO and resets to defaults (will reset from Sanity in Phase 4)
- "L" key logs current component state as `STORY1_DEFAULTS`
- Same component set as home-1: BrandHero, Headline, HeadlineSub, Photo, PathContainer, Shape, TitleBodyQuote
- **Renders frameless** (no site Topnav/PageNavigation/footer) - includes own Footer component
- **Will be upgraded** to use Sanity save/load in Phase 4

## Proposed Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                      Sanity CMS                         │
│                 (Source of Truth)                       │
│                                                         │
│  - Page metadata (title, social cards)                 │
│  - Component configuration JSON                        │
│  - Seeds for reproducible randomization                │
└────────────┬───────────────────────────┬────────────────┘
             │                           │
    ┌────────▼────────┐         ┌───────▼────────┐
    │  Green Triangle │         │  Red Triangle  │
    │   (SAVE TO      │         │  (RESET FROM   │
    │    SANITY)      │         │   SANITY)      │
    └────────┬────────┘         └───────┬────────┘
             │                           │
             │                           │
    ┌────────▼───────────────────────────▼────────┐
    │       Local Storage (LSO)                   │
    │     (Ephemeral Session State)               │
    │                                              │
    │  - Per-component overrides                  │
    │  - home1-headline, home1-photo0, etc.       │
    │  - Cleared on red triangle click            │
    │  - Saved to Sanity on green triangle click  │
    └──────────────────────────────────────────────┘
```

### Authentication Flow

```
┌──────────────────────────────────────────────┐
│            User visits site                  │
└─────────────┬────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────┐
│     Next.js Middleware checks auth           │
│   (middleware.ts in project root)            │
└─────────────┬────────────────────────────────┘
              │
              ├─── Authenticated? ───► Continue to site
              │
              └─── Not authenticated ───► Browser basic auth prompt
                                          (username: "playne", password: ENV var)
```

## Implementation Plan

### Phase 1: Site-wide Password Protection

**Files to create/modify:**
- `middleware.ts` (new, project root)
- `.env.local` (add `SITE_PASSWORD` variable)
- `vercel.json` or Vercel dashboard (add `SITE_PASSWORD` env var)

**Implementation:**
```typescript
// middleware.ts
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

// Only protect the main site routes
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

```typescript
// app/api/auth/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="PLAYNE Site"',
    },
  })
}
```

**Environment Variables:**
```bash
# .env.local
SITE_PASSWORD=your_dev_password_here
```

### Phase 2: Sanity Schema for Page Configurations

**New schema file:** `src/sanity/schemas/pageConfiguration.ts`

```typescript
export default {
  name: 'pageConfiguration',
  title: 'Page Configuration',
  type: 'document',
  fields: [
    {
      name: 'pageSlug',
      title: 'Page Slug',
      type: 'slug',
      description: 'URL path for this page (e.g., home-1, about-story)',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'socialImage',
      title: 'Social Card Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'componentConfig',
      title: 'Component Configuration',
      type: 'object',
      description: 'JSON configuration for all components on this page',
      fields: [
        {
          name: 'configJson',
          title: 'Configuration JSON',
          type: 'text',
          rows: 20,
          description: 'Component state as JSON. This is auto-populated when saving from the green triangle.',
        },
      ],
    },
    {
      name: 'lastSavedBy',
      title: 'Last Saved By',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'lastSavedAt',
      title: 'Last Saved At',
      type: 'datetime',
      readOnly: true,
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'pageSlug.current',
    },
  },
}
```

**Update schema index:** `src/sanity/schemas/index.ts`
```typescript
import pageConfiguration from './pageConfiguration'

export const schemaTypes = [
  // ... existing schemas
  pageConfiguration,
]
```

### Phase 3: API Routes for Save/Load

**New API route:** `app/api/page-config/[slug]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

// GET - Fetch page configuration from Sanity
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    const query = `*[_type == "pageConfiguration" && pageSlug.current == $slug][0]{
      title,
      metaDescription,
      socialImage,
      "componentConfig": componentConfig.configJson,
      lastSavedAt
    }`
    
    const config = await client.fetch(query, { slug })
    
    if (!config) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      )
    }
    
    // Parse the JSON string back to object
    if (config.componentConfig) {
      config.componentConfig = JSON.parse(config.componentConfig)
    }
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching page config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    )
  }
}

// POST - Save page configuration to Sanity
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await request.json()
    const { componentConfig, title, metaDescription } = body
    
    // Check if document exists
    const existingDoc = await client.fetch(
      `*[_type == "pageConfiguration" && pageSlug.current == $slug][0]{ _id }`
    )
    
    const docData = {
      _type: 'pageConfiguration',
      pageSlug: { _type: 'slug', current: slug },
      title: title || `Page: ${slug}`,
      metaDescription: metaDescription || '',
      componentConfig: {
        configJson: JSON.stringify(componentConfig, null, 2),
      },
      lastSavedAt: new Date().toISOString(),
      lastSavedBy: 'admin', // TODO: Add real user tracking
    }
    
    let result
    if (existingDoc) {
      // Update existing document
      result = await client
        .patch(existingDoc._id)
        .set(docData)
        .commit()
    } else {
      // Create new document
      result = await client.create(docData)
    }
    
    return NextResponse.json({ success: true, id: result._id })
  } catch (error) {
    console.error('Error saving page config:', error)
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    )
  }
}
```

### Phase 4: Update story/1 Page Logic

**Changes to:** `src/app/story/1/page.tsx`

**Note**: The original `home-1` page remains untouched as an experimental page. All story collage system implementation happens on `/story/1`.

**Add at top:**
```typescript
const [isSaving, setIsSaving] = useState(false)
const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

// Fetch Sanity config on mount (replaces hardcoded defaults)
useEffect(() => {
  async function loadSanityConfig() {
    try {
      const response = await fetch('/api/page-config/story-1')
      if (response.ok) {
        const data = await response.json()
        if (data.componentConfig) {
          console.log('Loaded config from Sanity:', data.componentConfig)
          // Set as new defaults
          // Only use Sanity values if no LSO override exists
          Object.entries(data.componentConfig).forEach(([key, value]) => {
            const lsoKey = `story1-${key}`
            if (!localStorage.getItem(lsoKey)) {
              // No local override, use Sanity value
              localStorage.setItem(lsoKey, JSON.stringify(value))
            }
          })
          // Trigger re-render
          setMounted(false)
          setTimeout(() => setMounted(true), 0)
        }
      }
    } catch (error) {
      console.error('Failed to load Sanity config:', error)
      // Fall back to hardcoded STORY1_DEFAULTS
    }
  }
  
  if (mounted) {
    loadSanityConfig()
  }
}, []) // Only run once on mount
```

**Note on slug naming:** The API uses slug `story-1` (Sanity-friendly) while the route is `/story/1` (URL-friendly). This separation allows flexibility in URL structure without affecting CMS organization.

**Update red triangle handler (reset):**
```typescript
const handleClearStorage = useCallback(async () => {
  // Clear all LSO
  Object.keys(localStorage)
    .filter(k => k.startsWith('story1-'))
    .forEach(k => localStorage.removeItem(k))
  
  // Fetch fresh from Sanity
  try {
    const response = await fetch('/api/page-config/story-1')
    if (response.ok) {
      const data = await response.json()
      if (data.componentConfig) {
        // Populate LSO with Sanity values
        Object.entries(data.componentConfig).forEach(([key, value]) => {
          localStorage.setItem(`story1-${key}`, JSON.stringify(value))
        })
      }
    }
  } catch (error) {
    console.error('Failed to reset from Sanity:', error)
  }
  
  window.location.reload()
}, [])
```

**Add green triangle handler (save to Sanity):**
```typescript
const handleSaveToSanity = useCallback(async () => {
  setIsSaving(true)
  setSaveStatus('saving')
  
  // Gather current state from LSO
  const currentConfig: Record<string, any> = {}
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('story1-')) {
      const componentKey = key.replace('story1-', '')
      try {
        currentConfig[componentKey] = JSON.parse(localStorage.getItem(key) || 'null')
      } catch (e) {
        console.error(`Failed to parse ${key}:`, e)
      }
    }
  })
  
  try {
    const response = await fetch('/api/page-config/story-1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        componentConfig: currentConfig,
        title: 'Story 1',
        metaDescription: 'Visual story collage #1 for PLAYNE',
      }),
    })
    
    if (response.ok) {
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } else {
      throw new Error('Save failed')
    }
  } catch (error) {
    console.error('Failed to save to Sanity:', error)
    setSaveStatus('error')
    setTimeout(() => setSaveStatus('idle'), 3000)
  } finally {
    setIsSaving(false)
  }
}, [])
```

**Add green triangle JSX:**
```tsx
{/* Green triangle - Save to Sanity */}
{mounted && (
  <div
    className={styles.saveNick}
    onClick={handleSaveToSanity}
    title="Save current state to Sanity"
  >
    {saveStatus === 'saving' && '⏳'}
    {saveStatus === 'success' && '✓'}
    {saveStatus === 'error' && '✗'}
  </div>
)}
```

**Add green triangle CSS to** `page.module.css`:
```css
.saveNick {
  position: fixed;
  top: 0;
  right: 4.5rem; /* Next to red triangle */
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 4rem 4rem 0;
  border-color: transparent var(--brand-blue) transparent transparent;
  cursor: pointer;
  z-index: 9999;
  transition: border-width 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  padding-top: 1rem;
  padding-right: 1rem;
}

.saveNick:hover {
  border-width: 0 4.5rem 4.5rem 0;
}
```

### Phase 5: Sanity Client Token

**For write access**, update Sanity client configuration:

**Modify:** `src/sanity/lib/client.ts`
```typescript
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false, // Important for write operations
  token: process.env.SANITY_API_TOKEN, // Write token for API routes
})
```

**Add to environment variables:**
```bash
# .env.local
SANITY_API_TOKEN=your_write_token_here
```

**Generate token:**
1. Go to Sanity project dashboard
2. Navigate to API settings
3. Create new token with "Editor" permissions
4. Add to `.env.local` and Vercel

## Future Enhancements

### Version History UI
- Display list of previous configurations in Sanity
- "Revert to version" button
- Diff viewer between versions

### A/B Testing
- Multiple configurations per page slug
- Percentage-based traffic splitting
- Analytics integration

### Preview/Staging
- Draft vs. Published states
- Preview URLs with unpublished configs
- Approval workflows

### User Management
- Replace basic auth with proper user accounts
- Track who saved each configuration
- Role-based permissions (editor, viewer, admin)

### Visual Editor Enhancements
- In-page component selector/highlighter
- Real-time config preview in Sanity Studio
- Drag-and-drop reordering
- Component library browser

### Additional Page Types
- Extend beyond home-1 to support:
  - About page stories
  - Program showcases
  - Event galleries
  - Custom landing pages

## Technical Notes

### Why LocalStorage + Sanity?
- **LSO**: Fast, immediate feedback for experimentation
- **Sanity**: Persistent, versionable, team-accessible source of truth
- **Separation**: Clear boundary between ephemeral play and published curation

### Seed Preservation
All randomizable components (PathContainer, Shape) use seeded random generation. When seeds are saved to Sanity, the exact same visual can be reproduced deterministically.

### Performance Considerations
- Sanity fetch only happens once on page load
- LSO reads/writes are synchronous and fast
- Save to Sanity is async with loading state
- Consider debouncing if auto-save is added

### Security Considerations
- Basic auth is temporary; replace with proper auth system before production
- Sanity write token must be server-side only (API routes)
- Consider rate limiting on save endpoint
- Validate/sanitize JSON before saving to Sanity

## Success Metrics

- ✅ Content team can save and publish curated pages
- ✅ Developers can experiment without affecting live site
- ✅ All randomization is reproducible via seeds
- ✅ Password protects dev/staging environments
- ✅ Zero impact on existing page functionality
- ✅ Clear visual indicators for save/reset actions

---

Last updated: October 2025

