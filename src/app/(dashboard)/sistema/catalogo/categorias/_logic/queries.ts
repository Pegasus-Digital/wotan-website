import 'server-only'

import payload from 'payload'

import { unstable_noStore as noStore } from 'next/cache'

export async function getCategories() {
  noStore()

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
