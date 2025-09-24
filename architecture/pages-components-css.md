# Pages-Components-CSS Architecture Guide

## Overview
This document defines the architectural patterns and conventions for organizing pages, components, and CSS in this Next.js project.

## Core Principles

### 1. Component Co-location
- Each page and component lives in its own named folder
- CSS files live alongside their JavaScript counterparts
- Related code stays together for better maintainability

### 2. Clear Separation of Concerns
- **Pages**: Data fetching, SEO metadata, routing logic
- **Components**: Reusable UI chunks with single responsibility
- **CSS**: Scoped to component, minimal global styles

### 3. Predictable Naming
- Folder names match component names
- Files within folders match their parent folder name
- Clear, descriptive names that indicate purpose

## File Structure

```
src/
  app/
    page.js                    # Next.js entry point (data fetching)
    HomePage/                  # Homepage component folder
      HomePage.js              # Homepage component
      HomePage.module.css      # Homepage styles
    
    layout.js                  # Root layout entry point
    RootLayout/               # Root layout component folder
      RootLayout.js           # Root layout component
      RootLayout.module.css   # Root layout styles
    
    artists/
      [slug]/
        page.js               # Artist page entry point
        ArtistPage/           # Artist page component folder
          ArtistPage.js       # Artist page component
          ArtistPage.module.css
    
    authors/
      [slug]/
        page.js               # Author page entry point
        AuthorPage/           # Author page component folder
          AuthorPage.js       # Author page component
          AuthorPage.module.css
    
    globals.css               # Global defaults and resets only
    
  components/
    HomeContent/
      HomeContent.js
      HomeContent.module.css
    Topnav/
      Topnav.js
      Topnav.module.css
    AppImage/
      AppImage.js
      AppImage.module.css
```

## CSS Methodology: CSS Modules

### Why CSS Modules?
- **Scoped styles**: No naming conflicts between components
- **Co-location**: CSS files live next to their components
- **Next.js native**: Works out-of-the-box with Next.js
- **Simple**: Write normal CSS with automatic scoping

### CSS Module Usage
```js
// Component.js
import styles from './Component.module.css'

export default function Component() {
  return <div className={styles.container}>Content</div>
}
```

```css
/* Component.module.css */
.container {
  padding: 20px;
  background: white;
}

.title {
  font-size: 24px;
  color: #333;
}
```

## Page Architecture Pattern

### Next.js Entry Point (page.js)
- Minimal file handling Next.js requirements
- Data fetching and server-side logic
- SEO metadata generation
- Imports and renders the actual page component

```js
// app/page.js
import HomePage from './HomePage/HomePage'
import { client } from '@/sanity/lib/client'
import { artistsQuery, authorsQuery } from '@/sanity/lib/queries'

export default async function Page() {
  const artists = await client.fetch(artistsQuery)
  const authors = await client.fetch(authorsQuery)
  return <HomePage artists={artists} authors={authors} />
}
```

### Page Component (PageName/PageName.js)
- Clean, focused UI component
- Receives data as props
- Handles page-specific layout and composition
- Uses component-specific CSS

```js
// app/HomePage/HomePage.js
import styles from './HomePage.module.css'
import HomeContent from '@/components/HomeContent/HomeContent'

export default function HomePage({ artists, authors }) {
  return (
    <div className={styles.homePage}>
      <HomeContent artists={artists} authors={authors} />
    </div>
  )
}
```

## Component Architecture

### Component Structure
- Single responsibility principle
- **Reusable across pages** (key criteria)
- Self-contained with own styles
- Clear props interface

### Component Boundaries
**Extract as separate component when:**
- Used in multiple pages/locations
- Standalone functionality (buttons, forms, modals)
- Complex widgets that could be reused
- Clear abstraction boundaries

**Keep in page folder when:**
- Page-specific implementation logic
- Complex state tied to that page
- Search, filtering, or page routing logic
- Not reusable elsewhere

### Component Naming
- PascalCase for component names
- Descriptive, purpose-driven names
- Avoid generic names like "Container" or "Wrapper"

## Global CSS Scope

### What belongs in globals.css:
- CSS reset/normalize
- Typography defaults (font-family, base font-size)
- Color variables and design tokens
- Basic utility classes
- Root-level styles (html, body)

### What does NOT belong in globals.css:
- Component-specific styles
- Layout styles
- Complex utility classes
- Component state styles

```css
/* globals.css - Example structure */
/* CSS Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Design tokens */
:root {
  --color-primary: #333;
  --color-secondary: #666;
  --font-family: system-ui, sans-serif;
  --font-size-base: 16px;
}

/* Base styles */
body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-primary);
}

/* Tailwind imports */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Migration Strategy

### Phase 1: Setup Structure
1. Create page component folders
2. Move page logic to dedicated components
3. Create CSS module files

### Phase 2: CSS Migration
1. Strip globals.css to essentials
2. Move component styles to CSS modules
3. Remove inline styles and Tailwind classes

### Phase 3: Component Refactoring
1. Ensure single responsibility
2. Update import/export patterns
3. Test all components work correctly

## Benefits of This Approach

1. **Maintainability**: Easy to find and modify related code
2. **Scalability**: Clear patterns for adding new features
3. **Reusability**: Components can be easily reused
4. **Performance**: CSS Modules provide optimal bundling
5. **Developer Experience**: Predictable structure reduces cognitive load

## Future Considerations

- Consider component composition for complex components
- Shared/common components in `src/components/ui/`
- Design system components as project grows
- Testing strategy for components in isolation 