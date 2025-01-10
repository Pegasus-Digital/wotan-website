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
            { name: 'stateIncription', type: 'text' }
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              type: 'array',
              name: 'contacts',
              // required: true,
              fields: [
                { type: 'text', name: 'name' },
                { type: 'email', name: 'email' },
                { type: 'text', name: 'phone' },
                { type: 'text', name: 'whatsapp' },
              ],
            },
          ],
        },
        {
          label: 'Adress',
          fields: [adress],
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
    { name: 'observations', type: 'textarea' },
    { name: 'ramo', type: 'text' },
    // adress,
    {
      name: 'salesperson',
      type: 'relationship',
      relationTo: 'salespersons',
      required: true,
    },
    {
      name: 'origin',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Anuncio',
          value: 'ads',
        },
        {
          label: 'Indicação',
          value: 'indication',
        },
        {
          label: 'Lista FIERGS',
          value: 'fiergs-list',
        },
        {
          label: 'Lista Telefonica',
          value: 'telephone-list',
        },

        {
          label: 'Mala Direta',
          value: 'direct',
        },
        {
          label: 'Prospecção',
          value: 'prospect',
        },
        {
          label: 'Site',
          value: 'website',
        },
        {
          label: 'Outro',
          value: 'other',
        },
        { label: 'Migração', value: 'migration' }
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active', // Correct: This should be a string

      // required: true,
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

export { Clients }
