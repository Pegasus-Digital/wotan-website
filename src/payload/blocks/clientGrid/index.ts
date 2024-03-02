import { invertBackground } from '../../fields/invertBackgroud'
import { Block } from 'payload/types'

export const ClientGrid: Block = {
  slug: 'client-grid',
  labels: {
    singular: 'Client Grid',
    plural: 'Client Grids',
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
      name: 'clients',
      type: 'array',
      minRows: 10,
      fields: [
        {
          name: 'logo',
          type: 'upload',
          required: true,
          relationTo: 'media',
        },
      ],
    },
  ],
}
