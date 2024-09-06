import { Heading } from '@/pegasus/heading'
import {
  getClients,
  getOrderByIncrementalId,
  getSalespeople,
} from '../_logic/queries'
import { SeeOrderContent } from './content'
// import { useSearchParams } from 'next/navigation'

export default async function SeeBudget({
  params: { id },
  searchParams: { edit },
}) {
  const { data } = await getOrderByIncrementalId(id)

  // const salespeople = await getSalespeople()
  // const clients = await getClients()

  // const edit = params.has('edit')

  let salespeople = null
  let clients = null
  if (edit) {
    // Fetch salespeople data
    // console.log('Fetching salespeople data...')

    const { data: salespeopleData } = await getSalespeople()
    salespeople = salespeopleData // Assign data to the outer variable

    // Fetch clients data
    const { data: clientsData } = await getClients()
    clients = clientsData // Assign data to the outer variable

    // console.log('salespeople', salespeople)
    // console.log('clients', clients)
  }

  const order = data
  if (!order) {
    return <Heading>Pedido não encontrado</Heading>
  }

  return (
    <div>
      <SeeOrderContent
        order={order}
        edit={edit}
        salespeople={salespeople}
        clients={clients}
      />
    </div>
  )
}
