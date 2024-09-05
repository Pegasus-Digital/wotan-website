import { CollectionConfig } from 'payload/types'
import { isAdmin, isLoggedIn, isSelf } from '../access'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { admins } from '../access/admins'

const Users: CollectionConfig = {
  slug: 'users',
  access: {
    // read: isAdmin || isLoggedIn || isSelf,
    create: isAdmin,
    update: isAdmin || isSelf,
    delete: isAdmin,
  },
  admin: {
    group: 'Settings',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['user'],
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'user',
          value: 'user',
        },
      ],
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      access: {
        create: admins,
        update: admins,
      },
    },
    // {
    //   name: 'email',
    //   type: 'email',
    // },
  ],
  timestamps: true,
}

export { Users }
