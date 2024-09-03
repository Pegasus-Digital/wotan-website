import 'server-only'

import payload from 'payload'

import { unstable_noStore as noStore } from 'next/cache'

export async function getAttributes() {
  noStore()

  try {
    const response = await payload.find({
      collection: 'attributes',
      pagination: false,
    })

    return {
      data: response.docs,
    }
  } catch (err) {
    return { data: [] }
  }
}

export async function getAttributeTypes() {
  noStore()

  try {
    const response = await payload.find({
      collection: 'attribute-types',
      pagination: false,
    })

    return {
      data: response.docs,
    }
  } catch (err) {
    return { data: [] }
  }
}
