import { query } from 'express'
import type { Config } from '../../payload/payload-types'
import { PAGES } from '../_graphql/pages'

const querys = {
  pages: {
    query: PAGES,
    key: 'Pages',
  },
  // products: {
  //   query: PRODUCT,
  //   key: 'Products',
  // },
}

export const fetchDocs = async <T>(
  collection: keyof Config['collections'],
): Promise<T[]> => {
  if (!querys[collection]) throw new Error(`Collection ${collection} not found`)

  const docs: T[] = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: { tags: [collection] },
      body: JSON.stringify({
        query: querys[collection].query,
      }),
    },
  )
    ?.then((res) => res.json())
    ?.then((res) => {
      if (res.errors)
        throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      return res?.data?.[querys[collection].key]?.docs
    })

  return docs
}
