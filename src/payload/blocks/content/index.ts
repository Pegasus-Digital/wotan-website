import type { Block, Field } from 'payload/types'

import { invertBackground } from '../../fields/invertBackgroud'
import { slateEditor } from '@payloadcms/richtext-slate'
import { titleAndDesc } from '../../fields/titleAndDesc'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'half',
    required: true,
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
  interfaceName: 'ContentSection',
  labels: {
    singular: 'Content Section',
    plural: 'Content Sections',
  },
  fields: [
    invertBackground,
    ...titleAndDesc,
    {
      name: 'columns',
      type: 'array',
      fields: columnFields,
      required: true,
    },
  ],
}
