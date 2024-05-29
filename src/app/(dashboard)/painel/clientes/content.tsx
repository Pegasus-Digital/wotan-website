import { Content, ContentHeader } from '@/components/content'
import { H1 } from '@/components/typography/headings'
import { Separator } from '@/components/ui/separator'

export function CustomersContent() {
  return (
    <Content>
      <ContentHeader
        title='Clientes'
        description='Visualize os clientes da empresa.'
      />
      <Separator className='mb-4' />
    </Content>
  )
}
