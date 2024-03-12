import { CollectionConfig } from 'payload/types'
import { adress } from '../fields/adress'

const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    group: 'Clients',
    useAsTitle: 'name',
    defaultColumns: ['name', 'razaosocial'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Data',
          fields: [
            {
              name: 'razaosocial',
              type: 'text',
            },
            {
              type: 'radio',
              name: 'type',
              required: true,
              defaultValue: 'company',
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
              name: 'document',
              type: 'text',
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              type: 'array',
              name: 'contacts',
              required: true,
              fields: [
                { type: 'text', name: 'name' },
                { type: 'text', name: 'email' },
                { type: 'text', name: 'phone' },
                { type: 'text', name: 'whatsapp' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'clientSince',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd/MM/yyy',
        },
      },
    },
    {
      name: 'salesperson',
      type: 'relationship',
      relationTo: 'salespersons',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      defaultValue: ['active'],
      required: true,
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
          label: 'Prospect',
          value: 'prospect',
        },
      ],
    },
  ],
}

export default Clients
