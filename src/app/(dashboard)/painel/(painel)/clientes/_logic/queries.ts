import 'server-only'

import payload from 'payload'

import { z } from 'zod'
import { searchParamsSchema } from '@/lib/validations'

import { unstable_noStore as noStore } from 'next/cache'

export async function getClients(
  searchParams: z.infer<typeof searchParamsSchema>,
) {
  noStore()

  try {
    const { page, per_page, title, sort } = searchParams

    const response = await payload.find({
      collection: 'clients',
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

export async function getClientByDocument(document: string) {
  noStore()

  try {
    const response = await payload.find({
      collection: 'clients',
      where: {
        document: { equals: document },
      },
      limit: 1,
    })
    // console.log(response)
    return { data: response.docs[0] }
  } catch (err) {
    return { data: null }
  }
}
export async function getClientById(document: string) {
  noStore()

  try {
    const response = await payload.findByID({
      collection: 'clients',
      id: document,
    })
    // console.log(response)
    return { data: response }
  } catch (err) {
    return { data: null }
  }
}
