import { Heading } from '@/pegasus/heading'
import { LayoutContent } from './content'
import { getLayoutById, getOrderByIncrementalId } from '../../../_logic/queries'

// import { useSearchParams } from 'next/navigation'

export default async function SeeBudget({
  params: { layoutId, id },
  searchParams: { edit },
}) {
  const { data: order } = await getOrderByIncrementalId(id)
  const { data: layout } = await getLayoutById(layoutId)

  if (!order) {
    return <Heading>Layout de produto não encontrado</Heading>
  }

  return (
    // <div>
    <LayoutContent order={order} edit={edit} layout={layout} />
    // </div>
  )
}
