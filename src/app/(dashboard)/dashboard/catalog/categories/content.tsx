import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'

export function CategoriesContent() {
  return (
    <Content>
      <ContentHeader
        title='Categorias'
        description='Configure as categorias cadastradas na sua loja.'
      />

      <Separator className='mb-4' />

      <div className='grid grid-cols-dashboard'>
        <div className='bg-red-500'>a</div>
        <div className='flex-1 bg-blue-300'>b</div>
      </div>
    </Content>
  )
}
