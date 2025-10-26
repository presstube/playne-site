import { defineType, defineField } from 'sanity'

export const pageConfiguration = defineType({
  name: 'pageConfiguration',
  title: 'Page Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'pageSlug',
      title: 'Page Slug',
      type: 'slug',
      description: 'URL identifier for this page (e.g., story-1, story-2, about-story)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'SEO description for search engines and social media',
    }),
    defineField({
      name: 'socialImage',
      title: 'Social Card Image',
      type: 'image',
      description: 'Image shown when page is shared on social media',
      options: {
        hotspot: true,
      },
    }),
    defineField({
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
          description: 'Component state as JSON. Auto-populated when saving from the green triangle.',
        },
      ],
    }),
    defineField({
      name: 'lastSavedBy',
      title: 'Last Saved By',
      type: 'string',
      readOnly: true,
      description: 'User who last saved this configuration',
    }),
    defineField({
      name: 'lastSavedAt',
      title: 'Last Saved At',
      type: 'datetime',
      readOnly: true,
      description: 'Timestamp of last save',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'pageSlug.current',
      lastSaved: 'lastSavedAt',
    },
    prepare({ title, subtitle, lastSaved }) {
      return {
        title: title || 'Untitled Page',
        subtitle: subtitle ? `/${subtitle}` : 'No slug set',
        description: lastSaved ? `Last saved: ${new Date(lastSaved).toLocaleDateString()}` : 'Never saved',
      }
    },
  },
})

