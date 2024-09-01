import { CollectionConfig } from 'payload/types'
import { adress } from '../fields/adress'
import { assignIncrementalId } from '../utilities/genIncrementalId'

const Order: CollectionConfig = {
  slug: 'order',
  admin: {
    useAsTitle: 'client',
    defaultColumns: ['client', 'contact', 'salesperson'],
    group: 'Orders',
  },
  hooks: {
    beforeChange: [assignIncrementalId],
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
      name: 'client', // This is the equivalent of the *Cliente field in the form
      label: 'Client',
      type: 'relationship',
      relationTo: 'clients', // Assuming you have a clients collection
      required: true,
    },
    {
      name: 'contact', // Now just a string field for the selected contact
      label: 'Contact',
      type: 'text',
      required: true,
    },
    {
      name: 'salesperson',
      type: 'relationship',
      relationTo: 'salespersons',
      // required: true,
    },
    {
      name: 'products', // Produto section
      label: 'Products',
      type: 'array',
      fields: [
        {
          name: 'code', // Codigo field
          label: 'Code',
          type: 'text',
          required: true,
        },
        {
          name: 'description', // Produto field
          label: 'Product Description',
          type: 'text',
          required: true,
        },
        {
          name: 'quantity', // Quantidade field
          label: 'Quantity',
          type: 'number',
          required: true,
          validate: (value) => {
            if (value <= 0) {
              return 'Quantity must be a positive number'
            }
          },
        },
        {
          name: 'price', // Preco field
          label: 'Price',
          type: 'number',
          required: true,
        },
        {
          name: 'print', // Impressao field
          label: 'Print Details',
          type: 'text',
        },
        {
          name: 'sample', // Amostra field
          label: 'Sample Provided',
          type: 'text',
        },
      ],
    },
    {
      name: 'status', // Status of the order (might be active, pending, etc.)
      label: 'Status',
      type: 'select',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      defaultValue: 'pending',
    },
  ],
}

export default Order
