import type { Field } from 'payload/types'

import { adress } from './adress'

export const company: Field[] = [
  {
    type: 'group',
    name: 'company',
    interfaceName: 'Company',
    fields: [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'General',
            fields: [
              { type: 'text', name: 'name', required: true },
              {
                name: 'founded',
                type: 'date',
                admin: {
                  date: {
                    pickerAppearance: 'dayOnly',
                    displayFormat: 'd/MM/yyy',
                  },
                },
              },
              { type: 'text', name: 'cnpj', label: 'CNPJ', required: true },
            ],
          },
          {
            label: 'Adress',
            fields: [
              adress,
              {
                name: 'googleMaps',
                label: 'Google Maps',
                type: 'textarea',
                required: true,
              },
            ],
          },
          {
            name: 'contact',
            label: 'Contact',
            fields: [
              { type: 'text', name: 'email', required: true },
              { type: 'text', name: 'phone', required: true },
              { type: 'text', name: 'whatsapp', required: true },
            ],
          },
          {
            name: 'social',
            label: 'Social Media',
            fields: [
              { type: 'text', name: 'facebook' },
              { type: 'text', name: 'instagram' },
              { type: 'text', name: 'linkedin' },
              // { type: 'text', name: 'twitter' },
            ],
          },
        ],
      },
    ],
  },
]
