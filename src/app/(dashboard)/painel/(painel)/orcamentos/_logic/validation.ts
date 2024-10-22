import { z } from 'zod'

export const priceQuantityTableSchema = z
  .array(
    z.object({
      quantity: z.coerce.number().optional().nullable(),
      unitPrice: z.coerce.number().optional().nullable(),
      id: z.string().optional().nullable(),
    }),
  )
  .nullable()

export const mediaSchema = z.object({
  alt: z.string().optional().nullable(),

  url: z.string().optional().nullable(),
  filename: z.string().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  filesize: z.coerce.number().optional().nullable(),
  width: z.coerce.number().optional().nullable(),
  height: z.coerce.number().optional().nullable(),
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
  minimumQuantity: z.coerce.number(),
  stockQuantity: z.coerce.number().optional().nullable(),
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
  incrementalId: z.coerce.number().optional().nullable(),
  salesperson: z.string({
    required_error: 'Escolha um vendedor para o orçamento.',
  }),
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
      id: z.string().optional().nullable(),
      product: z.union([z.string(), productSchema]),
      attributes: z.array(z.string()).optional(),
      print: z.string().optional(),

      description: z.string().optional().nullable(),
      quantity: z.coerce
        .number({ required_error: 'Digite uma quantidade.' })
        .positive({ message: 'A quantidade deve ser maior que zero.' })
        .min(1, { message: 'A quantidade não pode ser zero.' }),
      price: z.coerce
        .number({ required_error: 'Digite um preço.' })
        .positive({ message: 'O preço deve ser maior que zero.' })
        .min(1, { message: 'A preço não pode ser zero.' }),
    }),
  ),
  contact: z.object({
    companyName: z.string({ required_error: 'Digite o nome da empresa.' }),
    customerName: z.string({ required_error: 'Digite o nome do cliente.' }),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    details: z.string().optional().nullable(),
  }),
})
