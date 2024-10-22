import { Heading } from '@/pegasus/heading'
import { SeeClientContent } from './content'
import { getSalespeople } from '../../orcamentos/_logic/queries'
import { getClientByDocument, getClientById } from '../_logic/queries'
// import { useSearchParams } from 'next/navigation'

export default async function SeeBudget({
  params: { id },
  searchParams: { edit },
}) {
  // const { data } = await getClientByDocument(document)

  const { data } = await getClientById(id)

  // console.log('data', data)
  // const salespeople = await getSalespeople()
  // const clients = await getClients()

  // const edit = params.has('edit')

  let salespeople = null
  if (edit) {
    // Fetch salespeople data
    // console.log('Fetching salespeople data...')

    const { data: salespeopleData } = await getSalespeople()
    salespeople = salespeopleData // Assign data to the outer variable
  }

  if (!data) {
    return <Heading>Cliente não encontrado</Heading>
  }

  return (
    // <div>
    <SeeClientContent client={data} edit={edit} salespeople={salespeople} />
    // </div>
  )
}
