import {
  filterAttributesByType,
  getUniqueTypes,
  filterAttributesByName,
} from '@/lib/attribute-hooks'

import { Attribute } from '@/payload/payload-types'

import { Large, Small } from '@/components/typography/texts'

interface AttributeListProps {
  attributes: Attribute[]
}

export function AttributeList({ attributes }: AttributeListProps) {
  const colors = filterAttributesByType(attributes, 'color')
  const labels = filterAttributesByType(attributes, 'label')
  const types = getUniqueTypes(labels)

  return (
    <div className='grid w-full gap-4'>
      <div className='space-y-1'>
        <Large>Cores</Large>

        {colors.map((color) => (
          <div key={color.id} className='flex items-center gap-1'>
            <div
              className='h-5 w-5 rounded-full border'
              style={{ backgroundColor: color.value }}
            />

            <Small>{color.name}</Small>
          </div>
        ))}
      </div>

      {types.map((type) => {
        const filteredAttributes = filterAttributesByName(labels, type)

        return (
          <div key={type} className='space-y-1'>
            <Large>{type}</Large>

            {filteredAttributes.map((label) => (
              <div key={label.id} className='flex items-center gap-1'>
                <Small>{label.name}</Small>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
