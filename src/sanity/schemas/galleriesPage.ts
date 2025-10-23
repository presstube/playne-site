import { defineField, defineType } from 'sanity'

export const galleriesPage = defineType({
  name: 'galleriesPage',
  title: 'Galleries Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Galleries',
    }),
    defineField({
      name: 'subtitle',
      title: 'Page Subtitle',
      type: 'string',
      description: 'Optional subtitle that appears below the main title',
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
      description: 'Introduction content for the galleries page',
    }),
    defineField({
      name: 'isGalleriesVisible',
      title: 'Show Galleries Page?',
      type: 'boolean',
      description: 'Toggle to show/hide the galleries page on the site',
      initialValue: false,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
    },
  },
})

