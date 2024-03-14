import type { CollectionConfig } from 'payload/types'

// import { clearUserCart } from './hooks/clearUserCart'
// import { populateOrderedBy } from './hooks/populateOrderedBy'
// import { updateUserPurchases } from './hooks/updateUserPurchases'

export const Budget: CollectionConfig = {
  slug: 'budget',
  admin: {
    useAsTitle: 'createdAt',
    defaultColumns: ['createdAt'],
    group: 'Orders',
    // preview: (doc) =>
    //   `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/budget/${doc.id}`,
  },
  // hooks: {
  //   afterChange: [updateUserPurchases, clearUserCart],
  // },
  // access: {
  //   read: adminsOrOrderedBy,
  //   update: admins,
  //   create: adminsOrLoggedIn,
  //   delete: admins,
  // },
  fields: [
    // {
    //   name: 'orderedBy',
    //   type: 'relationship',
    //   relationTo: 'clients',
    //   // hooks: {
    //   //   beforeChange: [populateOrderedBy],
    //   // },
    // },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
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
          name: 'quantity',
          type: 'number',
          min: 1,
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
        },
      ],
    },
  ],
}
