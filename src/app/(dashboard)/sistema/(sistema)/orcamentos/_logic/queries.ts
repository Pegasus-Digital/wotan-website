import 'server-only'

import payload from 'payload'

import { z } from 'zod'
import { budgetsParamsSchema } from '@/lib/validations'

import { unstable_noStore as noStore } from 'next/cache'

export async function getEstimates(
  searchParams: z.infer<typeof budgetsParamsSchema>,
) {
  noStore()

  try {
    const { page, per_page, sort, } = searchParams

    const contact = searchParams.contact

    let whereOr = []

    if (contact !== undefined && contact.length > 3) {
      whereOr.push(
        {
          'contact.companyName': {
            contains: contact ? contact : '',
          },
        },
        {
          'contact.companyName': {
            contains: contact ? contact : '',
          },
        }
      )
    }
    const response = await payload.find({
      collection: 'budget',
      page,
      limit: per_page,
      where: { or: whereOr },
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

export async function getEstimateById(id: string) {
  noStore()

  try {
    const response = await payload.findByID({
      collection: 'budget',
      id: id,
    })

    return {
      data: response,
    }
  } catch (err) {
    return { data: null }
  }
}

export async function getEstimateByIncrementalId(id: string) {
  noStore()

  try {
    const response = await payload.find({
      collection: 'budget',
      where: {
        incrementalId: {
          equals: id,
        },
      },
      limit: 1,
      depth: 10,
    })

    return {
      data: response.docs[0],
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
      pagination: false,
      limit: 10000,
      sort: 'razaosocial'
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
