import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'
import { NewProductForm } from '../_components/new-product-form'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

export function NewProductContent() {
  return (
    // <Content>
    //   <ContentHeader
    //     title='Criando novo produto'
    //     description='Insira as informações e escolha as etiquetas do novo produto.'
    //   />
    //   <Separator className='mb-4' />
    <ContentLayout title='Criando novo produto'>
      <NewProductForm />
    </ContentLayout>
  )
}
