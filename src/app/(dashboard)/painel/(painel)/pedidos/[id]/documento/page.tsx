import { Heading } from '@/pegasus/heading'
import { OrderDocumentContent } from './content'

import { getOrderByIncrementalId } from '../../_logic/queries'

export default async function OrderDocumentPage({ params: { id } }) {
  const { data } = await getOrderByIncrementalId(id)

  if (!data) {
    return <Heading>Recurso não encontrado.</Heading>
  }

  return <OrderDocumentContent order={data} />
}

export async function generateMetadata({ params: { id } }) {
  return {
    title: `Visualizar pedido nº: ${id}`,
  }
}
