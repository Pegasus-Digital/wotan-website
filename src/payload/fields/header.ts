import { Field } from 'payload/types'
import linkGroup from './linkGroup'
import link from './link'

const columnFields: Field[] = [
  {
    name: 'type',
    type: 'select',
    defaultValue: 'linkCol',
    required: true,
    options: [
      {
        value: 'linkCol',
        label: 'Link Column',
      },
      {
        value: 'card',
        label: 'Card',
      },
    ],
  },
  {
    name: 'content',
    type: 'group',
    interfaceName: 'CardNav',
    fields: [
      {
        name: 'title',
        type: 'text',
      },
      { name: 'description', type: 'text' },
    ],
    admin: {
      condition: (_, data) => data.type === 'card',
    },
  },
  {
    name: 'linkColumn',
    type: 'array',
    interfaceName: 'NavLinkColumn',
    minRows: 1,
    maxRows: 4,
    fields: [
      link({ appearances: false }),
      { name: 'description', type: 'text' },
    ],
    admin: {
      condition: (_, data) => data.type === 'linkCol',
    },
  },
]

export const header: Field[] = [
  {
    name: 'header',
    type: 'group',
    interfaceName: 'Header',
    fields: [
      {
        name: 'logo',
        type: 'upload',
        relationTo: 'media',
        required: true,
      },
      {
        name: 'navigation',
        type: 'group',
        interfaceName: 'Navigation',
        fields: [
          {
            name: 'style',
            type: 'select',
            options: [
              { label: 'Classic', value: 'classic' },
              { label: 'Dropdown', value: 'dropdown' },
              { label: 'Mega Menu', value: 'megaMenu' },
            ],
            defaultValue: 'classic',
            required: true,
          },
          {
            name: 'links',
            type: 'array',
            minRows: 1,
            maxRows: 6,
            required: true,
            fields: [
              link({ appearances: false, overrides: { name: 'linkTo' } }),
              {
                name: 'onlyLink',
                type: 'checkbox',
                defaultValue: false,
                required: true,
              },

              {
                name: 'columns',
                type: 'array',
                maxRows: 3,
                fields: columnFields,
                // admin: {
                //   condition: (data, siblingData) => {
                //     console.log(data, siblingData)
                //     if (
                //       data.header.navigation.style === 'megaMenu' &&
                //       !siblingData.onlyLink
                //     ) {
                //       return true
                //     } else {
                //       return false
                //     }
                //   },
                // },
              },
              linkGroup({
                appearances: false,
                overrides: { name: 'subLinks', maxRows: 6 },
              }),
            ],
          },
        ],
      },
    ],
  },
]
