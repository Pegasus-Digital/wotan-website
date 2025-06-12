import { EditPageContent } from './content'
import { getPageById } from '../../../_logic/queries'

export default async function EditInfoPage({ params }: { params: { id: string } }) {
  const page = await getPageById(params.id)

  return <EditPageContent pageId={params.id} initialData={page} />
} 