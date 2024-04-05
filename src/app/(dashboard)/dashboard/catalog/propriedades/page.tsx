import { Metadata } from 'next'

import {
  getAttributes,
  getAttributeTypes,
  getCategories,
} from './_logic/queries'

import { PropertiesContent } from './content'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Categorias',
}

export default async function Properties() {
  const categories = await getCategories()
  const attributes = await getAttributes()
  const attributeTypes = await getAttributeTypes()

  return (
    <PropertiesContent
      categories={categories.data}
      attributes={attributes.data}
      types={attributeTypes.data}
    />
  )
}
