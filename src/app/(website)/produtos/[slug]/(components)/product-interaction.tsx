'use client'

import Link from 'next/link'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'

import { Category, Product } from '@/payload/payload-types'

import { toast } from 'sonner'

import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
  SelectLabel,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select'

import { useCartStore } from '@/components/cart-store-provider'

interface ProductInteractionProps {
  product: Product
}

const favoriteIconStyles = `stroke-white fill-white group-hover/favorite:fill-primary group-hover/favorite:stroke-primary`

export function ProductInteraction({ product }: ProductInteractionProps) {
  const [amount, setAmount] = useState(product.minimumQuantity)

  const { add, favorites, addFavorite, removeFavorite } = useCartStore(
    (state) => state,
  )

  const isFavorite = favorites.some((id) => id === product.id)

  function onAmountChange(e: React.MouseEvent<HTMLButtonElement>) {
    const type = e.currentTarget.value
    const quantity = Math.abs(parseInt(e.currentTarget.innerText))

    switch (type) {
      case 'increment':
        setAmount(amount + quantity)

        break
      case 'decrement':
        amount - quantity >= product.minimumQuantity
          ? setAmount(amount - quantity)
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
    add({
      id: uuidv4(),
      productId: product.id,
      amount,
      attributes: [],
    })

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

  return (
    <div className='flex h-full flex-col space-y-2 px-4 py-2'>
      <Heading variant='h2'>{product.title}</Heading>

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

      <div className='w-full font-medium'>
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
            value={amount}
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

      <div className='w-full font-medium'>
        <Label className='text-base font-semibold'>Atributos:</Label>
        {/* TODO: Renderizar atributos dinamicamente como select - BASE */}
        {/* <div className='mt-1 space-y-2'>
          {product.attributes.map((attribute: Atribute) => (
          <Select key={attribute.id}>
          <SelectTrigger>
          <SelectValue placeholder='Selecione um valor' />
          </SelectTrigger>
          <SelectContent>
          <SelectItem value='a'>Value 1</SelectItem>
          <SelectItem value='b'>Value 2</SelectItem>
          </SelectContent>
          </Select>
        ))}
        </div> */}
      </div>

      {/* Space filler */}
      <div className='flex-1' />

      <Muted>Código: {product.sku}</Muted>
      <div className='flex items-center gap-2'>
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
                <span className='ml-2 hidden text-base tablet:inline'>
                  Favoritos
                </span>
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
