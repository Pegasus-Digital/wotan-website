import 'server-only'

import payload from 'payload'

import { z } from 'zod'
import { searchParamsSchema } from '@/lib/validations'

import { unstable_noStore as noStore } from 'next/cache'

export async function getUsers(
  searchParams: z.infer<typeof searchParamsSchema>,
) {
  noStore()

  try {
    const { page, per_page, title, sort } = searchParams

    const response = await payload.find({
      collection: 'users',
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

export async function getUserById(id: string) {
  noStore()

  try {
    const response = await payload.findByID({
      collection: 'users',
      id: id,
    })

    return {
      data: response,
    }
  } catch (err) {
    return { data: null }
  }
}
