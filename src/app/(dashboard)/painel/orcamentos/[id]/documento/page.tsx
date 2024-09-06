import { getEstimateByIncrementalId } from '../../_logic/queries'

import { Heading } from '@/pegasus/heading'

import { BudgetDocumentContent } from './content'

export default async function BudgetDocumentPage({ params: { id } }) {
  const { data } = await getEstimateByIncrementalId(id)

  if (!data) {
    return <Heading>Recurso não encontrado.</Heading>
  }

  return <BudgetDocumentContent budget={data} />
}

export async function generateMetadata({ params: { id } }) {
  return {
    title: `Visualizar documento nº: ${id}`,
  }
}
