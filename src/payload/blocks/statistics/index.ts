import { invertBackground } from '../../fields/invertBackgroud'
import type { Block } from 'payload/types'

export const StatisticSection: Block = {
  slug: 'statistic-section',
  labels: {
    singular: 'Statistic Section',
    plural: 'Statistic Sections',
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
      name: 'statistics',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'value',
          type: 'text',
        },
      ],
    },
  ],
}
