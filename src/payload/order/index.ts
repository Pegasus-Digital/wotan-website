import { CollectionConfig } from 'payload/types'
import { adress } from '../fields/adress'
import {
  assignIncrementalId,
  createLayouts,
} from '../utilities/genIncrementalId'

const Order: CollectionConfig = {
  slug: 'order',
  admin: {
    useAsTitle: 'client',
    defaultColumns: ['client', 'contact', 'salesperson'],
    group: 'Orders',
  },
  hooks: {
    beforeChange: [assignIncrementalId, createLayouts],
  },
  fields: [
    {
      name: 'incrementalId',
      type: 'number',
      // required: true,
      admin: {
        // readOnly: true,
      },
    },
    {
      name: 'client',
      label: 'Client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
    },
    {
      name: 'contact',
      label: 'Contact',
      type: 'text',
      required: true,
    },

    {
      type: 'group',
      name: 'alternativeContact',
      // required: true,
      fields: [
        { type: 'text', name: 'name' },
        { type: 'email', name: 'email' },
        { type: 'text', name: 'phone' },
        { type: 'text', name: 'whatsapp' },
      ],
    },

    adress,
    {
      name: 'salesperson',
      type: 'relationship',
      relationTo: 'salespersons',
      // required: true,
    },
    {
      name: 'itens', // Produto section
      label: 'Products',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'layout',
          type: 'relationship',
          relationTo: 'layouts',
        },
        {
          name: 'quantity', // Quantidade field
          label: 'Quantity',
          type: 'number',
        },
        {
          name: 'price', // Preco field
          label: 'Price',
          type: 'number',
          required: true,
        },
        {
          name: 'attributes',
          type: 'relationship',
          relationTo: 'attributes',
          hasMany: true,
        },
        {
          name: 'print', // Impressao field
          label: 'Print Details',
          type: 'text',
        },
        {
          name: 'sample', // Amostra field
          label: 'Sample Provided',
          type: 'checkbox',
        },
        {
          name: 'layoutSent',
          type: 'checkbox',
        },
        {
          name: 'layoutApproved',
          type: 'checkbox',
        },
      ],
    },
    {
      name: 'shippingTime',
      type: 'text',
    },
    {
      name: 'shippingCompany',
      type: 'text',
    },
    {
      name: 'shippingType',
      type: 'select',
      options: [
        {
          label: 'CIF',
          value: 'cif',
        },
        {
          label: 'FOB',
          value: 'fob',
        },
      ],
    },
    { name: 'paymentConditions', type: 'text' },
    {
      name: 'paymentType',
      type: 'select',
      options: [
        { label: 'Boleto', value: 'boleto' },
        { label: 'PIX', value: 'pix' },
        { label: 'Depósito', value: 'deposito' },
      ],
    },
    { name: 'agency', type: 'text' },
    { name: 'commission', type: 'number' },
    { name: 'notes', type: 'textarea' },

    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        {
          label: 'Pendente',
          value: 'pending',
        },
        {
          label: 'Completo',
          value: 'completed',
        },
        {
          label: 'Cancelado',
          value: 'cancelled',
        },
      ],
      defaultValue: 'pending',
    },
  ],
}

export { Order }
