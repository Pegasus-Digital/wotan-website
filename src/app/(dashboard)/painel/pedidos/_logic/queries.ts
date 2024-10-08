import 'server-only'

import payload from 'payload'

import { z } from 'zod'
import { searchParamsSchema } from '@/lib/validations'

import { unstable_noStore as noStore } from 'next/cache'

export async function getOrders(
  searchParams: z.infer<typeof searchParamsSchema>,
) {
  noStore()

  try {
    const { page, per_page, sort } = searchParams

    const response = await payload.find({
      collection: 'order',
      page,
      limit: per_page,
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

export async function getOrderByIncrementalId(id: string) {
  noStore()

  try {
    const response = await payload.find({
      collection: 'order',
      where: {
        incrementalId: {
          equals: id,
        },
      },
      limit: 1,
      depth: 10,
    })

    // console.log('response', response)

    return {
      data: response.docs[0],
    }
  } catch (err) {
    return { data: null }
  }
}

export async function getLayoutById(id: string) {
  noStore()

  try {
    const response = await payload.findByID({
      collection: 'layouts',
      id: id,
    })

    // console.log('response', response)

    return {
      data: response,
    }
  } catch (err) {
    return { data: null }
  }
}

export async function getClients() {
  noStore()

  try {
    const response = await payload.find({
      collection: 'clients',
    })

    return {
      data: response.docs,
    }
  } catch (err) {
    return { data: [] }
  }
}

export async function getSalespeople() {
  noStore()

  try {
    const response = await payload.find({
      collection: 'salespersons',
    })

    return {
      data: response.docs,
    }
  } catch (err) {
    return { data: [] }
  }
}

export async function getProducts({ sku }: { sku: string }) {
  noStore()

  try {
    const response = await payload.find({
      collection: 'products',
      where: {
        sku: {
          equals: sku,
        },
      },
      limit: 3,
    })

    return {
      data: response.docs,
    }
  } catch (err) {
    return { data: [] }
  }
}
