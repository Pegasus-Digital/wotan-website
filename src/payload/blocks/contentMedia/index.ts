import type { Block } from 'payload/types'

import { invertBackground } from '../../fields/invertBackgroud'
import { slateEditor } from '@payloadcms/richtext-slate'

export const ContentMedia: Block = {
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'text',
    },
    invertBackground,
    {
      name: 'mediaPosition',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
      type: 'radio',
    },
    {
      name: 'richText', // required
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
    {
      name: 'media',
      relationTo: 'media',
      required: true,
      type: 'upload',
    },
  ],
  slug: 'content-media',
}
