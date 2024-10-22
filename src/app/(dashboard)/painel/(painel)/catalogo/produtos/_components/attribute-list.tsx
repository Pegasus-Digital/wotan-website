import { Attribute } from '@/payload/payload-types'

import {
  getUniqueTypes,
  filterAttributesByName,
  filterAttributesByType,
} from '@/lib/attribute-hooks'

import { Checkbox } from '@/components/ui/checkbox'
import { Large, Small } from '@/components/typography/texts'

interface AttributeListProps {
  attributes: Attribute[]
  field: any
  set: (name: string, value: any) => void
  readonly?: boolean
}

export function AttributeList({
  attributes,
  field,
  set,
  readonly = false,
}: AttributeListProps) {
  const colors = filterAttributesByType(attributes, 'color')
  const labels = filterAttributesByType(attributes, 'label')
  const types = getUniqueTypes(labels)

  function handleCheckedChange(id: string, state: boolean) {
    state
      ? field.value.push(id)
      : (field.value = field.value.filter(
          (attributeId: any) => attributeId !== id,
        ))

    set('attributes', field.value)
  }

  return (
    <div className='grid w-full grid-cols-2 gap-4'>
      <div className='space-y-2.5'>
        <Large>Cores</Large>

        {colors.map((color) => (
          <div key={color.id} className='flex items-center gap-1'>
            <Checkbox
              id={color.id}
              name={color.name}
              value={color.id}
              disabled={readonly}
              defaultChecked={field.value.includes(color.id)}
              onCheckedChange={(state) =>
                handleCheckedChange(color.id, !!state)
              }
            />
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
                <Checkbox
                  id={label.id}
                  name={label.name}
                  value={label.id}
                  disabled={readonly}
                  defaultChecked={field.value.includes(label.id)}
                  onCheckedChange={(state) =>
                    handleCheckedChange(label.id, !!state)
                  }
                />

                <Small>{label.name}</Small>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
