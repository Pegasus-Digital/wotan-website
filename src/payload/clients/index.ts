import { CollectionConfig } from 'payload/types'
import { adress } from '../fields/adress'

const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    group: 'Clients',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
  },
  fields: [
    {
      type: 'tabs',

      tabs: [
        {
          name: 'contact',
          label: 'Contact',
          fields: [
            {
              name: 'name',
              type: 'text',
            },
            {
              type: 'select',
              name: 'type',
              options: [
                {
                  label: 'Pessoa Júridica',
                  value: 'company',
                },
                {
                  label: 'Pessoa Física',
                  value: 'individual',
                },
              ],
            },
            {
              name: 'phone',
              type: 'text',
            },
          ],
        },
        { name: 'address', label: 'Address', fields: [adress] },
      ],
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
        {
          label: 'Prospective',
          value: 'prospective',
        },
      ],
    },
  ],
  auth: true,
}

export default Clients
