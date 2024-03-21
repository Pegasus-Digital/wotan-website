import type { Field } from 'payload/types'

import deepMerge from '../utilities/deepMerge'
import { formatSlug, formatSlugProduct } from '../utilities/formatSlug'

type Slug = (fieldToUse?: string, overrides?: Partial<Field>) => Field
type ProductSlug = (overrides?: Partial<Field>) => Field

export const slugField: Slug = (fieldToUse = 'title', overrides = {}) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug(fieldToUse)],
      },
    },
    overrides,
  )

export const productSlugField: ProductSlug = (overrides?: Partial<Field>) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlugProduct()],
      },
    },
    overrides,
  )
