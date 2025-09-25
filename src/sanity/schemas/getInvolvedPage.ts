import { defineField, defineType } from 'sanity'

export const getInvolvedPage = defineType({
  name: 'getInvolvedPage',
  title: 'Get Involved Page',
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
      name: 'partnersSection',
      title: 'Partners & Collaborators Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Partners & Collaborators',
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
        },
        {
          name: 'partnerTypes',
          title: 'Partner Types',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Partner Type Title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'description',
                  title: 'Partner Type Description',
                  type: 'text',
                  validation: (Rule) => Rule.required(),
                },
              ],
            },
          ],
        },
        {
          name: 'currentPartners',
          title: 'Current Partners',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'name',
                  title: 'Partner Name',
                  type: 'string',
                },
                {
                  name: 'description',
                  title: 'Partner Description',
                  type: 'text',
                },
                {
                  name: 'logo',
                  title: 'Partner Logo',
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                },
                {
                  name: 'website',
                  title: 'Website URL',
                  type: 'url',
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'interestFormSection',
      title: 'Interest Form Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Express Your Interest',
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
        },
        {
          name: 'formFields',
          title: 'Form Configuration',
          type: 'object',
          fields: [
            {
              name: 'nameLabel',
              title: 'Name Field Label',
              type: 'string',
              initialValue: 'Name',
            },
            {
              name: 'emailLabel',
              title: 'Email Field Label',
              type: 'string',
              initialValue: 'Email',
            },
            {
              name: 'organizationLabel',
              title: 'Organization Field Label',
              type: 'string',
              initialValue: 'Organization',
            },
            {
              name: 'roleLabel',
              title: 'Role Field Label',
              type: 'string',
              initialValue: 'Your Role',
            },
            {
              name: 'interestLabel',
              title: 'Interest Field Label',
              type: 'string',
              initialValue: 'How would you like to get involved?',
            },
            {
              name: 'submitButtonText',
              title: 'Submit Button Text',
              type: 'string',
              initialValue: 'Submit Interest',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'emailSignupSection',
      title: 'Email Signup Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Stay Updated',
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
        },
        {
          name: 'placeholder',
          title: 'Email Input Placeholder',
          type: 'string',
          initialValue: 'Enter your email address',
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Sign Up',
        },
        {
          name: 'disclaimer',
          title: 'Privacy Disclaimer',
          type: 'text',
          initialValue: 'We respect your privacy and will never share your information. Unsubscribe at any time.',
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
