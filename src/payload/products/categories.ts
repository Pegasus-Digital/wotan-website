import type { CollectionConfig } from 'payload/types'
import { slugField } from '../fields/slug'

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    group: 'Catalogue',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    slugField(),
  ],
}

export default Categories
