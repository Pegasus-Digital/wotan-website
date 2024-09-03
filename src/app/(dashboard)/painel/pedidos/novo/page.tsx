import { Heading } from '@/pegasus/heading'
import {
  getClients,
  getOrderByIncrementalId,
  getSalespeople,
} from '../_logic/queries'
import { SeeOrderContent } from './content'
// import { useSearchParams } from 'next/navigation'

export default async function SeeBudget() {
  // const salespeople = await getSalespeople()
  // const clients = await getClients()

  // const edit = params.has('edit')

  const { data: salespeopleData } = await getSalespeople()

  // Fetch clients data
  const { data: clientsData } = await getClients()

  // console.log('salespeople', salespeople)

  return (
    <div>
      <SeeOrderContent salespeople={salespeopleData} clients={clientsData} />
    </div>
  )
}
