import { z } from 'zod'

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
