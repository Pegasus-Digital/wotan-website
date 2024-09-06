import { CollectionConfig } from 'payload/types'
import { anyone, isAdmin, isLoggedIn, isSelf } from '../access'
import { admins } from '../access/admins'
// import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'

const Salespersons: CollectionConfig = {
  slug: 'salespersons',
  access: {
    // read: isAdmin || isLoggedIn || isSelf,
    create: isAdmin,
    update: isAdmin || isSelf,
    delete: isAdmin,
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
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'roles',
      type: 'select',
      required: true,
      // hasMany: true,
      defaultValue: ['representative'],
      options: [
        { label: 'Vendedor Interno', value: 'internal' },
        { label: 'Representante', value: 'representative' },
      ],
      // hooks: {
      //   beforeChange: [ensureFirstUserIsAdmin],
      // },
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

export { Salespersons }
