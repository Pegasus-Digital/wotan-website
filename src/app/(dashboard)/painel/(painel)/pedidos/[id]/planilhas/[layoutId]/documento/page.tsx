import { Heading } from '@/pegasus/heading'
import { getOrderByIncrementalId } from '../../../../_logic/queries'
import { LayoutDocumentContent } from './content'

export default async function OrderDocumentPage({ params: { id, layoutId } }) {
  const { data } = await getOrderByIncrementalId(id)

  if (!data) {
    return <Heading>Recurso não encontrado.</Heading>
  }

  return <LayoutDocumentContent order={data} layoutId={layoutId} />
}
