# Next.js + Sanity CMS Project

A modern web application built with Next.js and Sanity CMS, featuring a clean architecture and content management capabilities.

## Features

- ✅ Next.js 15 with App Router
- ✅ TypeScript support
- ✅ Tailwind CSS for styling
- ✅ Sanity CMS integration
- ✅ Sanity Studio at `/studio` route
- ✅ Responsive layout with navigation
- ✅ SEO-friendly pages
- ✅ Portable Text content rendering

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Sanity Project

1. Create a new Sanity project at [sanity.io](https://www.sanity.io/)
2. Get your Project ID and Dataset name
3. Create a `.env.local` file in the root directory:

```bash
# Copy from .env.example and update with your values
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 4. Access Sanity Studio

Visit [http://localhost:3000/studio](http://localhost:3000/studio) to access the Sanity Studio and start creating content.

### 5. Create Your First Pages

In the Sanity Studio:

1. Create a new "Page" document
2. Set the slug to "home" for the homepage
3. Set the slug to "about" for the about page
4. Add your content using the rich text editor

## Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── about/          # About page
│   │   ├── studio/         # Sanity Studio route
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   └── components/         # React components
│       ├── Layout.tsx      # Main layout component
│       └── PortableText.tsx # Sanity content renderer
├── sanity/                 # Sanity configuration
│   ├── lib/               # Sanity utilities
│   │   ├── client.ts      # Sanity client
│   │   ├── image.ts       # Image URL builder
│   │   └── queries.ts     # GROQ queries
│   └── schemas/           # Content schemas
│       ├── index.ts       # Schema exports
│       └── page.ts        # Page schema
└── sanity.config.ts       # Sanity configuration
```

## Content Schema

The project includes a flexible `Page` schema with:

- **Title**: Page title
- **Slug**: URL slug for routing
- **Content**: Rich text content with images
- **SEO**: Meta title and description

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Adding New Content Types

1. Create a new schema file in `sanity/schemas/`
2. Add it to the `schemaTypes` array in `sanity/schemas/index.ts`
3. Create corresponding queries in `sanity/lib/queries.ts`
4. Build your frontend components to display the content

### Styling

The project uses Tailwind CSS. Customize the design by:

- Modifying component styles in the React components
- Updating the Tailwind configuration in `tailwind.config.ts`
- Adding custom CSS in `src/app/globals.css`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Other Platforms

Make sure to set the environment variables for your Sanity project configuration.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)