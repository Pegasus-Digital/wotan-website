import { CollectionConfig } from 'payload/types'
import { adminsOrLoggedIn, admins, adminsOrSelf } from '../access'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'

const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: adminsOrLoggedIn,
    create: admins,
    update: adminsOrSelf,
    delete: admins,
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
        read: admins,
        create: admins,
        update: admins,
      },
    },
    {
      name: 'email',
      type: 'email',
    },
  ],
  timestamps: true,
}

export default Users
