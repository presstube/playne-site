import { defineField, defineType } from 'sanity'

export const supportPage = defineType({
  name: 'supportPage',
  title: 'Support Page',
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
      name: 'donationSection',
      title: 'Donation Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Make a Donation',
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
          name: 'donationTiers',
          title: 'Donation Tiers',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'amount',
                  title: 'Donation Amount',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'title',
                  title: 'Tier Title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'description',
                  title: 'Tier Description',
                  type: 'text',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'benefits',
                  title: 'Benefits',
                  type: 'array',
                  of: [{ type: 'string' }],
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'sponsorshipSection',
      title: 'Sponsorship Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Sponsorship Opportunities',
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
          name: 'sponsorshipLevels',
          title: 'Sponsorship Levels',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'level',
                  title: 'Sponsorship Level',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Bronze', value: 'bronze' },
                      { title: 'Silver', value: 'silver' },
                      { title: 'Gold', value: 'gold' },
                      { title: 'Platinum', value: 'platinum' },
                      { title: 'Custom', value: 'custom' },
                    ],
                  },
                },
                {
                  name: 'title',
                  title: 'Level Title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'description',
                  title: 'Level Description',
                  type: 'text',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'minAmount',
                  title: 'Minimum Amount',
                  type: 'string',
                },
                {
                  name: 'benefits',
                  title: 'Benefits',
                  type: 'array',
                  of: [{ type: 'string' }],
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'impactSection',
      title: 'Impact Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Your Impact',
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
        },
        {
          name: 'impactStats',
          title: 'Impact Statistics',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'number',
                  title: 'Statistic Number',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'label',
                  title: 'Statistic Label',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'description',
                  title: 'Statistic Description',
                  type: 'text',
                  validation: (Rule) => Rule.required(),
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
