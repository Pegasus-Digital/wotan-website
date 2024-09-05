import path from 'path'
import type { CollectionConfig } from 'payload/types'
import { anyone, isAdmin } from '../access'

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
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
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
