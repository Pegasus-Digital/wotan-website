import { unstable_noStore as noStore } from 'next/cache'
import payload from 'payload'
import 'server-only'
import { z } from 'zod'
import { searchParamsSchema } from './validations'

export async function getContactMessages(
  searchParams: z.infer<typeof searchParamsSchema>,
) {
  noStore()
  try {
    const { page, per_page } = searchParams

    const response = await payload.find({
      collection: 'contact-messages',
      page,
      limit: per_page,
    })

    return {
      data: response.docs,
      pageCount: response.totalPages,
    }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}
