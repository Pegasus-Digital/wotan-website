import 'server-only'

import payload from 'payload'

import { z } from 'zod'
import { searchParamsSchema } from '@/lib/validations'

import { unstable_noStore as noStore } from 'next/cache'

export async function getOldOrders(
  searchParams: z.infer<typeof searchParamsSchema>,
) {
  noStore()

  try {
    const { page, per_page, sort } = searchParams

    const response = await payload.find({
      collection: 'old-order',
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