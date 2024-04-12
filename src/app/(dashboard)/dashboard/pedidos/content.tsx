import { Content, ContentHeader } from '@/components/content'
import { Separator } from '@/components/ui/separator'

export function OrdersContent() {
  return (
    <Content>
      <ContentHeader
        title='Pedidos'
        description='Visualize e gerencie os pedidos da sua loja.'
      />
      <Separator className='mb-4' />
    </Content>
  )
}
