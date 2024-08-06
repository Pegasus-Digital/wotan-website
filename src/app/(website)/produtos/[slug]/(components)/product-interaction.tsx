'use client'

import Link from 'next/link'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import {
  getUniqueTypes,
  getProductAttributes,
  findAttributeByValue,
  filterAttributesByType,
  filterAttributesByNotType,
  filterAttributesByNotName,
} from '@/lib/attribute-hooks'
import { cn } from '@/lib/utils'
import { getForegroundColor } from '@/lib/color'

import { Attribute, Category, Product } from '@/payload/payload-types'

import { toast } from 'sonner'

import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { Heading } from '@/pegasus/heading'
import { Large, Muted } from '@/components/typography/texts'

import { Heart, Minus, Plus, PlusCircle, ShoppingCart } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select'

import { useCartStore } from '@/components/cart-store-provider'
import { CartItem } from '@/components/cart-store'

interface ProductInteractionProps {
  product: Product
  biggerQuantity: boolean
}

const favoriteIconStyles = `stroke-white fill-white group-hover/favorite:fill-primary group-hover/favorite:stroke-primary`

export function ProductInteraction({
  product,
  biggerQuantity,
}: ProductInteractionProps) {
  const [itemState, setItemState] = useState<CartItem>({
    id: null,
    productName: product.title,
    amount: product.minimumQuantity,
    productId: product.id,
    attributes: [],
  })

  const { add, favorites, addFavorite, removeFavorite } = useCartStore(
    (state) => state,
  )

  const isFavorite = favorites.some((id) => id === product.id)

  const attributes = product ? getProductAttributes(product) : null
  const colors = attributes ? filterAttributesByType(attributes, 'color') : null
  const otherAttributes = attributes
    ? filterAttributesByNotType(attributes, 'color')
    : null
  const types = otherAttributes ? getUniqueTypes(otherAttributes) : null

  function onAmountChange(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const type = e.currentTarget.value
    const quantity = Math.abs(parseInt(e.currentTarget.innerText))

    switch (type) {
      case 'increment':
        setItemState({ ...itemState, amount: itemState.amount + quantity })
        break

      case 'decrement':
        itemState.amount - quantity >= product.minimumQuantity
          ? setItemState({ ...itemState, amount: itemState.amount - quantity })
          : toast.warning(
              `A quantidade mínima deste produto é de ${product.minimumQuantity} unidades`,
            )
        break

      default:
        toast.error('Ocorreu algum erro.')
        break
    }
  }

  function onSetAmount(e: React.ChangeEvent<HTMLInputElement>) {
    const quantity = Math.abs(parseInt(e.target.value))
    if (!Number.isNaN(quantity)) {
      if (quantity < product.minimumQuantity) {
        toast.warning(
          `A quantidade mínima deste produto é de ${product.minimumQuantity} unidades`,
        )

        // setItemState({ ...itemState, amount: product.minimumQuantity })

        // return
      }
      setItemState({ ...itemState, amount: quantity })
    }
  }

  function onIncrement(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const quantity = 1

    setItemState({ ...itemState, amount: itemState.amount + quantity })
  }

  function onDecrement(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const quantity = 1

    itemState.amount - quantity >= product.minimumQuantity
      ? setItemState({ ...itemState, amount: itemState.amount - quantity })
      : toast.warning(
          `A quantidade mínima deste produto é de ${product.minimumQuantity} unidades`,
        )
  }
  function onAddToCart(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    const typesAmount = types ? types.length : 0
    const colorAmount = colors && colors.length > 0 ? 1 : 0

    if (itemState.amount < product.minimumQuantity) {
      toast.warning(
        `A quantidade mínima deste produto é de ${product.minimumQuantity} unidades`,
      )
    }

    if (itemState.attributes.length !== typesAmount + colorAmount) {
      return toast.info(
        'Você deve escolher todos os atributos do produto antes de adicioná-lo ao carrinho.',
      )
    }

    add({ ...itemState, id: uuidv4() })

    toast.success('Produto adicionado ao carrinho.', {
      icon: <PlusCircle className='h-5 w-5' />,
    })
  }

  function onToggleFavorite(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    // Guard clause
    if (!isFavorite) {
      addFavorite(product.id)
      toast.success('Adicionado aos favoritos.')
      return
    }

    removeFavorite(product.id)
    toast.error('Item foi removido dos favoritos.')
  }

  function onSelectAttribute(value: string, type: string) {
    const newAttribute = findAttributeByValue(otherAttributes, value)

    const updatedAttributes = filterAttributesByNotName(
      itemState.attributes,
      type,
    )

    updatedAttributes.push(newAttribute)

    setItemState({ ...itemState, attributes: updatedAttributes })
  }

  function onSelectColor(value: string) {
    const newAttribute = findAttributeByValue(colors, value)

    const updatedAttributes = filterAttributesByNotType(
      itemState.attributes,
      'color',
    )

    updatedAttributes.push(newAttribute)

    setItemState({ ...itemState, attributes: updatedAttributes })
  }

  return (
    <div className='flex h-full flex-col space-y-2 px-4'>
      <Muted>Código: {product.sku}</Muted>
      <Heading variant='h2'>{product.title}</Heading>

      <div className='flex flex-wrap items-center space-x-1 space-y-1'>
        {product.categories && (
          <>
            <Large>Categoria(s):</Large>
            {product.categories?.map((category: Category, index) => (
              <Link
                key={category.id + '-' + index}
                href={`/categorias/${category.slug}`}
              >
                <Badge className='w-fit px-2 py-1'>{category.title}</Badge>
              </Link>
            ))}
          </>
        )}
      </div>

      {product.description && (
        <Large className='py-4 leading-snug'>{product.description}</Large>
      )}

      <div>
        {colors && colors.length > 0 && (
          <div className='space-y-1'>
            <Large>Cores:</Large>

            <RadioGroup
              onValueChange={(value) => onSelectColor(value)}
              className='flex gap-1'
            >
              {colors.map((color: Attribute) => (
                <RadioGroupItem
                  key={color.id}
                  value={color.value}
                  style={{
                    backgroundColor: color.value,
                    color: getForegroundColor(color.value),
                  }}
                  className='h-6 w-6 rounded-full'
                />
              ))}
            </RadioGroup>
          </div>
        )}
      </div>

      <div className='w-full font-medium'>
        {types && types.length > 0 && (
          <Large className='text-base font-semibold'>Atributos:</Large>
        )}
        <div className='mt-1 space-y-2'>
          {types &&
            types.map((type) => {
              return (
                <div key={type} className='w-full'>
                  <Label>{type}:</Label>

                  <Select
                    onValueChange={(value) => onSelectAttribute(value, type)}
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
            })}
        </div>
      </div>

      <div className='flex w-full flex-col items-center font-medium tablet:items-start'>
        <Label className='text-base font-semibold'>Quantidade:</Label>

        <div className='mt-1 flex items-center space-x-1'>
          {biggerQuantity ? (
            <>
              <Button
                value='decrement'
                variant='outline'
                size='sm'
                onClick={onAmountChange}
                className='transition-transform hover:bg-wotanRed-400 hover:text-primary-foreground active:scale-110'
              >
                -10
              </Button>
              <Button
                value='decrement'
                variant='outline'
                size='sm'
                onClick={onAmountChange}
                className='transition-transform hover:bg-wotanRed-400 hover:text-primary-foreground active:scale-110'
              >
                -1
              </Button>
            </>
          ) : (
            <Button
              value='decrement'
              variant='outline'
              size='icon'
              onClick={onDecrement}
              className='transition-transform hover:bg-wotanRed-400 hover:text-primary-foreground active:scale-110'
            >
              <Minus className='h-4 w-4' />
            </Button>
          )}

          <Input
            className='h-10 max-w-16 bg-wotanRed-400 px-0 text-center text-lg font-bold text-primary-foreground'
            // min={product.minimumQuantity}
            value={itemState.amount}
            // readOnly={biggerQuantity}
            onChange={onSetAmount}
          />
          {biggerQuantity ? (
            <>
              <Button
                value='increment'
                variant='outline'
                size='sm'
                onClick={onAmountChange}
                className='transition-transform hover:bg-wotanRed-400 hover:text-primary-foreground active:scale-110'
              >
                +1
              </Button>
              <Button
                value='increment'
                variant='outline'
                size='sm'
                onClick={onAmountChange}
                className='transition-transform hover:bg-wotanRed-400 hover:text-primary-foreground active:scale-110'
              >
                +10
              </Button>
            </>
          ) : (
            <Button
              value='increment'
              variant='outline'
              size='icon'
              onClick={onIncrement}
              className='transition-transform hover:bg-wotanRed-400 hover:text-primary-foreground active:scale-110'
            >
              <Plus className='h-4 w-4' />
            </Button>
          )}
        </div>
      </div>

      <div className='flex items-center justify-around gap-2 tablet:justify-start'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleFavorite}
                size='lg'
                className='space-x-2 bg-primary hover:brightness-125'
              >
                <Heart
                  className={cn(
                    `h-6 w-6`,
                    isFavorite ? favoriteIconStyles : null,
                  )}
                />
                <span className='ml-2 text-base tablet:inline'>Favoritos</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Adicionar aos favoritos</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onAddToCart}
                size='lg'
                className='space-x-2 bg-primary hover:brightness-125'
              >
                <ShoppingCart className='h-6 w-6' />
                <span className='ml-2 text-base tablet:inline'>Carrinho</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Adicionar ao carrinho</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
