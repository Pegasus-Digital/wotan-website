import { Heading } from '@/pegasus/heading'
import { getPrintingTypes } from '@/lib/queries/printing-types'

import { LayoutDocumentContent } from './content'
import { getOrderByIncrementalId } from '../../../../_logic/queries'

export default async function OrderDocumentPage({ params: { id, layoutId } }) {
  const [{ data }, printingTypes] = await Promise.all([
    getOrderByIncrementalId(id),
    getPrintingTypes(),
  ])

  if (!data) {
    return <Heading>Recurso não encontrado.</Heading>
  }

  return (
    <LayoutDocumentContent
      order={data}
      layoutId={layoutId}
      printingTypes={printingTypes}
    />
  )
}

export async function generateMetadata({ params: { id } }) {
  return {
    title: `Visualizar planilha nº: ${id}`,
  }
}
