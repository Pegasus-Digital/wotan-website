import { Field, GlobalConfig } from 'payload/types'
import { admins, anyone } from '../access'
import { header } from './header'
import { footer } from './footer'

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
        { name: 'general', fields: [{ name: 'darkMode', type: 'checkbox' }] },
        {
          name: 'header',
          label: 'Header',
          fields: header,
        },
        {
          name: 'footer',
          label: 'Footer',
          fields: footer,
        },
      ],
    },
  ],
}
