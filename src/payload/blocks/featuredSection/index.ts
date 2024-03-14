import { titleAndDesc } from '../../fields/titleAndDesc'
import { invertBackground } from '../../fields/invertBackgroud'
import type { Block } from 'payload/types'

export const FeaturedSection: Block = {
  slug: 'featured-section',
  interfaceName: 'FeaturedSection',
  labels: {
    singular: 'Featured Section',
    plural: 'Featured Sections',
  },
  fields: [
    invertBackground,
    ...titleAndDesc,
    {
      type: 'array',
      name: 'cards',
      minRows: 4,
      maxRows: 4,
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'linkTo',
          relationTo: ['categories', 'products'],
          type: 'relationship',
          required: true,
        },
      ],
    },
  ],
}
