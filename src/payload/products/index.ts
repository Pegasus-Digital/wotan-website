import type { CollectionConfig } from 'payload/types'

import { slugField } from '../fields/slug'
import { revalidateProduct } from './hooks/revalidateProduct'
import { anyone, admins } from '../access'
// import { populateArchiveBlock } from '../hooks/populateArchiveBlock'
// import { beforeProductChange } from './hooks/beforeChange'
// import { deleteProductFromCarts } from './hooks/deleteProductFromCarts'

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status'],
    // preview: (doc) => {
    //   return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/preview?url=${encodeURIComponent(
    //     `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/products/${doc.slug}`,
    //   )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
    // },
    group: 'Catalogue',
  },
  hooks: {
    //   beforeChange: [beforeProductChange],
    // afterChange: [revalidateProduct],
    //   afterRead: [populateArchiveBlock],
    //   afterDelete: [deleteProductFromCarts],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: anyone,
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },

    {
      type: 'tabs',
      tabs: [
        {
          label: 'Product Details',
          fields: [
            { name: 'sku', label: 'SKU', type: 'text' },
            {
              name: 'minimumQuantity',
              label: 'Minimum Quantity',
              type: 'number',
              defaultValue: 50,
              required: true,
            },
            {
              name: 'stockQuantity',
              label: 'Stock Quantity',
              type: 'number',
            },
            { type: 'checkbox', name: 'active', required: true },

            {
              name: 'attributes',
              type: 'relationship',
              relationTo: 'attributes',
              hasMany: true,
              // filterOptions: ({}) => {
              //   return { type: { equals: 'text' } }
              // },
            },
            { name: 'price', type: 'number' },
            { name: 'description', type: 'textarea' },
          ],
        },
        {
          label: 'Images',
          fields: [
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'images',
              type: 'array',
              maxRows: 6,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  filterOptions: {
                    mimeType: { contains: 'image' },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
    },
    slugField(),
  ],
}

export default Products
