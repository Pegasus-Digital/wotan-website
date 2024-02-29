import { CollectionConfig } from 'payload/types'
import { admins, adminsOrPublished } from '../../access'
import { slugField } from '../../fields/slug'
import { revalidatePage } from './hooks/revalidatePage'
import { ProductCarousel } from '../../blocks/productCarousel'
import { populateArchiveBlock } from '../../hooks/populateArchiveBlock'
import { FeaturedSection } from '../../blocks/featuredSection'
import { StatisticSection } from '../../blocks/statistics'
import { Content } from '../../blocks/content'
import { ClientGrid } from '../../blocks/clientGrid'
import { ContentMedia } from '../../blocks/contentMedia'
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    // preview: (doc) => {
    //   return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/preview?url=${encodeURIComponent(
    //     `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/${doc.slug !== 'home' ? doc.slug : ''}`,
    //   )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
    // },
    group: 'Settings',
  },
  hooks: {
    afterChange: [revalidatePage],
    afterRead: [populateArchiveBlock],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: adminsOrPublished,
    update: admins,
    create: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'carousel',
              type: 'array',
              required: true,
              minRows: 1,
              maxRows: 3,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
              admin: {
                description:
                  'Image should be 1920x420 with the content centered around 1280x420',
              },
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              required: true,
              blocks: [
                ProductCarousel,
                FeaturedSection,
                StatisticSection,
                Content,
                ClientGrid,
                ContentMedia,
              ],
            },
          ],
        },
      ],
    },
    slugField(),
  ],
}
