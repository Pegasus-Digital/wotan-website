import 'server-only'

import payload from 'payload'

import { z } from 'zod'

import { unstable_noStore as noStore } from 'next/cache'

export async function getPageById(id: string) {
  noStore()

  try {
    const response = await payload.findByID({
      collection: 'pages',
      id,
    })

    return response
  } catch (error) {
    console.error('Error fetching page by ID:', error)
    return null
  }
}

export async function getPages() {
  noStore()

  const response = await payload.find({
    collection: 'pages',
  })

  return response
}