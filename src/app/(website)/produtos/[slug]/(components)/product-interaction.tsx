'use client'

import Link from 'next/link'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'

import { Attribute, Category, Product } from '@/payload/payload-types'

import { toast } from 'sonner'

import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { Heading } from '@/pegasus/heading'
import { Large, Muted, Small } from '@/components/typography/texts'

import { Heart, PlusCircle, ShoppingCart } from 'lucide-react'

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
}

const favoriteIconStyles = `stroke-white fill-white group-hover/favorite:fill-primary group-hover/favorite:stroke-primary`

export function ProductInteraction({ product }: ProductInteractionProps) {
  const [itemState, setItemState] = useState<CartItem>({
    id: uuidv4(),
    productName: product.title,
    amount: product.minimumQuantity,
    productId: product.id,
    attributes: [],
  })

  const { add, favorites, addFavorite, removeFavorite } = useCartStore(
    (state) => state,
  )

  const isFavorite = favorites.some((id) => id === product.id)

  // TODO: Melhorar essa bosta
  // TODO: Colocar num hook
  const attributes = product
    ? // @ts-ignore
      product.attributes?.filter((attr: Attribute) =>
        attr.type ? attr.type : null,
      )
    : null

  const colors = attributes
    ? // @ts-ignore
      attributes.filter((attr: Attribute) => attr.type.type === 'color')
    : []

  const otherAttributes = attributes
    ? // @ts-ignore
      attributes.filter((attr: Attribute) => attr.type.type !== 'color')
    : []

  function getUniqueTypes(): string[] {
    const types = new Set<string>()

    otherAttributes.forEach((item: Attribute) => {
      // @ts-ignore
      types.add(item.type.name)
    })

    return Array.from(types)
  }

  const types = getUniqueTypes()

  function onAmountChange(e: React.MouseEvent<HTMLButtonElement>) {
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

  function slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function onAddToCart() {
    add(itemState)

    toast.success('Produto adicionado ao carrinho.', {
      icon: <PlusCircle className='h-5 w-5' />,
    })
  }

  function onToggleFavorite() {
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
    const attributeToAdd = otherAttributes.find(
      (attr: Attribute) => attr.value === value,
    ) as Attribute

    // Se já existe algum atributo com esse tipo, deve ser substituido

    // Então primeiro filtra (remove) os itens desse tipo, gerando um novo array
    const updatedAttributes = itemState.attributes.filter(
      // @ts-ignore
      (attr) => attr.type.name !== type,
    )

    // Insere o novo atributo que é desse tipo no array
    updatedAttributes.push(attributeToAdd)

    // Atualiza o estado com o novo array
    setItemState({ ...itemState, attributes: updatedAttributes })
  }

  function onSelectColor(value: string) {
    const attributeToAdd = colors.find(
      (attr: Attribute) => attr.value === value,
    ) as Attribute

    // Então primeiro filtra (remove) os itens desse tipo, gerando um novo array
    const updatedAttributes = itemState.attributes.filter(
      // @ts-ignore
      (attr) => attr.type.type !== 'color',
    )

    // Insere o novo atributo que é desse tipo no array
    updatedAttributes.push(attributeToAdd)

    // Atualiza o estado com o novo array
    setItemState({ ...itemState, attributes: updatedAttributes })
  }

  return (
    <div className='flex h-full flex-col space-y-2 px-4'>
      <Heading variant='h2'>{product.title}</Heading>
      <Muted>Código: {product.sku}</Muted>

      <div className='flex flex-wrap items-center space-x-1 space-y-1'>
        <Label>Categoria(s):</Label>
        {product.categories.map((category: Category, index) => (
          // TODO: Adicionar slug na categoria pra não precisar fazer slugify
          <Link
            key={category.id + '-' + index}
            href={`/categorias/${slugify(category.title)}`}
          >
            <Badge className='w-fit px-2 py-1' key={category.id}>
              {category.title}
            </Badge>
          </Link>
        ))}
      </div>

      <div className='flex items-center space-x-2 py-1'>
        <Large className='whitespace-nowrap text-2xl'>R$ 24.90</Large>
        <Small className='whitespace-nowrap'>/ un.</Small>
      </div>

      {/* Product description */}
      <Small className='pb-1 leading-snug'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit,
        cupiditate harum non aliquam nihil ab. Blanditiis totam modi autem
        placeat fugit nisi iusto saepe nemo. A possimus dolore dolores aut.
      </Small>

      <div>
        {colors.length > 0 ? (
          <div className='space-y-1'>
            <Label>Cores:</Label>

            <RadioGroup
              onValueChange={(value) => onSelectColor(value)}
              className='flex gap-1'
            >
              {colors.map((color: Attribute) => (
                <RadioGroupItem
                  key={color.id}
                  value={color.value}
                  style={{ backgroundColor: color.value }}
                  className='h-6 w-6 rounded-full text-white'
                />
              ))}
            </RadioGroup>
          </div>
        ) : (
          <Small className='w-full py-2'>Não há cores para selecionar</Small>
        )}
      </div>

      <div className='w-full font-medium'>
        <Label className='text-base font-semibold'>Atributos:</Label>
        <div className='mt-1 space-y-2'>
          {types.length > 0 ? (
            types.map((type) => {
              return (
                <div key={type} className='w-full tablet:max-w-64'>
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
            })
          ) : (
            <Small className='w-full py-2'>
              Não há atributos para selecionar
            </Small>
          )}
        </div>
      </div>

      {/* Space filler */}
      {/* <div className='flex-1' /> */}

      <div className='flex w-full flex-col items-center font-medium tablet:items-start'>
        <Label className='text-base font-semibold'>Quantidade:</Label>

        <div className='mt-1 flex items-center space-x-1'>
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

          <Input
            className='pointer-events-none max-w-12 bg-wotanRed-400 px-0 text-center text-lg font-bold text-primary-foreground'
            min={product.minimumQuantity}
            value={itemState.amount}
            readOnly
          />

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
