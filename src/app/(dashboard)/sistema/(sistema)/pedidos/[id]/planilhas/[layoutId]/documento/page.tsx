import { Heading } from '@/pegasus/heading'
import { LayoutDocumentContent } from './content'
import { getOrderByIncrementalId } from '../../../../_logic/queries'

export default async function OrderDocumentPage({ params: { id, layoutId } }) {
  const { data } = await getOrderByIncrementalId(id)

  if (!data) {
    return <Heading>Recurso não encontrado.</Heading>
  }

  return <LayoutDocumentContent order={data} layoutId={layoutId} />
}

export async function generateMetadata({ params: { id } }) {
  return {
    title: `Visualizar planilha nº: ${id}`,
  }
}
