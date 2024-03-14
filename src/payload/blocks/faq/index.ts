import { invertBackground } from '../../fields/invertBackgroud'
import { titleAndDesc } from '../../fields/titleAndDesc'
import { Block } from 'payload/types'

export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQ',
  fields: [
    invertBackground,
    ...titleAndDesc,
    {
      name: 'questions',
      type: 'array',
      minRows: 1,
      maxRows: 10,
      required: true,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
