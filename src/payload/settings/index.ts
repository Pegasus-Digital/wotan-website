import { Field, GlobalConfig } from 'payload/types'
import { admins, anyone } from '../access'
import { header } from '../fields/header'
import { footer } from '../fields/footer'
import { company } from '../fields/company'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'General',
  admin: {
    group: 'Settings',
  },
  access: {
    read: anyone,
    update: admins,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'general',
          label: 'General',
          fields: [
            { name: 'allowDarkMode', type: 'checkbox' },
            { name: 'showWhatsAppButton', type: 'checkbox' },
            { name: 'biggerQuantity', type: 'checkbox' },
          ],
        },
        {
          label: 'Header',
          fields: header,
        },
        {
          label: 'Footer',
          fields: footer,
        },
        {
          label: 'Company',
          fields: company,
        },
      ],
    },
  ],
}
