import { Metadata } from 'next'

import { getAttributes, getAttributeTypes } from './_logic/queries'

import { AttributesContent } from './content'

export const metadata: Metadata = {
  title: 'Atributos',
}

export default async function Properties() {
  const attributes = await getAttributes()
  const attributeTypes = await getAttributeTypes()

  return (
    <AttributesContent
      attributes={attributes.data}
      types={attributeTypes.data}
    />
  )
}
