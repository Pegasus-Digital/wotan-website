import { useEffect, useState } from 'react'

import { Attribute } from '@/payload/payload-types'

import { cn } from '@/lib/utils'

import { Icons } from '@/components/icons'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import {
  Command,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/components/ui/command'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface AttributesComboboxProps {
  attributeArray: Attribute[]
  selectedAttributes: string[]
  onUpdate: (attributes: Attribute[]) => void
}

export function AttributesCombobox({
  attributeArray,
  selectedAttributes,
  onUpdate,
}: AttributesComboboxProps) {
  const [open, setOpen] = useState<boolean>(false)

  const [value, setValue] = useState<Attribute[]>(
    selectedAttributes && selectedAttributes.length > 0
      ? selectedAttributes.map((id) =>
          attributeArray.find((attr) => attr.id === id),
        )
      : [],
  )

  const toggleAttributeSelection = (attribute: Attribute) => {
    setValue((prev) => {
      // Check if the attribute is already selected
      if (prev.some((attr) => attr.value === attribute.value)) {
        // Remove it if it's already selected
        return prev.filter((attr) => attr.value !== attribute.value)
      } else {
        // Add it if it's not selected
        return [...prev, attribute]
      }
    })
  }

  function arraysAreEqual(arr1: Attribute[], arr2: Attribute[]): boolean {
    if (arr1.length !== arr2.length) return false
    return arr1.every((item, index) => item.id === arr2[index].id)
  }

  useEffect(() => {
    const newSelectedAttributes = selectedAttributes.map(
      (id) => attributeArray.find((attr) => attr.id === id) as Attribute,
    )

    if (!arraysAreEqual(value, newSelectedAttributes)) {
      onUpdate(value)
    }
  }, [selectedAttributes, attributeArray, value, onUpdate])

  const groupedAttributes = value.reduce<Record<string, Attribute[]>>(
    (acc, attribute) => {
      const label =
        typeof attribute.type === 'string'
          ? attribute.type
          : attribute.type?.name || 'default'
      if (!acc[label]) {
        acc[label] = []
      }
      acc[label].push(attribute)
      return acc
    },
    {},
  )

  return (
    <>
      {value.length > 0 && (
        <div className=''>
          {Object.entries(groupedAttributes).map(([label, attributes]) => (
            <div key={label} className='mb-2 flex flex-row'>
              <Label className='mr-1 mt-1'>{label}:</Label>
              <div className='mt-1 flex flex-wrap gap-1'>
                {attributes.map((attribute, index) => (
                  <Label key={attribute.value}>
                    {attribute.name}
                    {index !== attributes.length - 1 && attributes.length > 1
                      ? ','
                      : ''}
                  </Label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {attributeArray.length > 0 && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='w-[200px] justify-between'
              onClick={() => {}}
            >
              {'Selecione atributo...'}
              <Icons.ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0'>
            <Command>
              <CommandInput placeholder='Pesquise atributo...' />
              <CommandList>
                <CommandEmpty>Attributo não encontrado.</CommandEmpty>
                <CommandGroup>
                  {attributeArray.map((attribute) => (
                    <CommandItem
                      key={`${attribute.name}-${attribute.value}`}
                      value={attribute.value}
                      onSelect={() => {
                        toggleAttributeSelection(attribute)
                        setOpen(false)
                      }}
                    >
                      <Icons.Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value.some((attr) => attr.value === attribute.value)
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {attribute.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}
