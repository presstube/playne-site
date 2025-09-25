import { defineField, defineType } from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
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
      name: 'generalContactSection',
      title: 'General Contact Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'General Contact',
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
        },
        {
          name: 'content',
          title: 'Additional Content',
          type: 'array',
          of: [
            {
              type: 'block',
            },
          ],
        },
        {
          name: 'contactMethods',
          title: 'Contact Methods',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'type',
                  title: 'Contact Type',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Email', value: 'email' },
                      { title: 'Phone', value: 'phone' },
                      { title: 'Website', value: 'website' },
                      { title: 'Other', value: 'other' },
                    ],
                  },
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'value',
                  title: 'Contact Value',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'pressSection',
      title: 'Press & Media Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Press & Media',
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
        },
        {
          name: 'content',
          title: 'Additional Content',
          type: 'array',
          of: [
            {
              type: 'block',
            },
          ],
        },
        {
          name: 'pressContacts',
          title: 'Press Contacts',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'name',
                  title: 'Contact Name',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'role',
                  title: 'Role/Title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'email',
                  title: 'Email',
                  type: 'string',
                  validation: (Rule) => Rule.required().email(),
                },
                {
                  name: 'phone',
                  title: 'Phone',
                  type: 'string',
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'locationSection',
      title: 'Location Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Location',
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
        },
        {
          name: 'address',
          title: 'Address',
          type: 'text',
        },
        {
          name: 'hours',
          title: 'Hours',
          type: 'string',
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
