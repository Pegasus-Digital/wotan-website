import { Field } from 'payload/types'
import linkGroup from './linkGroup'
import link from './link'

const linkColumn: Field[] = [
  {
    name: 'title',
    type: 'text',
    required: true,
  },
  linkGroup({ overrides: { name: 'links', required: true } }),
]

export const footer: Field[] = [
  {
    name: 'footer',
    type: 'group',
    interfaceName: 'Footer',
    fields: [
      {
        name: 'logo',
        type: 'upload',
        relationTo: 'media',
        required: true,
      },
      {
        type: 'group',
        name: 'companyInfo',
        fields: [
          {
            name: 'showAddress',
            type: 'checkbox',
            defaultValue: true,
            required: true,
          },
          {
            name: 'showPhone',
            type: 'checkbox',
            defaultValue: true,
            required: true,
          },
          {
            name: 'showEmail',
            type: 'checkbox',
            defaultValue: true,
            required: true,
          },
          {
            name: 'showSocial',
            type: 'checkbox',
            defaultValue: true,
            required: true,
          },
        ],
      },
      {
        name: 'columns',
        type: 'array',
        maxRows: 2,
        required: true,
        minRows: 2,
        fields: linkColumn,
      },
    ],
  },
]
