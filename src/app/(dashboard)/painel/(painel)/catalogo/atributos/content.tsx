import { Attribute, AttributeType } from '@/payload/payload-types'

import { Separator } from '@/components/ui/separator'
import { AttributeList } from './_components/attribute-list'
import { Content, ContentHeader } from '@/components/content'
import { CreateAttributeDialog } from './_components/create-attribute-dialog'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

interface PropertiesContentProps {
  attributes: Attribute[]
  types: AttributeType[]
}

export function AttributesContent({
  attributes,
  types,
}: PropertiesContentProps) {
  return (
    // <Content>
    //   <ContentHeader
    //     title='Atributos'
    //     description='Configure os atributos dos produtos da sua loja.'
    //   />

    //   <Separator className='mb-4' />
    <ContentLayout
      title='Atributos'
      navbarButtons={<CreateAttributeDialog types={types} />}
    >
      {/* <div className='grid'> */}
      {/* <div className='flex-1 rounded-lg border p-4'> */}
      {/* <div className='flex w-full justify-end'>
        <CreateAttributeDialog types={types} />
      </div> */}

      <AttributeList types={types} attributes={attributes} />
      {/* </div> */}
      {/* </div> */}
    </ContentLayout>
  )
}
