import { z } from 'zod'

export const priceQuantityTableSchema = z
  .array(
    z.object({
      quantity: z.number().optional().nullable(),
      unitPrice: z.number().optional().nullable(),
      id: z.string().optional().nullable(),
    }),
  )
  .nullable()

export const mediaSchema = z.object({
  alt: z.string().optional().nullable(),

  url: z.string().optional().nullable(),
  filename: z.string().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  filesize: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
})

export const attributeTypeSchema = z.object({
  name: z.string(),
  type: z.union([z.literal('label'), z.literal('color')]),
})

export const attributeSchema = z.object({
  name: z.string(),
  value: z.string(),
  type: z.union([z.string(), attributeTypeSchema]),
})

export const productSchema = z.object({
  id: z.string(),
  title: z.string(),
  publishedOn: z.string().optional().nullable(),
  sku: z.string(),
  minimumQuantity: z.number(),
  stockQuantity: z.number().optional().nullable(),
  active: z.boolean(),
  featuredImage: z.union([z.string(), mediaSchema]),
  images: z
    .array(
      z.object({
        image: z.union([z.string(), mediaSchema]).optional().nullable(),
        id: z.string().optional().nullable(),
      }),
    )
    .optional()
    .nullable(),
  priceQuantityTable: priceQuantityTableSchema.optional(),
  description: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),

  attributes: z
    .array(z.union([z.string(), attributeSchema]))
    .optional()
    .nullable(),
  categories: z.array(z.string()).optional(),

  slug: z.string().optional().nullable(),
})

export const budgetSchema = z.object({
  // id: z.string(),
  incrementalId: z.number().optional().nullable(),
  salesperson: z.string(),
  comissioned: z.boolean().optional().nullable(),
  origin: z.union([z.literal('website'), z.literal('interno')]).optional(),
  status: z
    .union([
      z.literal('criado'),
      z.literal('contato'),
      z.literal('enviado'),
      z.literal('pendente'),
      z.literal('aprovado'),
      z.literal('cancelado'),
    ])
    .optional(),
  conditions: z.string().optional().nullable(),
  items: z.array(
    z.object({
      product: z.union([z.string(), productSchema]),
      attributes: z.array(z.string()).optional(),

      description: z.string().optional().nullable(),
      quantity: z.number(),
      price: z.string().optional().nullable(),
      id: z.string().optional().nullable(),
    }),
  ),
  contact: z.object({
    companyName: z.string().optional().nullable(),
    customerName: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    details: z.string().optional().nullable(),
  }),
})
