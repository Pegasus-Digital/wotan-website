import { z } from 'zod'

export const createCategorySchema = z.object({
  title: z.string().min(3, 'Campo deve conter no mínimo 3 caracteres.'),
  parent: z.string().optional(),
  active: z.boolean(),
})

export const updateCategorySchema = z.object({
  title: z.string().min(3, 'Campo deve conter no mínimo 3 caracteres.'),
  parent: z.string().optional(),
  slug: z.string().min(3, 'Campo deve ter no minimo 3 letras'),
  active: z.boolean(),
})

export const hexRegex = /^#[0-9A-Fa-f]{6}$/
