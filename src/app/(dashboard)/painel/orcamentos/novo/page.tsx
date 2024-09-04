import { NewBudgetContent } from './content'

import { getClients, getSalespeople } from '../_logic/queries'

export default async function NewBudget() {
  const salespeople = await getSalespeople()
  const clients = await getClients()

  return (
    <NewBudgetContent salespeople={salespeople.data} clients={clients.data} />
  )
}
