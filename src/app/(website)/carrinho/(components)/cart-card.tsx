'use client'

import { Attribute, Product } from '@/payload/payload-types'

import { toast } from 'sonner'

import {
  getUniqueTypes,
  findAttributeByValue,
  getProductAttributes,
  filterAttributesByType,
  filterAttributesByNotType,
} from '@/lib/attribute-hooks'
import { getForegroundColor } from '@/lib/color'

import { CartItem } from '@/components/cart-store'
import { useCartStore } from '@/components/cart-store-provider'

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select'

import { Icons } from '@/components/icons'
import { Media } from '@/components/media'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/spinner'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { Heading } from '@/pegasus/heading'
import { Small } from '@/components/typography/texts'

interface CartCardProps {
  cartItem: CartItem
  product: Product
}

export function CartCard({ cartItem, product }: CartCardProps) {
  const { remove, incrementAmount, decrementAmount, setAmount, updateAttr } =
    useCartStore((state) => state)

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

  if (!product)
    return (
      <div className='flex w-full items-center justify-center'>
        <LoadingSpinner />
      </div>
    )

  return (
    <div className='grid w-full grid-flow-row grid-cols-1 items-center gap-4 rounded-md bg-background p-4 tablet:grid-cols-[128px_1fr_256px] tablet:p-2'>
      <Media
        className=' mx-8 rounded-md shadow-2xl tablet:mx-0'
        resource={product.featuredImage}
        imgClassName='rounded-md aspect-square shadow-lg object-contain'
      />
      <div className='grid h-full items-start gap-1'>
        <Heading variant='h3' className=' font-bold'>
          {product.title}
        </Heading>
        {otherAttributes && otherAttributes.length > 0 ? (
          <div className='space-y-1'>
            <Small>Atributos:</Small>

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
              <Small className='w-full py-2 text-foreground opacity-0'>
                Não há atributos para selecionar
              </Small>
            )}
          </div>
        ) : (
          <Small className='w-full py-2 text-foreground opacity-0 '>
            Não há atributos para selecionar
          </Small>
        )}

        {colors && colors.length > 0 ? (
          <div className='space-y-1'>
            <Small>Cores:</Small>

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
          <Small className='w-full py-2 text-foreground opacity-0'>
            Não há cores para selecionar
          </Small>
        )}
      </div>

      <CartInteraction
        item={cartItem}
        minimumQuantity={product.minimumQuantity}
        decrementAmount={decrementAmount}
        incrementAmount={incrementAmount}
        setAmount={setAmount}
        remove={remove}
      />
    </div>
  )
}

interface CartInteractionProps {
  item: CartItem
  minimumQuantity: number
  incrementAmount: (id: string, quantity: number) => void
  decrementAmount: (id: string, quantity: number) => void
  setAmount: (id: string, quantity: number) => void
  remove: (id: string) => void
}

function CartInteraction({
  item,
  minimumQuantity,
  incrementAmount,
  decrementAmount,
  setAmount,
  remove,
}: CartInteractionProps) {
  function onCartRemove() {
    remove(item.id)

    toast.error('Item removido do carrinho.', {
      icon: <Icons.Trash className='h-5 w-5' />,
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

  function onSetAmount(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value
    const quantity = Math.abs(parseInt(inputValue, 10))

    if (inputValue === '') {
      setAmount(item.id, 0)
      return
    }

    if (Number.isNaN(quantity)) {
      toast.warning('Por favor, insira um valor numérico válido')
      setAmount(item.id, 0)
      return
    }

    if (quantity < minimumQuantity) {
      toast.warning(
        `A quantidade mínima deste produto é de ${minimumQuantity} unidades`,
      )
      // setAmount(item.id, quantity)
      // return
    }

    setAmount(item.id, quantity)
  }

  return (
    <div className=' flex w-full flex-row items-center justify-end gap-8'>
      <div className='flex w-full items-center justify-center gap-1 transition-all tablet:w-auto '>
        <Button
          value='decrement'
          variant='ghost'
          size='icon'
          onClick={onAmountChange}
          className='aspect-square text-lg font-semibold hover:bg-wotanRed-400 hover:text-primary-foreground active:scale-110'
        >
          <Icons.Minus className='h-5 w-5' />
        </Button>

        <Input
          className='max-w-16 bg-primary px-0 text-center text-lg font-bold text-primary-foreground'
          value={item.amount}
          // min={minimumQuantity}
          onChange={onSetAmount}
          type='number'
        />

        <Button
          value='increment'
          variant='ghost'
          size='icon'
          onClick={onAmountChange}
          className='aspect-square text-lg font-semibold hover:bg-primary hover:text-primary-foreground active:scale-110'
        >
          <Icons.Plus className='h-5 w-5' />
        </Button>
      </div>
      <Button
        variant='outline'
        className='shadow-lg'
        onClick={onCartRemove}
        size='icon'
      >
        <Icons.Trash className='h-5 w-5' />
      </Button>
    </div>
  )
}
