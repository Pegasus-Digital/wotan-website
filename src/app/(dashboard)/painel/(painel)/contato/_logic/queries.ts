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

    // Fetch all messages that obey the filters and is NOT archived
    const response = await payload.find({
      collection: 'contact-messages',
      page,
      limit: per_page,
      where: {
        and: [
          { name: { contains: name ? name : '' } },
          { email: { contains: email ? email : '' } },
          { archived: { equals: false } },
        ],
      },
      sort,
    })

    return {
      data: response.docs,
      pageCount: response.totalPages,
    }
  } catch (error) {
    console.error(error)
    return { data: [], pageCount: 0 }
  }
}
