import { EditCarouselContent } from './content'
import { getPageById } from '../../../_logic/queries'
import { Media } from '@/payload/payload-types'

export default async function EditCarouselPage({ params }: { params: { id: string } }) {
  const page = await getPageById(params.id)
  
  // Transform carousel data to match the expected format
  const initialImages: Media[] = page?.carousel?.map(item => {
    if (!item.image) return null
    if (typeof item.image === 'string') {
      return { id: item.image } as Media
    }
    // If it's already a Media object, return it as is
    return item.image as Media
  }).filter(Boolean) || []

  return <EditCarouselContent pageId={params.id} initialImages={initialImages} />
} 