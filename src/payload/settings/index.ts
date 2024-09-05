import { GlobalConfig } from 'payload/types'
import { anyone, isAdmin } from '../access'
import { header } from '../fields/header'
import { footer } from '../fields/footer'
import { company } from '../fields/company'

const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'General',
  admin: {
    group: 'Settings',
  },
  access: {
    read: anyone,
    update: isAdmin,
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

export { Settings }
