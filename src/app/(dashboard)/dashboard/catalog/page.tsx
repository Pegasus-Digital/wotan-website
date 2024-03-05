import { Metadata } from 'next'
import { CatalogContent } from './content'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Catálogo',
}

export default async function Catalog() {
  return <CatalogContent />
}
