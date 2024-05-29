import { Metadata } from 'next'

import { getCategories } from './_logic/queries'

import { CategoriesContent } from './content'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Categorias',
}

export default async function Properties() {
  const categories = await getCategories()

  return <CategoriesContent categories={categories.data} />
}
