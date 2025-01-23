import { Heading } from '@/pegasus/heading'

import {
  getClients,
  getSalespeople,
  getEstimateByIncrementalId,
} from '../_logic/queries'

import { SeeBudgetContent } from './content'

export default async function SeeBudget({
  params: { id },
  searchParams: { edit },
}) {
  const { data } = await getEstimateByIncrementalId(id)
  let salespeople = null
  let clients = null

  if (edit) {
    // Fetch salespeople data
    const { data: salespeopleData } = await getSalespeople()
    salespeople = salespeopleData

    // Fetch clients data
    const { data: clientsData } = await getClients()
    clients = clientsData
  }

  const budget = data

  if (!budget) {
    return <Heading>Budget não encontrado</Heading>
  }

  return (
    <SeeBudgetContent
      budget={budget}
      edit={edit}
      salespeople={salespeople}
      clients={clients}
    />
  )
}

export async function generateMetadata({
  params: { id },
  searchParams: { edit },
}) {
  if (edit) {
    return {
      title: `Editar orçamento nº: ${id}`,
    }
  }

  return {
    title: `Orçamento nº: ${id}`,
  }
}
