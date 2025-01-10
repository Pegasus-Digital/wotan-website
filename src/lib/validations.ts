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
})

export const clientParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  document: z.string().default(''),
  salesperson: z.string().default(''),
  razaosocial: z.string().default(''),
})
