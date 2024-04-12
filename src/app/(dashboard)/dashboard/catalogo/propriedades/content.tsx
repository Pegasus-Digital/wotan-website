import { Attribute, AttributeType, Category } from '@/payload/payload-types'

import { Heading } from '@/pegasus/heading'
import { Separator } from '@/components/ui/separator'
import { CategoryList } from './_components/category-list'
import { AttributeList } from './_components/attribute-list'
import { Content, ContentHeader } from '@/components/content'
import { CreateCategoryDialog } from './_components/create-category-dialog'
import { CreateAttributeDialog } from './_components/create-attribute-dialog'

interface PropertiesContentProps {
  attributes: Attribute[]
  types: AttributeType[]
  categories: Category[]
}

export function PropertiesContent({
  attributes,
  categories,
  types,
}: PropertiesContentProps) {
  return (
    <Content>
      <ContentHeader
        title='Propriedades'
        description='Configure as propriedades dos produtos da sua loja.'
      />

      <Separator className='mb-4' />

      <div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
        <div className='flex-1 rounded-lg border p-4'>
          <div className='flex w-full justify-between'>
            <Heading variant='h2' className='mb-2.5'>
              Atributos
            </Heading>

            <CreateAttributeDialog types={types} />
          </div>

          <AttributeList types={types} attributes={attributes} />
        </div>

        <div className='flex-1 rounded-lg border p-4'>
          <div className='flex w-full justify-between'>
            <Heading variant='h2' className='mb-2.5'>
              Categorias
            </Heading>

            <CreateCategoryDialog categories={categories} />
          </div>

          <CategoryList categories={categories} />
        </div>
      </div>
    </Content>
  )
}
