import { Heading } from '@/pegasus/heading'
import { getPrintingTypes } from '@/lib/queries/printing-types'

import { LayoutContent } from './content'
import { getLayoutById, getOrderByIncrementalId } from '../../../_logic/queries'

export default async function SeeBudget({
  params: { layoutId, id },
  searchParams: { edit },
}) {
  const [{ data: order }, { data: layout }, printingTypes] = await Promise.all([
    getOrderByIncrementalId(id),
    getLayoutById(layoutId),
    getPrintingTypes(),
  ])

  if (!order) {
    return <Heading>Layout de produto não encontrado</Heading>
  }

  return (
    <LayoutContent
      order={order}
      edit={edit}
      layout={layout}
      printingTypes={printingTypes}
    />
  )
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
