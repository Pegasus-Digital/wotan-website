import { Field, GlobalConfig } from 'payload/types'
import { admins, anyone } from '../access'
import { header } from './header'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'General',
  admin: {
    group: 'Settings',
  },
  access: {
    read: anyone,
    update: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        { name: 'general', fields: [{ name: 'title', type: 'text' }] },
        {
          name: 'header',
          label: 'Header',
          fields: header,
        },
        // {
        //   name: 'footer',
        //   label: 'Footer',
        //   fields: [{ name: 'copyright', type: 'text' }],
        // },
      ],
    },
  ],
}
