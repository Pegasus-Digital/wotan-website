import payload from 'payload'
import { Metadata } from 'next'

import { ProductPageContent } from './content'
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }) {
  const productSlug: string = params.slug

  const product = await payload
    .find({
      collection: 'products',
      where: {
        slug: {
          equals: productSlug,
        },
      },
      limit: 1,
      pagination: false,
    })
    .then((result) => {
      return result.docs.length >= 1 ? result.docs[0] : null
    })

  if (!product) {
    notFound()
  }

  return <ProductPageContent product={product} />
}

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productSlug: string = params.slug

  const product = await payload
    .find({
      collection: 'products',
      where: {
        slug: {
          equals: productSlug,
        },
      },
      limit: 1,
      pagination: false,
    })
    .then((result) => {
      return result.docs.length >= 1 ? result.docs[0] : null
    })

  if (!product) {
    return null
  }

  return { title: `${product.title}` }
}
