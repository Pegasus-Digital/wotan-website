import 'server-only'

import payload from "payload"
import { unstable_noStore as noStore } from 'next/cache'



export async function getCategories() {
  noStore()

  const categories = await payload.find({
    collection: 'categories',
  })
  return categories
}

export async function getProducts() {
  noStore()

  const products = await payload.find({
    collection: 'products',
  })
  return products
}