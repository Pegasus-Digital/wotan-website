import { NewOrderContent } from './content'

import { getClients, getSalespeople } from '../_logic/queries'

export default async function NewOrderPage() {
  const salespeople = await getSalespeople()
  const clients = await getClients()

  return (
    <NewOrderContent
      salespeople={salespeople.data ?? []}
      clients={clients.data ?? []}
    />
  )
}
