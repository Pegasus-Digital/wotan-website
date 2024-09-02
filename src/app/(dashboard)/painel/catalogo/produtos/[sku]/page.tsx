import { ProductContent } from './content'
import { Heading } from '@/pegasus/heading'

import { getProductBySKU } from '../_logic/queries'

export default async function ProductPage({
  params: { sku },
  searchParams: { edit },
}) {
  const { data: product } = await getProductBySKU(sku)

  if (!product) {
    return <Heading>Produto não encontrado</Heading>
  }

  return <ProductContent product={product} edit={edit} />
}
