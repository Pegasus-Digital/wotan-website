import { CollectionConfig } from 'payload/types'

const AttributeTypes: CollectionConfig = {
  slug: 'attribute-types',
  admin: {
    group: 'Catalogue',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Label',
          value: 'label',
        },
        {
          label: 'Color',
          value: 'color',
        },
      ],
    },
  ],
  timestamps: false,
}

const Attributes: CollectionConfig = {
  slug: 'attributes',
  admin: {
    group: 'Catalogue',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'value',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'relationship',
      relationTo: 'attribute-types',
      required: true,
    },
  ],
}

export { AttributeTypes, Attributes }
