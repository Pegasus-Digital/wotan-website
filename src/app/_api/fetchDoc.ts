import { query } from 'express'
import type { Config } from '../../payload/payload-types'
import { PAGE } from '../_graphql/pages'

const querys = {
  pages: {
    query: PAGE,
    key: 'Pages',
  },
  // products: {
  //   query: PRODUCT,
  //   key: 'Products',
  // },
}

export const fetchDoc = async <T>(args: {
  collection: keyof Config['collections']
  slug?: string
  id?: string
}): Promise<T> => {
  const { collection, slug } = args || {}

  if (!querys[collection]) throw new Error(`Collection ${collection} not found`)

  const doc: T = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // cache: 'no-store',
      next: { tags: [`${collection}_${slug}`] },
      body: JSON.stringify({
        query: querys[collection].query,
        variables: { slug },
      }),
    },
  )
    ?.then((res) => res.json())
    ?.then((res) => {
      if (res.errors)
        throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      return res?.data?.[querys[collection].key]?.docs?.[0]
    })

  return doc
}
