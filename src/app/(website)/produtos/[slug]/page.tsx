import payload from 'payload'
import { Metadata } from 'next'

import { ProductPageContent } from './content'

export default async function ProductPage({ params }) {
  const productId: string = params.slug

  const product = await payload.findByID({
    collection: 'products',
    id: productId,
    disableErrors: true,
  })

  return <ProductPageContent product={product} />
}

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productId: string = params.slug

  const product = await payload.findByID({
    collection: 'products',
    id: productId,
    disableErrors: true,
  })

  return { title: `${product.title}` }
}
