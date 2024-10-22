import { Heading } from '@/pegasus/heading'
import {
  getClients,
  getOrderByIncrementalId,
  getSalespeople,
} from '../_logic/queries'
import { SeeOrderContent } from './content'
// import { useSearchParams } from 'next/navigation'

export default async function SeeOrderPage({
  params: { id },
  searchParams: { edit },
}) {
  const { data } = await getOrderByIncrementalId(id)
  let salespeople = null
  let clients = null

  if (edit) {
    const { data: salespeopleData } = await getSalespeople()
    salespeople = salespeopleData
    const { data: clientsData } = await getClients()
    clients = clientsData
  }

  const order = data
  if (!order) {
    return <Heading>Pedido não encontrado</Heading>
  }

  return (
    <SeeOrderContent
      order={order}
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
      title: `Editar pedido nº: ${id}`,
    }
  }

  return {
    title: `Pedido nº: ${id}`,
  }
}
