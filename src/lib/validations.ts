import { z } from 'zod'

export interface ISearchParams {
  [key: string]: string | string[] | undefined
}

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  title: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  operator: z.string().optional(),
  sku: z.string().optional(),
})

export const budgetsParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  incrementalId: z.string().default(''),
  contact: z.string().default(''),
})

export const ordersParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  client: z.string().default(''),
  incrementalId: z.coerce.number().optional(),
})

export const clientParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  document: z.string().default(''),
  salesperson: z.string().default(''),
  razaosocial: z.string().default(''),
})
