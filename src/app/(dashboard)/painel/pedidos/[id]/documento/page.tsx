import { Heading } from '@/pegasus/heading'
import { getOrderByIncrementalId } from '../../_logic/queries'
import { OrderDocumentContent } from './content'

export default async function BudgetDocumentPage({ params: { id } }) {
  const { data } = await getOrderByIncrementalId(id)

  if (!data) {
    return <Heading>Recurso não encontrado.</Heading>
  }

  return <OrderDocumentContent order={data} />
}
