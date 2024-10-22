import { z } from 'zod'

export const createAttributeSchema = z.object({
  name: z.string().min(3, 'Campo deve conter no mínimo 3 caracteres.'),
  value: z.string().min(1, 'Campo deve conter no mínimo 1 caracter.'),
  attributeTypeId: z.string({
    required_error: 'Escolha um tipo.',
  }),
})

export const updateAttributeSchema = z.object({
  name: z.string().min(3, 'Campo deve conter no mínimo 3 caracteres.'),
  value: z.string().min(1, 'Campo deve conter no mínimo 1 caracter.'),
  attributeTypeId: z.string({
    required_error: 'Escolha um tipo.',
  }),
})

export const hexRegex = /^#[0-9A-Fa-f]{6}$/
