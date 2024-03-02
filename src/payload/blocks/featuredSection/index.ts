import { invertBackground } from '../../fields/invertBackgroud'
import type { Block } from 'payload/types'

export const FeaturedSection: Block = {
  slug: 'featured-section',
  labels: {
    singular: 'Featured Section',
    plural: 'Featured Sections',
  },
  fields: [
    invertBackground,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      type: 'array',
      name: 'cards',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'linkTo',
          relationTo: ['categories', 'products'],
          type: 'relationship',
        },
      ],
    },
  ],
}
