import 'server-only'

import payload from 'payload'

import { z } from 'zod'
import { searchParamsSchema } from '@/lib/validations'

import { unstable_noStore as noStore } from 'next/cache'

export async function getProductBySKU(sku: string) {
  noStore()

  try {
    const response = await payload.find({
      collection: 'products',
      where: {
        sku: { equals: sku },
      },
    })

    if (response.totalDocs === 0) {
      return { data: null }
    }

    return {
      data: response.docs[0],
    }
  } catch (err) {
    return { data: null }
  }
}

export async function getProducts(
  searchParams: z.infer<typeof searchParamsSchema>,
) {
  noStore()

  try {
    const { page, per_page, title, sort } = searchParams

    const response = await payload.find({
      collection: 'products',
      page,
      limit: per_page,
      where: {
        and: [{ title: { contains: title ? title : '' } }, { _status:{ equals:'published'}}],
      },
      sort,
    })

    return {
      data: response.docs,
      pageCount: response.totalPages,
    }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}

export async function getAttributes() {
  try {
    const response = await payload.find({
      collection: 'attributes',
      pagination: false,
    })

    return {
      data: response.docs,
    }
  } catch (err) {
    return { data: [] }
  }
}

export async function getCategories() {
  try {
    const response = await payload.find({
      collection: 'categories',
      pagination: false,
      sort: 'title',
    })

    return {
      data: response.docs,
    }
  } catch (err) {
    return { data: [] }
  }
}
