import type { GlobalConfig } from 'payload/types'

import { admins } from '../access/admins'
import { anyone } from '../access/anyone'
import { adress } from '../fields/adress'

export const Company: GlobalConfig = {
  slug: 'company',
  access: {
    read: anyone,
    update: admins,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { type: 'text', name: 'name' },
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
            { type: 'text', name: 'cnpj', label: 'CNPJ' },
          ],
        },
        {
          label: 'Adress',
          fields: [
            adress,
            { name: 'googleMaps', label: 'Google Maps', type: 'textarea' },
          ],
        },
        {
          name: 'contact',
          label: 'Contact',
          fields: [
            { type: 'text', name: 'email' },
            { type: 'text', name: 'phone' },
            { type: 'text', name: 'whatsapp' },
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
}
