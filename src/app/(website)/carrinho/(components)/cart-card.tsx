'use client'

import { Attribute, Product } from '@/payload/payload-types'

import { toast } from 'sonner'

import {
  filterAttributesByNotType,
  filterAttributesByType,
  findAttributeByValue,
  getProductAttributes,
  getUniqueTypes,
} from '@/lib/attribute-hooks'
import { getForegroundColor } from '@/lib/color'

import { CartItem } from '@/components/cart-store'
import { useCartStore } from '@/components/cart-store-provider'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Media } from '@/components/media'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/spinner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { Heading } from '@/pegasus/heading'
import { Large, Small } from '@/components/typography/texts'

import { Trash } from 'lucide-react'

interface CartCardProps {
  cartItem: CartItem
  product: Product
}

export function CartCard({ cartItem, product }: CartCardProps) {
  const { remove, incrementAmount, decrementAmount, updateAttr } = useCartStore(
    (state) => state,
  )

  const attributes = product ? getProductAttributes(product) : null
  const colors = attributes ? filterAttributesByType(attributes, 'color') : null
  const otherAttributes = attributes
    ? filterAttributesByNotType(attributes, 'color')
    : null
  const types = otherAttributes ? getUniqueTypes(otherAttributes) : null

  function onSelectAttribute(value: string) {
    const newAttribute = findAttributeByValue(otherAttributes, value)

    updateAttr(cartItem.id, newAttribute)
  }

  function getAttributeValueByType(type: string): string {
    const attribute = cartItem.attributes.find((attr) => {
      if (typeof attr.type === 'object') {
        return attr.type.name === type
      }
    })

    if (!attribute) {
      return ''
    }

    return attribute.value
  }

  function getAttributeColor(): string {
    const attribute = cartItem.attributes.find((attr) => {
      if (typeof attr.type === 'object') {
        return attr.type.type === 'color'
      }
    })

    if (!attribute) {
      return ''
    }

    return attribute.value
  }

  function getColorByValue(value: string) {
    const attribute = colors.find(
      (attr: Attribute) => attr.value === value,
    ) as Attribute

    updateAttr(cartItem.id, attribute)
  }

  if (!product) return <LoadingSpinner />

  return (
    <Card className='w-full shadow-xl tablet:flex'>
      <CardHeader className='text-center'>
        <Heading variant='h3'>{product.title}</Heading>
        <Media
          className='rounded-md shadow-2xl'
          resource={product.featuredImage}
          imgClassName='rounded-md aspect-square shadow-lg object-contain'
        />
      </CardHeader>

      <CardContent className='flex w-full flex-col space-y-2 tablet:p-6'>
        {otherAttributes && otherAttributes.length > 0 ? (
          <div className='space-y-1'>
            <Large>Atributos:</Large>

            {types.length > 0 ? (
              types.map((type) => {
                return (
                  <div key={type}>
                    <Small>{type}:</Small>

                    <Select
                      defaultValue={getAttributeValueByType(type)}
                      onValueChange={(value) => onSelectAttribute(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Selecione um...`} />
                      </SelectTrigger>
                      <SelectContent>
                        {otherAttributes
                          // @ts-ignore
                          .filter((attr: Attribute) => attr.type.name === type)
                          .map((attr: Attribute) => (
                            <SelectItem key={attr.id} value={attr.value}>
                              {attr.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              })
            ) : (
              <Large className='w-full py-2'>
                Não há atributos para selecionar
              </Large>
            )}
          </div>
        ) : (
          <Large className='w-full py-2'>
            Não há atributos para selecionar
          </Large>
        )}

        {colors && colors.length > 0 ? (
          <div className='space-y-1'>
            <Large>Cores:</Large>

            <RadioGroup
              defaultValue={getAttributeColor()}
              onValueChange={(value) => getColorByValue(value)}
              className='flex gap-1'
            >
              {colors.map((color: Attribute, index) => {
                return (
                  <RadioGroupItem
                    key={color.name + '-' + index}
                    value={color.value}
                    style={{
                      backgroundColor: color.value,
                      color: getForegroundColor(color.value),
                    }}
                    className='h-6 w-6 rounded-full'
                  />
                )
              })}
            </RadioGroup>
          </div>
        ) : (
          <Large className='w-full py-2'>Não há cores para selecionar</Large>
        )}

        <div className='flex-1' />

        <CartInteraction
          item={cartItem}
          minimumQuantity={product.minimumQuantity}
          decrementAmount={decrementAmount}
          incrementAmount={incrementAmount}
          remove={remove}
        />
      </CardContent>
    </Card>
  )
}

interface CartInteractionProps {
  item: CartItem
  minimumQuantity: number
  incrementAmount: (id: string, quantity: number) => void
  decrementAmount: (id: string, quantity: number) => void
  remove: (id: string) => void
}

function CartInteraction({
  item,
  minimumQuantity,
  incrementAmount,
  decrementAmount,
  remove,
}: CartInteractionProps) {
  function onCartRemove() {
    remove(item.id)

    toast.error('Item removido do carrinho.', {
      icon: <Trash className='h-5 w-5' />,
    })
  }

  function onAmountChange(e: React.MouseEvent<HTMLButtonElement>) {
    const type = e.currentTarget.value

    switch (type) {
      case 'increment':
        incrementAmount(item.id, 1)
        break
      case 'decrement':
        item.amount - 1 >= minimumQuantity
          ? decrementAmount(item.id, 1)
          : toast.warning(
              `A quantidade mínima deste produto é de ${minimumQuantity} unidades`,
            )
        break
      default:
        toast.error('Ocorreu algum erro.')
        break
    }
  }

  return (
    <div className='flex w-full flex-col space-y-2'>
      <div className='flex flex-col items-center space-y-1 self-center'>
        <Large>Quantidade:</Large>
        <div className='flex items-center space-x-1 transition-all'>
          <Button
            value='decrement'
            variant='ghost'
            size='sm'
            onClick={onAmountChange}
            className='aspect-square text-lg font-semibold hover:bg-wotanRed-400 hover:text-primary-foreground active:scale-110'
          >
            -
          </Button>

          <Input
            className='pointer-events-none max-w-12 bg-primary px-0 text-center text-lg font-bold text-primary-foreground'
            value={item.amount}
            readOnly
          />

          <Button
            value='increment'
            variant='ghost'
            size='sm'
            onClick={onAmountChange}
            className='aspect-square text-lg font-semibold hover:bg-primary hover:text-primary-foreground active:scale-110'
          >
            +
          </Button>
        </div>
      </div>
      <Button
        variant='outline'
        className='w-full shadow-lg'
        onClick={onCartRemove}
      >
        <Trash className='mr-2 h-5 w-5' />
        Remover
      </Button>
    </div>
  )
}
