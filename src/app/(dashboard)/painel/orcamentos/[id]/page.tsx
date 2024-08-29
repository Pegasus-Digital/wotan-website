import { Heading } from '@/pegasus/heading'
import { getClients, getEstimateById, getSalespeople } from '../_logic/queries'
import { SeeBudgetContent } from './content'
// import { useSearchParams } from 'next/navigation'

export default async function SeeBudget({
  params: { id },
  searchParams: { edit },
}) {
  const { data } = await getEstimateById(id)

  // const salespeople = await getSalespeople()
  // const clients = await getClients()

  // const edit = params.has('edit')

  let salespeople = null
  let clients = null
  if (edit) {
    // console.log('edit')
    salespeople = await getSalespeople()
    clients = await getClients()
    console.log({ salespeople, clients })
  }

  const budget = data

  if (!budget) {
    return <Heading>Budget não encontrado</Heading>
  }

  return (
    <div>
      <SeeBudgetContent
        budget={budget}
        edit={edit}
        salespeople={salespeople.data}
        clients={clients.data}
      />
    </div>
  )
}
