import { Field } from 'payload/types'

const linkColumn: Field[] = [
  {
    name: 'title',
    type: 'text',
  },
  {
    name: 'href',
    type: 'text',
  },
  {
    type: 'array',
    name: 'links',
    maxRows: 6,
    fields: [
      {
        name: 'title',
        type: 'text',
      },
      {
        name: 'href',
        type: 'text',
      },
    ],
  },
]

export const footer: Field[] = [
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
      { name: 'showAddress', type: 'checkbox', defaultValue: true },
      { name: 'showPhone', type: 'checkbox', defaultValue: true },
      { name: 'showEmail', type: 'checkbox', defaultValue: true },
      { name: 'showSocial', type: 'checkbox', defaultValue: true },
    ],
  },
  {
    name: 'columns',
    type: 'array',
    maxRows: 2,
    fields: linkColumn,
  },
]
