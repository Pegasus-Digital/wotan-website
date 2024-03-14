import { Metadata } from 'next'
import { CategoriesContent } from './content'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Categorias',
}

export default async function Categories() {
  return <CategoriesContent />
}
