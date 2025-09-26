import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Welcome to PLAYNE',
    }),
    defineField({
      name: 'subtitle',
      title: 'Page Subtitle',
      type: 'string',
      description: 'Optional subtitle that appears below the main title',
    }),
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'headline',
          title: 'Main Headline',
          type: 'string',
          description: 'Primary headline for the homepage hero',
        },
        {
          name: 'description',
          title: 'Hero Description',
          type: 'array',
          of: [
            {
              type: 'block',
            },
          ],
          description: 'Rich text content for the hero section',
        },
        {
          name: 'ctaButton',
          title: 'Call to Action Button',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
            },
            {
              name: 'link',
              title: 'Button Link',
              type: 'string',
              description: 'Internal link (e.g., /about) or external URL',
            },
          ],
        },
        {
          name: 'heroImage',
          title: 'Hero Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'introSection',
      title: 'Introduction Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'About PLAYNE',
        },
        {
          name: 'content',
          title: 'Introduction Content',
          type: 'array',
          of: [
            {
              type: 'block',
            },
            {
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'featuredPrograms',
      title: 'Featured Programs Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Our Programs',
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
        },
        {
          name: 'programs',
          title: 'Featured Programs',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Program Title',
                  type: 'string',
                },
                {
                  name: 'description',
                  title: 'Program Description',
                  type: 'text',
                },
                {
                  name: 'icon',
                  title: 'Program Icon',
                  type: 'string',
                  description: 'Icon name or emoji',
                },
                {
                  name: 'link',
                  title: 'Program Link',
                  type: 'string',
                  description: 'Link to program details',
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'callToActionSection',
      title: 'Call to Action Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'CTA Title',
          type: 'string',
          initialValue: 'Get Involved',
        },
        {
          name: 'description',
          title: 'CTA Description',
          type: 'text',
        },
        {
          name: 'primaryButton',
          title: 'Primary Button',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
            },
            {
              name: 'link',
              title: 'Button Link',
              type: 'string',
            },
          ],
        },
        {
          name: 'secondaryButton',
          title: 'Secondary Button',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
            },
            {
              name: 'link',
              title: 'Button Link',
              type: 'string',
            },
          ],
        },
      ],
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
