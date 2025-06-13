import { EditLayoutContent } from './content'
import { getPayloadClient } from '@/lib/get-payload'

interface EditLayoutPageProps {
  params: {
    id: string
  }
}

export default async function EditLayoutPage({ params }: EditLayoutPageProps) {
  const payload = await getPayloadClient()
  const page = await payload.findByID({
    collection: 'pages',
    id: params.id,
  })

  return <EditLayoutContent pageId={params.id} initialData={page.layout} />
} 