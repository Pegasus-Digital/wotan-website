// collections/Layout.js
import { CollectionConfig } from 'payload/types'

const Layout: CollectionConfig = {
  slug: 'layouts',
  labels: {
    singular: 'Layout',
    plural: 'Layouts',
  },
  admin: {
    useAsTitle: 'quote', // or another field to represent the layout
  },
  fields: [
    {
      name: 'printing',
      type: 'group',
      fields: [
        { name: 'type', type: 'text', required: false },
        { name: 'colors', type: 'text', required: false },
        { name: 'supplyer', type: 'text', required: false },
        { name: 'quantity', type: 'text', required: false },
        { name: 'price', type: 'text', required: false },
      ],
    },
    {
      name: 'printing2',
      type: 'group',
      fields: [
        { name: 'type', type: 'text' },
        { name: 'colors', type: 'text', required: false },
        { name: 'supplyer', type: 'text', required: false },
        { name: 'quantity', type: 'text', required: false },
        { name: 'price', type: 'text', required: false },
      ],
    },
    {
      name: 'supplyer',
      type: 'array',
      fields: [
        { name: 'material', type: 'text', required: false },
        { name: 'quantidade_material', type: 'text', required: false },
        { name: 'fornecedor_material', type: 'text', required: false },
        { name: 'custo_material', type: 'text', required: false },
      ],
    },
    {
      name: 'additionalCosts',
      type: 'group',
      fields: [
        { name: 'obs', type: 'text', required: false },
        { name: 'cost', type: 'text', required: false },
      ],
    },
    {
      name: 'additionalCosts2',
      type: 'group',
      fields: [
        { name: 'obs', type: 'text', required: false },
        { name: 'cost', type: 'text', required: false },
      ],
    },
    {
      name: 'delivery',
      type: 'group',
      fields: [
        { name: 'company', type: 'text', required: false },
        { name: 'cost', type: 'text', required: false },
      ],
    },
    {
      name: 'delivery2',
      type: 'group',
      fields: [
        { name: 'company', type: 'text', required: false },
        { name: 'cost', type: 'text', required: false },
      ],
    },
    {
      name: 'commisions',
      type: 'group',
      fields: [
        {
          name: 'agency',
          type: 'group',
          fields: [
            { name: 'name', type: 'text', required: false },
            { name: 'value', type: 'text', required: false },
          ],
        },
        {
          name: 'salesperson',
          type: 'group',
          fields: [
            { name: 'name', type: 'text', required: false },
            { name: 'value', type: 'text', required: false },
          ],
        },
      ],
    },
    {
      name: 'layout',
      type: 'group',
      fields: [
        { name: 'sent', type: 'checkbox', required: false },
        { name: 'approved', type: 'checkbox', required: false },
        { name: 'sameAsPrevious', type: 'checkbox', required: false },
        { name: 'reSent', type: 'checkbox', required: false },
        { name: 'fotolitus', type: 'checkbox', required: false },
        { name: 'obs', type: 'text', required: false },
      ],
    },
    {
      name: 'sample',
      type: 'group',
      fields: [
        { name: 'with', type: 'checkbox', required: false },
        { name: 'approved', type: 'checkbox', required: false },
        { name: 'new', type: 'checkbox', required: false },
      ],
    },
    {
      name: 'prazoentrega',
      type: 'text',
      required: false,
    },
    {
      name: 'transp',
      type: 'text',
      required: false,
    },
    {
      name: 'shipmentType',
      type: 'select',
      options: [
        { label: 'CIF', value: 'cif' },
        { label: 'FOB', value: 'fob' },
      ],
      required: false,
    },
    {
      name: 'shipmentCost',
      type: 'text',
      required: false,
    },
    {
      name: 'quote',
      type: 'text',
      required: false,
    },
    {
      name: 'volumeNumber',
      type: 'text',
      required: false,
    },
    {
      name: 'shipmentDate',
      type: 'text',
      required: false,
    },
    {
      name: 'paymentType',
      type: 'select',
      options: [
        { label: 'Boleto', value: 'boleto' },
        { label: 'Pix', value: 'pix' },
        { label: 'Deposito', value: 'deposito' },
      ],
      required: false,
    },
    {
      name: 'invoice',
      type: 'group',
      fields: [
        { name: 'number', type: 'text', required: false },
        { name: 'due', type: 'text', required: false },
        { name: 'value', type: 'text', required: false },
      ],
    },
    {
      name: 'invoice2',
      type: 'group',
      fields: [
        { name: 'number', type: 'text', required: false },
        { name: 'due', type: 'text', required: false },
        { name: 'value', type: 'text', required: false },
      ],
    },
    {
      name: 'invoice3',
      type: 'group',
      fields: [
        { name: 'number', type: 'text', required: false },
        { name: 'due', type: 'text', required: false },
        { name: 'value', type: 'text', required: false },
      ],
    },
    {
      name: 'ncm',
      type: 'text',
      required: false,
    },
    {
      name: 'obs_final',
      type: 'text',
      required: false,
    },
  ],
}

export default Layout
