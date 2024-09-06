import { Category } from '@/payload/payload-types'

import { Separator } from '@/components/ui/separator'
import { CategoryList } from './_components/category-list'
import { Content, ContentHeader } from '@/components/content'
import { CreateCategoryDialog } from './_components/create-category-dialog'

interface PropertiesContentProps {
  categories: Category[]
}

export function CategoriesContent({ categories }: PropertiesContentProps) {
  return (
    <Content>
      <ContentHeader
        title='Categorias'
        description='Configure as categorias da sua loja.'
      />

      <Separator className='mb-4' />

      <div className='flex w-full justify-end'>
        <CreateCategoryDialog categories={categories} />
      </div>

      <CategoryList categories={categories} />
    </Content>
  )
}
