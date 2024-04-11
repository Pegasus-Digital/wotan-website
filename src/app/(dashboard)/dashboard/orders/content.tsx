import { Content } from '@/components/content'
import { H1 } from '@/components/typography/headings'
import { ImageUploader } from '../catalog/produtos/_components/image-uploader'

export function OrdersContent() {
  return (
    <Content>
      <H1>Orders</H1>
      <ImageUploader />
    </Content>
  )
}
