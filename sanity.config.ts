import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'

// Define the structure for better organization
const structure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      // Pages section
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Site Pages')
            .items([
              S.listItem()
                .title('Home Page')
                .child(S.document().schemaType('homePage').documentId('homePage')),
              S.listItem()
                .title('About Page')
                .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
              S.listItem()
                .title('Programs Page')
                .child(S.document().schemaType('programsPage').documentId('programsPage')),
              S.listItem()
                .title('Get Involved Page')
                .child(S.document().schemaType('getInvolvedPage').documentId('getInvolvedPage')),
              S.listItem()
                .title('Support Page')
                .child(S.document().schemaType('supportPage').documentId('supportPage')),
              S.listItem()
                .title('Contact Page')
                .child(S.document().schemaType('contactPage').documentId('contactPage')),
              S.listItem()
                .title('Events Page')
                .child(S.document().schemaType('eventsPage').documentId('eventsPage')),
            ])
        ),
      
      // Events section
      S.divider(),
      S.listItem()
        .title('Events')
        .child(S.documentTypeList('event').title('All Events')),
      
      // Galleries section
      S.divider(),
      S.listItem()
        .title('Galleries')
        .child(
          S.list()
            .title('Gallery Management')
            .items([
              S.listItem()
                .title('Galleries Page Settings')
                .child(S.document().schemaType('galleriesPage').documentId('galleriesPage')),
              S.divider(),
              S.listItem()
                .title('All Galleries')
                .child(S.documentTypeList('gallery').title('Galleries')),
            ])
        ),
      
      // Filter out singleton pages from the main list
      ...S.documentTypeListItems().filter(
        (listItem: any) => ![
          'homePage',
          'aboutPage', 
          'programsPage',
          'getInvolvedPage',
          'supportPage',
          'contactPage',
          'eventsPage',
          'event',
          'galleriesPage',
          'gallery'
        ].includes(listItem.getId())
      ),
    ])

export default defineConfig({
  name: 'default',
  title: 'PLAYNE Website',
  
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  
  plugins: [
    structureTool({
      structure,
    }),
    visionTool()
  ],
  
  schema: {
    types: schemaTypes,
  },
  
  basePath: '/studio',
})
