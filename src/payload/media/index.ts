import path from 'path'
import type { CollectionConfig } from 'payload/types'
import { admins, anyone } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: path.resolve(__dirname, '../../media'),
  },
  access: {
    read: anyone,
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    // {
    //   name: 'caption',
    //   type: 'richText',
    //   editor: slateEditor({
    //     admin: {
    //       elements: ['link'],
    //     },
    //   }),
    // },
  ],
}
