import { Heading } from '@/pegasus/heading'
import { getClients, getEstimateById, getSalespeople } from '../_logic/queries'
import { NewBudgetContent } from './content'

export default async function NewBudget() {
  const { data: salespeopleData } = await getSalespeople()

  // Fetch clients data
  const { data: clientsData } = await getClients()

  return (
    <NewBudgetContent salespeople={salespeopleData} clients={clientsData} />
  )
}
