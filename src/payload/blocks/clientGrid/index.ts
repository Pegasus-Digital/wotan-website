import { Block } from 'payload/types'

export const ClientGrid: Block = {
  slug: 'client-grid',
  labels: {
    singular: 'Client Grid',
    plural: 'Client Grids',
  },
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
