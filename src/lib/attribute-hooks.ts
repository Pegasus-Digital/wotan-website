import { Attribute, AttributeType, Product } from '@/payload/payload-types'

export function getProductAttributes(product: Product): Attribute[] | null {
  if (!product) {
    return null
  }

  const attributes = product.attributes?.map((attribute) => {
    if (typeof attribute === 'object') {
      return attribute
    }
  })

  return attributes
}

export function filterAttributesByType(attributes: Attribute[], type: string) {
  const filteredAttributes = attributes.filter((attribute) => {
    if (typeof attribute.type === 'object') {
      return attribute.type.type === type
    }
  })

  return filteredAttributes
}

export function filterAttributesByName(attributes: Attribute[], name: string) {
  const filteredAttributes = attributes.filter((attribute) => {
    if (typeof attribute.type === 'object') {
      return attribute.type.name === name
    }
  })

  return filteredAttributes
}

export function filterAttributesByNotType(
  attributes: Attribute[],
  type: string,
) {
  const filteredAttributes = attributes.filter((attribute) => {
    if (typeof attribute.type === 'object') {
      return attribute.type.type !== type
    }
  })

  return filteredAttributes
}

export function filterAttributesByNotName(
  attributes: Attribute[],
  name: string,
) {
  const filteredAttributes = attributes.filter((attribute) => {
    if (typeof attribute.type === 'object') {
      return attribute.type.name !== name
    }
  })

  return filteredAttributes
}

export function getUniqueTypes(attributes: Attribute[]): string[] {
  const types = new Set<string>()

  attributes.forEach((item: Attribute) => {
    if (typeof item.type === 'object') {
      types.add(item.type.name)
    }
  })

  return Array.from(types)
}

export function getUniqueAttributeTypes(
  attributes: Attribute[],
): AttributeType[] {
  const attributeTypes: AttributeType[] = []

  attributes.filter((item: Attribute) => {
    if (typeof item.type === 'object') {
      const attributeAlreadyExists = attributeTypes.find(
        // @ts-ignore
        (type) => type.id === item.type.id,
      )

      if (!attributeAlreadyExists) attributeTypes.push(item.type)
    }
  })

  return attributeTypes
}

export function findAttributeByValue(attributes: Attribute[], value: string) {
  const attributeFound = attributes.find(
    (attribute: Attribute) => attribute.value === value,
  )

  return attributeFound
}
