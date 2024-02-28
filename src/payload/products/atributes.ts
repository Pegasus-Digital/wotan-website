import { CollectionConfig } from 'payload/types'
import { ColourTextField } from '@nouance/payload-better-fields-plugin'

const Atributes: CollectionConfig = {
  slug: 'atributes',
  admin: {
    group: 'Catalogue',
    useAsTitle: 'value',
    listSearchableFields: ['title', 'value'],
    defaultColumns: ['title', 'type', 'value'],
  },
  fields: [
    {
      type: 'select',
      name: 'type',
      label: 'Type',
      options: [
        {
          label: 'Color',
          value: 'color',
        },
        {
          label: 'Text',
          value: 'text',
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Name',
    },
    {
      name: 'value',
      type: 'text',
      label: 'Value',
    },
  ],
  timestamps: false,
}

export default Atributes
