import { invertBackground } from '../../fields/invertBackgroud'
import type { Block } from 'payload/types'
import { titleAndDesc } from '../../fields/titleAndDesc'

export const StatisticSection: Block = {
  slug: 'statistic-section',
  interfaceName: 'StatisticSection',
  labels: {
    singular: 'Statistic Section',
    plural: 'Statistic Sections',
  },
  fields: [
    invertBackground,
    ...titleAndDesc,
    {
      name: 'statistics',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
