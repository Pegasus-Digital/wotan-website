import 'server-only'

import { unstable_noStore as noStore } from 'next/cache'

import payload from 'payload'

import { z } from 'zod'

import { searchParamsSchema } from '@/lib/validations'

export async function getContactMessages(
  searchParams: z.infer<typeof searchParamsSchema>,
  name: string,
  email: string,
) {
  noStore()

  try {
    const { page, per_page, sort } = searchParams

    const response = await payload.find({
      collection: 'contact-messages',
      page,
      limit: per_page,
      where: {
        and: [
          { name: { contains: name ? name : '' } },
          { email: { contains: email ? email : '' } },
        ],
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
