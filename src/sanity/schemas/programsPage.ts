import { defineField, defineType } from 'sanity'

export const programsPage = defineType({
  name: 'programsPage',
  title: 'Programs Page',
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
      name: 'curriculumPillars',
      title: 'Curriculum Pillars Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Curriculum Pillars',
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
        },
        {
          name: 'pillars',
          title: 'Pillars',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Pillar Title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'description',
                  title: 'Pillar Description',
                  type: 'text',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'icon',
                  title: 'Pillar Icon',
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                },
              ],
            },
          ],
          validation: (Rule) => Rule.max(4),
        },
      ],
    }),
    defineField({
      name: 'learningModules',
      title: 'Learning Modules Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Learning Modules',
        },
        {
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [
            {
              type: 'block',
            },
          ],
        },
        {
          name: 'isComingSoon',
          title: 'Show as Coming Soon',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'modules',
          title: 'Learning Modules',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Module Title',
                  type: 'string',
                },
                {
                  name: 'description',
                  title: 'Module Description',
                  type: 'text',
                },
                {
                  name: 'pillar',
                  title: 'Related Pillar',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Anatomy & Body Awareness', value: 'anatomy' },
                      { title: 'Wellness & Self-Care', value: 'wellness' },
                      { title: 'Nutrition & Healthy Living', value: 'nutrition' },
                      { title: 'Financial Literacy', value: 'financial' },
                    ],
                  },
                },
                {
                  name: 'duration',
                  title: 'Duration',
                  type: 'string',
                },
                {
                  name: 'ageGroup',
                  title: 'Age Group',
                  type: 'string',
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
