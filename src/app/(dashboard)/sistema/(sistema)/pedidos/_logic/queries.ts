import 'server-only'

import payload from 'payload'

import { z } from 'zod'
import { ordersParamsSchema, searchParamsSchema } from '@/lib/validations'

import { unstable_noStore as noStore } from 'next/cache'


export async function getOrders(
  searchParams: z.infer<typeof ordersParamsSchema>,
) {
  noStore()

  try {
    const { page, per_page, sort, client, incrementalId } = searchParams

    let whereOr = []

    if (client !== undefined && client.length >= 3) {
      whereOr.push(
        {
          'client.razaosocial': {
            contains: client ? client : '',
          },
        },
        {
          'client.razaosocial': {
            contains: client ? client : '',
          },
        }
      )
    }

    if (incrementalId !== undefined) {
      whereOr.push({
        incrementalId: {
          equals: incrementalId, // Exact match
        },
      });

      let factor = 10;
      let currentId = incrementalId;

      // Dynamically generate ranges as long as incrementalId * factor is within a reasonable range
      while (currentId * factor <= 999999) { // Adjust upper limit if needed
        const lowerBound = currentId * factor;
        const upperBound = lowerBound + 9;

        whereOr.push({
          and: [
            {
              incrementalId: {
                greater_than_equal: lowerBound,
              },
            },
            {
              incrementalId: {
                less_than_equal: upperBound,
              },
            },
          ],
        });

        factor *= 10; // Move to the next order of magnitude
      }
    }
    // console.log('whereOr', whereOr)

    const response = await payload.find({
      collection: 'order',
      page,
      limit: per_page,
      where: {
        or: whereOr,
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
