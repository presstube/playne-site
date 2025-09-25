import { defineField, defineType } from 'sanity'

export const eventsPage = defineType({
  name: 'eventsPage',
  title: 'Events Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Page Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'text',
      description: 'Brief description shown below the hero section',
    }),
    defineField({
      name: 'isEventsVisible',
      title: 'Show Events Page?',
      type: 'boolean',
      description: 'Toggle to show/hide the events page content. When hidden, shows "Coming Soon" message.',
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
      isVisible: 'isEventsVisible',
    },
    prepare(selection) {
      const { title, subtitle, isVisible } = selection
      return {
        title,
        subtitle: `${subtitle} ${isVisible ? '(Visible)' : '(Hidden)'}`,
      }
    },
  },
})
