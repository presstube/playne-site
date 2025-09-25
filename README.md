# PLAYNE Website

A comprehensive website for PLAYNE, an educational organization that uses creativity to teach practical life skills to young people. Built with Next.js 15, Sanity CMS, and a custom CSS Modules architecture following PLAYNE's brand guidelines.

## About PLAYNE

**Mission:** PLAYNE uses creativity to teach the things we wish we learned in school — how to care for our bodies, understand our emotions, manage money, and find our voice. Through playful, practical lessons rooted in art, we give young people the space to explore *who they are* before being told who to be.

## Features

- ✅ **Next.js 15** with App Router and TypeScript
- ✅ **Sanity CMS** with comprehensive content schemas
- ✅ **CSS Modules architecture** with component co-location
- ✅ **PLAYNE brand integration** (colors, fonts, design system)
- ✅ **7 complete pages** (Home, About, Programs, Events, Get Involved, Support, Contact)
- ✅ **Interactive navigation** with color-changing logo
- ✅ **SEO optimization** with dynamic metadata
- ✅ **Responsive design** following brand guidelines
- ✅ **Content population scripts** for easy setup

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Sanity Project

Run the setup helper to create your environment file:

```bash
npm run setup
```

This creates a `.env.local` file. Update it with your Sanity credentials:

```bash
# Get these from https://www.sanity.io/manage
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 4. Set Up Content

1. Visit [http://localhost:3000/studio](http://localhost:3000/studio) to access Sanity Studio
2. Use the content population scripts to add sample content:

```bash
# Populate all pages with sample content
node scripts/populate-content.js

# Or populate individual pages
node scripts/populate-about-content.js
node scripts/populate-programs-content.js
node scripts/populate-events-content.js
# ... etc
```

## Project Architecture

This project follows a **component co-location architecture** with CSS Modules. Each page and component lives in its own folder with dedicated styles.

### File Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Homepage route (data fetching)
│   │   ├── HomePage/          # Homepage component
│   │   │   ├── HomePage.tsx   # Homepage UI component
│   │   │   └── HomePage.module.css
│   │   ├── about/
│   │   │   └── page.tsx       # About route (data fetching)
│   │   ├── AboutPage/         # About component
│   │   │   ├── AboutPage.tsx
│   │   │   └── AboutPage.module.css
│   │   ├── programs/          # Programs, Events, Get Involved,
│   │   ├── events/            # Support, Contact pages follow
│   │   ├── get-involved/      # the same pattern
│   │   ├── support/
│   │   ├── contact/
│   │   ├── RootLayout/        # Main layout component
│   │   ├── layout.tsx         # Next.js layout (metadata)
│   │   ├── globals.css        # Brand colors, fonts, utilities
│   │   └── studio/            # Sanity Studio route
│   ├── components/            # Reusable components
│   │   ├── Topnav/           # Navigation with interactive logo
│   │   └── PortableText/     # Sanity content renderer
│   └── sanity/               # Sanity configuration
│       ├── lib/
│       │   ├── client.ts     # Sanity client
│       │   ├── image.ts      # Image URL builder
│       │   └── queries.ts    # GROQ queries for all pages
│       └── schemas/          # Content type definitions
│           ├── index.ts      # Schema exports
│           ├── page.ts       # Generic page schema
│           ├── aboutPage.ts  # About page schema
│           ├── programsPage.ts
│           ├── eventsPage.ts
│           ├── event.ts      # Individual event schema
│           ├── getInvolvedPage.ts
│           ├── supportPage.ts
│           └── contactPage.ts
├── scripts/                  # Content population utilities
├── public/
│   ├── fonts/               # PLAYNE brand fonts (Krana Fat Trial)
│   └── svg/                 # PLAYNE logo and assets
├── architecture/            # Architecture documentation
└── context/                 # PLAYNE content and brand guidelines
```

## Content Management

### Sanity Schemas

