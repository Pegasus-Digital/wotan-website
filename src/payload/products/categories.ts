import type { CollectionConfig } from 'payload/types'
import { slugField } from '../fields/slug'
import { anyone } from '../access'

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    group: 'Catalogue',
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
  ],
}

export default Categories
