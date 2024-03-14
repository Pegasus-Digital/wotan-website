import { titleAndDesc } from '../../fields/titleAndDesc'
import { invertBackground } from '../../fields/invertBackgroud'
import { Block } from 'payload/types'

export const ClientGrid: Block = {
  slug: 'client-grid',
  interfaceName: 'ClientGrid',
  labels: {
    singular: 'Client Grid',
    plural: 'Client Grids',
  },
  fields: [
    invertBackground,
    ...titleAndDesc,
    {
      name: 'clients',
      type: 'array',
      minRows: 10,
      maxRows: 50,
      required: true,
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
