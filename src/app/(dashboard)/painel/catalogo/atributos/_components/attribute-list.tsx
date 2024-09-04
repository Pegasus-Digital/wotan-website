import { Attribute, AttributeType } from '@/payload/payload-types'

import {
  filterAttributesByType,
  filterAttributesByName,
} from '@/lib/attribute-hooks'

import { Large, Small } from '@/components/typography/texts'

import { AttributeActions } from './attribute-actions'

interface AttributeListProps {
  attributes: Attribute[]
  types: AttributeType[]
}

export function AttributeList({ attributes, types }: AttributeListProps) {
  const colors = filterAttributesByType(attributes, 'color')
  const labels = filterAttributesByType(attributes, 'label')
  const attributeTypeNames = types.map((type) => type.name)

  return (
    <div className='grid w-full gap-4'>
      <div className='space-y-1'>
        <Large>Cores</Large>

        {colors.map((color) => (
          <div key={color.id} className='flex items-center gap-1.5'>
            <AttributeActions attribute={color} types={types} />

            <div
              className='h-5 w-5 rounded-full border'
              style={{ backgroundColor: color.value }}
            />

            <Small>{color.name}</Small>
          </div>
        ))}
      </div>

      {attributeTypeNames.map((type) => {
        // Color is being rendered separately with a different method.
        if (type === 'Cor') return null

        const filteredAttributes = filterAttributesByName(labels, type)

        return (
          <div key={type} className='space-y-1'>
            <Large>{type}</Large>

            {filteredAttributes.map((label) => (
              <div key={label.id} className='flex items-center space-x-2'>
                <AttributeActions attribute={label} types={types} />

                <Small>{label.name}</Small>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
