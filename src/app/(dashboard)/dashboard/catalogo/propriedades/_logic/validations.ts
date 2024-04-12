import { z } from 'zod'

export const createAttributeSchema = z.object({
  name: z.string().min(3, 'Campo deve conter no mínimo 3 caracteres.'),
  value: z.string().min(1, 'Campo deve conter no mínimo 1 caracter.'),
  attributeTypeId: z.string({
    required_error: 'Escolha um tipo.',
  }),
})

export const createCategorySchema = z.object({
  title: z.string().min(3, 'Campo deve conter no mínimo 3 caracteres.'),
  parent: z.string().optional(),
  active: z.boolean(),
})

export const updateAttributeSchema = z.object({
  name: z.string().min(3, 'Campo deve conter no mínimo 3 caracteres.'),
  value: z.string().min(1, 'Campo deve conter no mínimo 1 caracter.'),
  attributeTypeId: z.string({
    required_error: 'Escolha um tipo.',
  }),
})

export const updateCategorySchema = z.object({
  title: z.string().min(3, 'Campo deve conter no mínimo 3 caracteres.'),
  parent: z.string().optional(),
  slug: z.string().min(3, 'Campo deve ter no minimo 3 letras'),
  active: z.boolean(),
})

export const hexRegex = /^#[0-9A-Fa-f]{6}$/