The project includes specialized schemas for each page type:

- **Generic Page**: Basic title/content/SEO structure
- **About Page**: Mission, story, team sections with member profiles
- **Programs Page**: Curriculum pillars, learning modules
- **Events Page**: Event listing with filtering and management
- **Get Involved Page**: Partner information, interest forms, email signup
- **Support Page**: Donation tiers, sponsorship levels, impact statistics
- **Contact Page**: General contact, press contacts, location info

### Content Population

Use the scripts in `/scripts` to populate your Sanity project with sample content:

```bash
# Populate all pages
node scripts/populate-content.js

# Individual page scripts
node scripts/populate-about-content.js
node scripts/populate-programs-content.js
node scripts/populate-events-content.js
node scripts/populate-get-involved-content.js
node scripts/populate-support-content.js
node scripts/populate-contact-content.js

# Generate sample events
node scripts/generate-sample-events.js
```

## PLAYNE Brand System

### Colors

The project includes PLAYNE's complete brand color palette:

```css
--brand-black: #231f20
--brand-red: #FC555B
--brand-yellow: #FCDC4A
--brand-pink: #FB6DCB
--brand-blue: #A9ECD4
--brand-offwhite: #EAEADA
```

### Typography

- **Krana Fat Trial**: Display font for headings and branding
- **Parkinsans**: Sans-serif font for body text (Google Fonts)

### Usage in Components

```css
/* Component.module.css */
.title {
  font-family: var(--font-family-display);
  color: var(--brand-black);
  background-color: var(--brand-yellow);
}

.content {
  font-family: var(--font-family-sans);
  color: var(--brand-black);
  margin-bottom: var(--space-8);
}
```

Or use utility classes:

```jsx
<h1 className="font-display text-brand-black bg-brand-yellow">
  PLAYNE Title
</h1>
```

## Development Workflow

### Architecture Guidelines

This project follows the patterns defined in `/architecture/pages-components-css.md`:

1. **Component Co-location**: Each component lives with its CSS file
2. **Clear Separation**: Pages handle data, components handle UI
3. **CSS Modules**: Scoped styles, no naming conflicts
4. **Single Responsibility**: Each component has one clear purpose

### Adding New Pages

1. Create route folder: `src/app/new-page/`
2. Add `page.tsx` for data fetching and metadata
3. Create component folder: `src/app/NewPage/`
4. Add `NewPage.tsx` and `NewPage.module.css`
5. Create Sanity schema in `src/sanity/schemas/`
6. Add queries to `src/sanity/lib/queries.ts`

### Styling Guidelines

- Use CSS Modules for component-specific styles
- Use CSS custom properties for brand colors and spacing
- Keep `globals.css` minimal (resets, brand tokens, utilities only)
- Follow established spacing scale (`--space-1` through `--space-12`)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run setup` - Initialize Sanity environment file

## Deployment

### Environment Variables

Set these in your deployment platform:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

## Troubleshooting

### Common Issues

**"Cannot find Sanity project"**
- Check your `.env.local` file exists and has correct project ID
- Verify project ID at [sanity.io/manage](https://www.sanity.io/manage)

**"No content showing"**
- Run content population scripts: `node scripts/populate-content.js`
- Check Sanity Studio at `/studio` for content

**"Fonts not loading"**
- Verify font files exist in `/public/fonts/`
- Check font-face declarations in `globals.css`

**"Styles not applying"**
- Ensure CSS Module imports use correct path
- Check component className matches CSS class name
- Verify CSS custom properties are defined in `globals.css`

## Learn More

- [Architecture Documentation](/architecture/) - Project structure and patterns
- [PLAYNE Brand Guidelines](/context/) - Brand colors, fonts, and guidelines  
- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [Sanity Documentation](https://www.sanity.io/docs) - Content management
- [CSS Modules Guide](https://github.com/css-modules/css-modules) - Styling approach