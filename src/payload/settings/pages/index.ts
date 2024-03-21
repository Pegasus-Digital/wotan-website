import { CollectionConfig } from 'payload/types'

// Access
import { admins, adminsOrPublished } from '../../access'

// Blocks
import { ClientGrid } from '../../blocks/clientGrid'
import { Content } from '../../blocks/content'
import { ContentMedia } from '../../blocks/contentMedia'
import { FeaturedSection } from '../../blocks/featuredSection'
import { ProductCarousel } from '../../blocks/productCarousel'
import { StatisticSection } from '../../blocks/statistics'
import { FAQ } from '../../blocks/faq'
import { ThreeColumns } from '../../blocks/threeColumns'
import { Timeline } from '../../blocks/timeline'

// Fields
import { hero } from '../../fields/hero'
import { slugField } from '../../fields/slug'

// Hooks
import { revalidatePage } from './hooks/revalidatePage'
import { populateArchiveBlock } from '../../hooks/populateArchiveBlock'

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
      name: 'description',
      type: 'text',
      admin: {
        condition: (data) => {
          // console.log('desc:')
          // console.log({ data })
          return data.slug !== 'home'
        },
      },
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
        condition: (data, siblingData) => {
          // console.log({ data, siblingData })
          return data.slug === 'home'
        },
      },
    },

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
        FAQ,
        ThreeColumns,
        Timeline,
      ],
    },

    slugField(),
  ],
}
