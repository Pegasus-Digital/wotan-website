import { Heading } from '@/pegasus/heading'
import { getEstimateById } from '../_logic/queries'
import { SeeBudgetContent } from './content'

export default async function SeeBudget({ params: { id } }) {
  const { data } = await getEstimateById(id)

  const budget = data

  if (!budget) {
    return <Heading>Budget não encontrado</Heading>
  }

  return (
    <div>
      <SeeBudgetContent budget={budget} edit />
    </div>
  )
}
