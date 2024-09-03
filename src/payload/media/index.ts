import path from 'path'
import type { CollectionConfig } from 'payload/types'
import { admins, anyone } from '../access'

const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Files',
  },
  upload: {
    staticDir: path.resolve(__dirname, '../../../media'),
    mimeTypes: ['image/*', 'application/pdf'],
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

export { Media }
