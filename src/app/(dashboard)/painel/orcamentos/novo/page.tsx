import { NewBudgetContent } from './content'

import { getClients, getSalespeople } from '../_logic/queries'

export default async function NewBudget() {
  const { data: salespeopleData } = await getSalespeople()

  // Fetch clients data
  const { data: clientsData } = await getClients()

  return (
    <NewBudgetContent salespeople={salespeopleData} clients={clientsData} />
  )
}
