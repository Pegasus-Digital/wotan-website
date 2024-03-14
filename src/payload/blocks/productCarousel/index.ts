import link from '../../fields/link'
import { invertBackground } from '../../fields/invertBackgroud'
import type { Block } from 'payload/types'
import { titleAndDesc } from '../../fields/titleAndDesc'
import { Label } from '@radix-ui/react-label'

export const ProductCarousel: Block = {
  slug: 'product-carousel',
  interfaceName: 'ProductCarousel',
  labels: {
    singular: 'Product Carousel',
    plural: 'Product Carousels',
  },
  fields: [
    invertBackground,
    ...titleAndDesc,
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'categories',
      required: true,
      options: [
        {
          label: 'Categories',
          value: 'categories',
        },
        {
          label: 'Individual Selection',
          value: 'selection',
        },
      ],
    },
    {
      type: 'relationship',
      name: 'categories',
      label: 'Categories To Show',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'categories',
      },
    },
    {
      type: 'relationship',
      name: 'selectedDocs',
      label: 'Selection',
      relationTo: ['products'],
      hasMany: true,
      maxRows: 4,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
    },
    {
      type: 'relationship',
      name: 'populatedDocs',
      label: 'Populated Docs',
      relationTo: ['products'],
      hasMany: true,
      admin: {
        disabled: true,
        description: 'This field is auto-populated after-read',
        condition: (_, siblingData) => siblingData.populateBy === 'categories',
      },
    },
    {
      name: 'seeMore',
      type: 'checkbox',
      required: true,
      defaultValue: true,
    },

    link({ overrides: { name: 'seeMoreLink' } }),
  ],
}
