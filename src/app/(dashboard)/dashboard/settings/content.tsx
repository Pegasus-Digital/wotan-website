import { Content, ContentHeader } from '@/components/content'
import { Separator } from '@/components/ui/separator'
import { SettingsForm } from './(form)/settings-form'

export function SettingsContent() {
  return (
    <Content>
      <ContentHeader
        title='Configurações'
        description='Altere as configurações da plataforma.'
      />

      <Separator className='mb-4' />

      <SettingsForm />
    </Content>
  )
}
