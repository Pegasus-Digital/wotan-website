import payload from 'payload'
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
