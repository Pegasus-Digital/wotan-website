import { Field } from 'payload/types'
import { navLink } from '../fields/navLink'

const columnFields: Field[] = [
  {
    name: 'type',
    type: 'select',
    defaultValue: 'linkCol',
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
    maxRows: 4,
    fields: navLink,
    admin: {
      condition: (_, data) => data.type === 'linkCol',
    },
  },
]

export const header: Field[] = [
  {
    name: 'navigation',
    type: 'group',
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
          {
            name: 'title',
            type: 'text',
          },
          {
            name: 'onlyLink',
            type: 'checkbox',
            defaultValue: false,
            required: true,
            admin: {
              // condition: (data) => {
              //   if (
              //     data.header.navigation.style === 'megaMenu' ||
              //     data.header.navigation.style === 'dropdown'
              //   ) {
              //     return true
              //   } else {
              //     return false
              //   }
              // },
            },
          },
          {
            name: 'href',
            type: 'text',
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
          {
            name: 'subLinks',
            type: 'array',
            maxRows: 6,
            fields: navLink,
            // admin: {
            //   condition: (data, siblingData) => {
            //     if (
            //       data.header.navigation.style === 'dropdown' &&
            //       !siblingData.onlyLink
            //     ) {
            //       return true
            //     } else {
            //       return false
            //     }
            //   },
            // },
          },
        ],
      },
    ],
  },
]
