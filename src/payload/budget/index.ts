import type { CollectionConfig } from 'payload/types'
import { assignIncrementalId } from '../utilities/genIncrementalId'
import { onBudgetFromWebsite } from '../hooks/onBudgetFromWebsite'
// import { clearUserCart } from './hooks/clearUserCart'
// import { populateOrderedBy } from './hooks/populateOrderedBy'
// import { updateUserPurchases } from './hooks/updateUserPurchases'

const Budget: CollectionConfig = {
  slug: 'budget',
  admin: {
    useAsTitle: 'createdAt',
    defaultColumns: ['createdAt'],
    group: 'Orders',
    // preview: (doc) =>
    //   `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/budget/${doc.id}`,
  },
  hooks: {
    beforeChange: [assignIncrementalId],
    afterChange: [onBudgetFromWebsite],
  },
  // access: {
  //   read: adminsOrOrderedBy,
  //   update: admins,
  //   create: adminsOrLoggedIn,
  //   delete: admins,
  // },
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
      name: 'salesperson',
      type: 'relationship',
      relationTo: 'salespersons',
      // required: true,
    },
    { name: 'comissioned', type: 'checkbox', defaultValue: false },
    {
      name: 'origin',
      type: 'select',
      options: [
        { label: 'Site', value: 'website' },
        { label: 'Interno', value: 'interno' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Criado', value: 'criado' },
        { label: 'Em contato', value: 'contato' },
        { label: 'Enviado p/ Cliente', value: 'enviado' },
        { label: 'Aguardando aprovação ', value: 'pendente' },
        { label: 'Aprovado', value: 'aprovado' },
        { label: 'Cancelado', value: 'cancelado' },
      ],
    },
    {
      name: 'conditions',
      type: 'textarea',
      defaultValue:
        'Pagamento: 28 dias\nEntrega: 12 dias\nFrete:\nValidade da proposta: 10 dias\nPRODUTOS SUJEITOS Á DISPONIBILIDADE DE ESTOQUE',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
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
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'quantity',
          type: 'number',
          min: 1,
          required: true,
        },
        {
          name: 'price',
          type: 'number',
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'companyName', type: 'text', required: true },
        { name: 'customerName', type: 'text', required: true },
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        { name: 'details', type: 'textarea' },
      ],
    },
    {
      name: 'client',
      label: 'Client',
      type: 'relationship',
      relationTo: 'clients',
      // required: true,
    },
    {
      name: 'selectedContact',
      label: 'Contact',
      type: 'text',
      // required: true,
    },
  ],
}

export { Budget }
