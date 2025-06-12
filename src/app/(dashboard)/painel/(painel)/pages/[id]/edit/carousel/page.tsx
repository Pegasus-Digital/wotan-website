import { EditCarouselContent } from './content'
import { getPageById } from '../../../_logic/queries'
import { Media } from '@/payload/payload-types'

export default async function EditCarouselPage({ params }: { params: { id: string } }) {
  const page = await getPageById(params.id)
  
  // Transform carousel data to match the expected format
  const initialImages: Media[] = page?.carousel?.map(item => {
    if (typeof item.image === 'string') {
      return { id: item.image } as Media
    }
    return item.image as Media
  }) || []

  return <EditCarouselContent pageId={params.id} initialImages={initialImages} />
} 