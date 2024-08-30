import { Heading } from '@/pegasus/heading'
import { SeeClientContent } from './content'
import { getSalespeople } from '../../orcamentos/_logic/queries'
import { getClientByDocument } from '../_logic/queries'
// import { useSearchParams } from 'next/navigation'

export default async function SeeBudget({
  params: { document },
  searchParams: { edit },
}) {
  const { data } = await getClientByDocument(document)
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

  const budget = data

  if (!budget) {
    return <Heading>Cliente não encontrado</Heading>
  }

  return (
    // <div>
    <SeeClientContent client={data} edit={edit} salespeople={salespeople} />
    // </div>
  )
}
