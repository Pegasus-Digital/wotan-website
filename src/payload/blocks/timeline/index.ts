import { invertBackground } from '../../fields/invertBackgroud'
import type { Block } from 'payload/types'
import { titleAndDesc } from '../../fields/titleAndDesc'

export const Timeline: Block = {
  slug: 'timeline-section',
  interfaceName: 'TimelineSection',
  fields: [
    invertBackground,
    ...titleAndDesc,
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      maxRows: 10,
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'date',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'd/MM/yyy',
            },
          },
        },
      ],
    },
  ],
}
