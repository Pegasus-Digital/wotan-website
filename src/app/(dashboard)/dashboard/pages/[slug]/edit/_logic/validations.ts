import { z } from 'zod'

export const linkSchema = z.object({
  type: z.union([z.literal('reference'), z.literal('custom')]).optional(),
  newTab: z.boolean(),
  reference: z
    .union([
      z
        .object({
          relationTo: z.literal('pages'),
          value: z.string(),
        })
        .nullable(),
      z
        .object({
          relationTo: z.literal('products'),
          value: z.string(),
        })
        .nullable(),
      z
        .object({
          relationTo: z.literal('categories'),
          value: z.string(),
        })
        .nullable(),
    ])
    .optional(),
  url: z.string().optional().nullable(),
  label: z.string(),
})

export const featuredSectionSchema = z.object({
  invertBackground: z.boolean().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  cards: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      image: z.string(),
      linkTo: z.union([
        z.object({
          relationTo: z.literal('categories'),
          value: z.string(),
        }),
        z.object({
          relationTo: z.literal('products'),
          value: z.string(),
        }),
      ]),
      id: z.string().optional().nullable(),
    }),
  ),
  id: z.string().optional().nullable(),
  blockName: z.string().optional().nullable(),
  blockType: z.literal('featured-section'),
})

export const statisticSectionSchema = z.object({
  invertBackground: z.boolean().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  statistics: z.array(
    z.object({
      title: z.string(),
      value: z.string(),
      id: z.string().optional().nullable(),
    }),
  ),
  id: z.string().optional().nullable(),
  blockName: z.string().optional().nullable(),
  blockType: z.literal('statistic-section'),
})

export const contentSectionSchema = z.object({
  invertBackground: z.boolean().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  columns: z.array(
    z.object({
      size: z.union([z.literal('half'), z.literal('full')]),
      text: z.array(z.record(z.unknown())),
      id: z.string().optional().nullable(),
    }),
  ),
  id: z.string().optional().nullable(),
  blockName: z.string().optional().nullable(),
  blockType: z.literal('content-section'),
})

export const clientGridSchema = z.object({
  invertBackground: z.boolean().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  clients: z.array(
    z.object({
      logo: z.string(),
      id: z.string().optional().nullable(),
    }),
  ),
  id: z.string().optional().nullable(),
  blockName: z.string().optional().nullable(),
  blockType: z.literal('client-grid'),
})

export const contentMediaSchema = z.object({
  invertBackground: z.boolean().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  mediaPosition: z.union([z.literal('left'), z.literal('right')]),
  richText: z.array(z.record(z.unknown())),
  media: z.string(),
  id: z.string().optional().nullable(),
  blockName: z.string().optional().nullable(),
  blockType: z.literal('content-media'),
})

export const faqSchema = z.object({
  invertBackground: z.boolean().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  questions: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      id: z.string().optional().nullable(),
    }),
  ),
  id: z.string().optional().nullable(),
  blockName: z.string().optional().nullable(),
  blockType: z.literal('faq-section'),
})

export const threeColumnsSchema = z.object({
  invertBackground: z.boolean().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  mission: z.object({
    title: z.string(),
    description: z.string(),
  }),
  vision: z.object({
    title: z.string(),
    description: z.string(),
  }),
  values: z.object({
    title: z.string(),
    description: z.string(),
  }),
  id: z.string().optional().nullable(),
  blockName: z.string().optional().nullable(),
  blockType: z.literal('three-columns'),
})

export const timelineSectionSchema = z.object({
  invertBackground: z.boolean().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  cards: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.string().optional().nullable(),
      id: z.string().optional().nullable(),
    }),
  ),
  id: z.string().optional().nullable(),
  blockName: z.string().optional().nullable(),
  blockType: z.literal('timeline-section'),
})

export const productCarouselSchema = z.object({
  invertBackground: z.boolean().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  populateBy: z.union([z.literal('categories'), z.literal('selection')]),
  categories: z.array(z.string()).optional().nullable(),
  selectedDocs: z
    .array(
      z.object({
        relationTo: z.literal('products'),
        value: z.string(),
      }),
    )
    .optional()
    .nullable(),
  populatedDocs: z
    .array(
      z.object({
        relationTo: z.literal('products'),
        value: z.string(),
      }),
    )
    .optional()
    .nullable(),
  seeMore: z.boolean(),
  seeMoreLink: linkSchema,
  id: z.string().optional().nullable(),
  blockName: z.string().optional().nullable(),
  blockType: z.literal('product-carousel'),
})

export const pageSchema = z.object({
  // id: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  publishedOn: z.string().optional().nullable(),
  carousel: z
    .array(
      z.object({
        image: z.string(),
        id: z.string().optional().nullable(),
      }),
    )
    .optional()
    .nullable(),
  layout: z.array(
    statisticSectionSchema
      .or(contentSectionSchema)
      .or(clientGridSchema)
      .or(contentMediaSchema)
      .or(faqSchema)
      .or(threeColumnsSchema)
      .or(timelineSectionSchema)
      .or(productCarouselSchema),
  ),
  slug: z.string().optional().nullable(),
  // updatedAt: z.string(),
  // createdAt: z.string(),
  _status: z.union([z.literal('draft'), z.literal('published')]).optional(),
})
