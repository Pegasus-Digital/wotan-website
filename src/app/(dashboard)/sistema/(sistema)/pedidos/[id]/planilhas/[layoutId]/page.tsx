import { Heading } from '@/pegasus/heading'
import { LayoutContent } from './content'
import { getLayoutById, getOrderByIncrementalId } from '../../../_logic/queries'

export default async function SeeBudget({
  params: { layoutId, id },
  searchParams: { edit },
}) {
  const { data: order } = await getOrderByIncrementalId(id)
  const { data: layout } = await getLayoutById(layoutId)

  if (!order) {
    return <Heading>Layout de produto não encontrado</Heading>
  }

  return <LayoutContent order={order} edit={edit} layout={layout} />
}

export async function generateMetadata({
  params: { id },
  searchParams: { edit },
}) {
  if (edit) {
    return {
      title: `Editar planilha nº: ${id}`,
    }
  }

  return {
    title: `Planilha nº: ${id}`,
  }
}
