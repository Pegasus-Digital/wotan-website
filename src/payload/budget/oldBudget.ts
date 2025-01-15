import type { CollectionConfig } from 'payload/types';

const OldBudget: CollectionConfig = {
  slug: 'old-budget',
  admin: {
    useAsTitle: 'createdAt',
    defaultColumns: ['createdAt', 'salesperson', 'contact.companyName'],
    group: 'Orders',
  },
  fields: [
    {
      name: 'incrementalId',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'empresa',
      type: 'text',
      required: true,
    },
    {
      name: 'contato',
      type: 'text',
      required: true,
    },
    {
      name: 'fone',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'salesperson',
      type: 'relationship',
      relationTo: 'salespersons',
    },
    { name: 'comissioned', type: 'checkbox', defaultValue: false },
    {
      name: 'conditions',
      type: 'textarea',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'productCode',
          type: 'text',
        },
        {
          name: 'details',
          type: 'textarea',
        },
        { name: 'qtde1', type: 'number', defaultValue: 0 },
        { name: 'qtde2', type: 'number', defaultValue: 0 },
        { name: 'qtde3', type: 'number', defaultValue: 0 },
        { name: 'qtde4', type: 'number', defaultValue: 0 },
        { name: 'qtde5', type: 'number', defaultValue: 0 },
        { name: 'qtde6', type: 'number', defaultValue: 0 },
        { name: 'qtde7', type: 'number', defaultValue: 0 },
        { name: 'preco1', type: 'number', defaultValue: 0 },
        { name: 'preco2', type: 'number', defaultValue: 0 },
        { name: 'preco3', type: 'number', defaultValue: 0 },
        { name: 'preco4', type: 'number', defaultValue: 0 },
        { name: 'preco5', type: 'number', defaultValue: 0 },
        { name: 'preco6', type: 'number', defaultValue: 0 },
        { name: 'preco7', type: 'number', defaultValue: 0 },
      ],
    },
  ],
};

export { OldBudget };
