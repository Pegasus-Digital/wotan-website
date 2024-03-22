import { Content, ContentHeader } from '@/components/content'
import { Separator } from '@/components/ui/separator'

export function ContactContent() {
  return (
    <Content>
      <ContentHeader
        title='Contato'
        description='Verifique as tentativas de contato realizadas na plataforma.'
      />

      <Separator className='mb-4' />
    </Content>
  )
}
