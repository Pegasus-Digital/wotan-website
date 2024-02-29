import React from 'react'
import { notFound } from 'next/navigation'

import { Product as ProductType } from '../../../../payload/payload-types'
import { fetchDoc } from '../../../_api/fetchDoc'
import { fetchDocs } from '../../../_api/fetchDocs'

export default async function Product({ params: { slug } }) {
  let product: ProductType | null = null

  try {
    product = await fetchDoc<ProductType>({
      collection: 'products',
      slug,
    })
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (!product) {
    notFound()
  }

  // const {  relatedProducts } = product

  return (
    <React.Fragment>
      {/* Fazer componentes */}
      {/* <ProductHero product={product} /> */}
      {/* <RelatedProducts products={relatedProducts} /> */}
    </React.Fragment>
  )
}

export async function generateStaticParams() {
  try {
    const products = await fetchDocs<ProductType>('products')
    return products?.map(({ slug }) => slug)
  } catch (error) {
    return []
  }
}
