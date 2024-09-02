import { Heading } from '@/pegasus/heading'
import { getEstimateById } from '../../_logic/queries'
import { BudgetDocumentContent } from './content'

export default async function BudgetDocumentPage({ params: { id } }) {
  const { data } = await getEstimateById(id)

  if (!data) {
    return <Heading>Recurso não encontrado.</Heading>
  }

  return <BudgetDocumentContent budget={data} />
}
