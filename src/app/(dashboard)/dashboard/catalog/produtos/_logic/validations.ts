import { z } from 'zod'

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg']

export const newProductSchema = z.object({
  /* Non-optional fields */
  title: z.string().min(3, 'Título do produto deve conter no mínimo 3 letras.'),
  active: z.boolean(),
  featuredImage: z
    .any()
    .refine((file) => !!file, 'É necessário inserir uma imagem de destaque.')
    .refine(
      (file) => (ACCEPTED_IMAGE_TYPES.includes(file.type) ? true : false),
      'Formato não suportado. Utilize imagens .jpg, .jpeg ou .png',
    ),
  minimumQuantity: z.coerce
    .number({
      required_error: 'Campo deve ser preenchido.',
      invalid_type_error: 'Campo deve conter um número.',
    })
    .min(1, 'Quantidade mínima deve ser pelo menos 1 unidade.'),
  sku: z
    .string()
    .refine(
      (value) => /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(value),
      'SKU deve ser alfanumérico e pode conter hífens, porém não no início nem no fim do código.',
    ),

  /* Optional fields */
  description: z
    .string()
    .max(300, 'Uma descrição pode ter no máximo 300 caracteres.')
    .optional(),

  /* Relationship fields */
  attributes: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
})

export const updateProductSchema = z.object({
  /* Non-optional fields */
  title: z.string().min(3, 'Título do produto deve conter no mínimo 3 letras.'),
  active: z.boolean(),
  featuredImage: z.string(),
  minimumQuantity: z.coerce
    .number({
      required_error: 'Campo deve ser preenchido.',
      invalid_type_error: 'Campo deve conter um número.',
    })
    .min(1, 'Quantidade mínima deve ser pelo menos 1 unidade.'),
  sku: z
    .string()
    .refine(
      (value) => /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(value),
      'SKU deve ser alfanumérico e pode conter hífens, porém não no início nem no fim do código.',
    ),

  /* Optional fields */
  description: z
    .string()
    .max(300, 'Uma descrição pode ter no máximo 300 caracteres.')
    .optional(),

  /* Relationship fields */
  attributes: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
})
