import { CollectionConfig } from 'payload/types';
import { adress } from '../fields/adress';

const OldOrder: CollectionConfig = {
  slug: 'old-order',
  admin: {
    useAsTitle: 'client',
    defaultColumns: ['client', 'contato', 'salesperson'],
    group: 'Orders',
  },

  fields: [
    {
      name: 'incrementalId',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'idcliente',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
    },
    {
      name: 'client',
      label: 'Client',
      type: 'relationship',
      relationTo: 'clients',
      // required: true,
    },
    {
      name: 'idcontato',
      type: 'number',
      required: true,
    },
    {
      name: 'salesperson',
      type: 'relationship',
      relationTo: 'salespersons',
      // required: true,
    },

    {
      name: 'contato',
      type: 'text',
      required: true,
    },
    {
      name: 'foneContato',
      type: 'text',
    },
    {
      name: 'emailContato',
      type: 'email',
    },
    {
      name: 'frete',
      type: 'number',
    },
    {
      name: 'transp',
      type: 'text',
    },
    {
      name: 'prazo',
      type: 'text',
    },
    {
      name: 'cond',
      type: 'text',
    },
    {
      name: 'tipopagamento',
      type: 'number',
    },
    {
      name: 'comissao',
      type: 'text',
    },
    {
      name: 'porcentagem',
      type: 'number',
    },
    {
      name: 'obs',
      type: 'textarea',
    },
    adress,
    {
      name: 'idcidade',
      type: 'number',
      required: true,
    },
    {
      name: 'rua',
      type: 'text',
      required: true,
    },
    {
      name: 'numero',
      type: 'text',
      required: true,
    },
    {
      name: 'bairro',
      type: 'text',
      required: true,
    },
    {
      name: 'cep',
      type: 'text',
      required: true,
    },
    {
      name: 'quando',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'ordem',
      type: 'text',
    },
    {
      name: 'serasa',
      type: 'text',
    },
    {
      name: 'pos',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'itens',
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
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'price',
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
          name: 'print',
          type: 'text',
        },
        {
          name: 'sample',
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
    {
      name: 'paymentConditions',
      type: 'text',
    },
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
};

export { OldOrder };
