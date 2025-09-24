import { defineField, defineType } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
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
      name: 'mission',
      title: 'Mission Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Our Mission',
        },
        {
          name: 'content',
          title: 'Mission Content',
          type: 'array',
          of: [
            {
              type: 'block',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'story',
      title: 'Story Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Our Story',
        },
        {
          name: 'content',
          title: 'Story Content',
          type: 'array',
          of: [
            {
              type: 'block',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'team',
      title: 'Team Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Our Team',
        },
        {
          name: 'content',
          title: 'Team Content',
          type: 'array',
          of: [
            {
              type: 'block',
            },
          ],
        },
        {
          name: 'members',
          title: 'Team Members',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'name',
                  title: 'Name',
                  type: 'string',
                },
                {
                  name: 'role',
                  title: 'Role',
                  type: 'string',
                },
                {
                  name: 'bio',
                  title: 'Bio',
                  type: 'text',
                },
                {
                  name: 'image',
                  title: 'Photo',
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                },
              ],
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
