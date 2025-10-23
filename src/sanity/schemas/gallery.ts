import { defineField, defineType } from 'sanity'

export const gallery = defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Gallery Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Gallery Description',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
      description: 'Rich text description of the gallery',
    }),
    defineField({
      name: 'date',
      title: 'Gallery Date',
      type: 'date',
      description: 'Optional date (event date, exhibition date, etc.)',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Where the photos were taken',
    }),
    defineField({
      name: 'photographer',
      title: 'Photographer',
      type: 'string',
      description: 'Photo credit attribution',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Tags for filtering and organization',
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'asset',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption for this image',
            },
            {
              name: 'altText',
              title: 'Alt Text',
              type: 'string',
              description: 'Accessibility description (required)',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'order',
              title: 'Order',
              type: 'number',
              description: 'Manual sort order (optional)',
            },
            {
              name: 'photographer',
              title: 'Photographer',
              type: 'string',
              description: 'Per-image credit if different from gallery photographer',
            },
          ],
          preview: {
            select: {
              title: 'caption',
              subtitle: 'altText',
              media: 'asset',
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Gallery?',
      type: 'boolean',
      description: 'Highlight this gallery on the galleries page',
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
      date: 'date',
      images: 'images',
      media: 'images.0.asset',
    },
    prepare(selection) {
      const { title, date, images, media } = selection
      const imageCount = images ? images.length : 0
      const formattedDate = date ? new Date(date).toLocaleDateString() : ''
      return {
        title,
        subtitle: `${imageCount} image${imageCount !== 1 ? 's' : ''}${formattedDate ? ` • ${formattedDate}` : ''}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Date (newest first)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Date (oldest first)',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})

