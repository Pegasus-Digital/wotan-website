import type { Block, Field } from 'payload/types'

import { invertBackground } from '../../fields/invertBackgroud'
import { slateEditor } from '@payloadcms/richtext-slate'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'half',
    options: [
      // {
      //   value: 'oneThird',
      //   label: 'One Third',
      // },
      {
        value: 'half',
        label: 'Half',
      },
      // {
      //   value: 'twoThirds',
      //   label: 'Two Thirds',
      // },
      {
        value: 'full',
        label: 'Full',
      },
    ],
  },
  {
    name: 'text', // required
    type: 'richText', // required
    defaultValue: [
      {
        children: [{ text: 'Here is some default content for this field' }],
      },
    ],
    required: true,
    editor: slateEditor({
      admin: {
        elements: ['h3', 'h4', 'h5', 'h6', 'link', 'textAlign'],
        leaves: ['bold', 'italic'],
      },
    }),
  },
]

export const Content: Block = {
  slug: 'content-section',
  labels: {
    singular: 'Content Section',
    plural: 'Content Sections',
  },
  fields: [
    invertBackground,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'columns',
      type: 'array',
      fields: columnFields,
    },
  ],
}
