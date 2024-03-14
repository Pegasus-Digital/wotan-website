import { CollectionConfig } from 'payload/types'
import { adminsOrLoggedIn, admins, adminsOrSelf } from '../access'
// import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'

const Salespersons: CollectionConfig = {
  slug: 'salespersons',
  access: {
    read: adminsOrLoggedIn,
    create: admins,
    update: adminsOrSelf,
    delete: admins,
  },
  admin: {
    group: 'Vendors',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      required: true,
      defaultValue: ['representative'],
      options: [
        { label: 'internal', value: 'internal' },
        { label: 'representative', value: 'representative' },
      ],
      // hooks: {
      //   beforeChange: [ensureFirstUserIsAdmin],
      // },
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

export default Salespersons
