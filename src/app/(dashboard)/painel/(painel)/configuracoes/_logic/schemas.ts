import { z } from 'zod'

export const mediaSchema = z.object({
  id: z.string(),
  alt: z.string().optional().nullable(),
  updatedAt: z.string(),
  createdAt: z.string(),
  url: z.string().optional().nullable(),
  filename: z.string().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  filesize: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
})

export const linkSchema = z.object({
  type: z.union([z.literal('reference'), z.literal('custom')]),
  newTab: z.boolean(),
  reference: z
    .union([
      z
        .object({
          relationTo: z.literal('pages'),
          value: z.union([z.string(), z.object({})]),
        })
        .nullable(),
      z
        .object({
          relationTo: z.literal('products'),
          value: z.union([z.string(), z.object({})]),
        })
        .nullable(),
      z
        .object({
          relationTo: z.literal('categories'),
          value: z.union([z.string(), z.object({})]),
        })
        .nullable(),
    ])
    .optional(),
  url: z.string().optional().nullable(),
  label: z.string(),
})

export const footerSchema = z.object({
  // logo: z.union([z.string(), mediaSchema]),
  companyInfo: z.object({
    showAddress: z.boolean(),
    showPhone: z.boolean(),
    showEmail: z.boolean(),
    showSocial: z.boolean(),
  }),
  columns: z.array(
    z.object({
      title: z.string(),
      links: z.array(
        z.object({
          link: linkSchema,
          id: z.string().optional().nullable(),
        }),
      ),
      id: z.string().optional().nullable(),
    }),
  ),
})
export const navigationSchema = z.object({
  style: z.literal('classic'),
  links: z.array(
    z.object({
      linkTo: linkSchema,
      onlyLink: z.boolean(),
      // columns: z.null().optional(),
      // subLinks: z
      //   .array(
      //     z.object({
      //       link: linkSchema,
      //       id: z.string().optional().nullable(),
      //     }),
      //   )
      //   .optional()
      //   .nullable(),
      id: z.string().optional().nullable(),
    }),
  ),
})
export const headerSchema = z.object({
  // logo: z.union([z.string(), mediaSchema]),
  navigation: navigationSchema,
})
