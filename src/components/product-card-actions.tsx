'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'

import { useCartStore } from './cart-store-provider'

import { toast } from 'sonner'

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from './ui/tooltip'

import { Button, buttonVariants } from './ui/button'
import { Heart, ShoppingCart, Eye, PlusCircle } from 'lucide-react'
import { Product } from '@/payload/payload-types'
import { AddToCartDialog } from './add-to-cart-dialog'

interface ProductCardActions {
  product: Product
}

const favoriteIconStyles = `stroke-primary fill-primary group-hover/favorite:fill-white group-hover/favorite:stroke-white`

export function ProductCardActions({ product }: ProductCardActions) {
  const { add, addFavorite, removeFavorite, favorites } = useCartStore(
    (state) => state,
  )

  const isFavorite = favorites.some((id) => id === product.id)

  function onAddToCart() {
    add({
      id: uuidv4(),
      productName: product.title,
      productId: product.id,
      amount: product.minimumQuantity,
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
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onToggleFavorite}
            className='group/favorite m-0 h-10 w-10 rounded-full bg-background p-0 text-foreground shadow-wotan-light hover:bg-primary hover:text-background'
          >
            <Heart
              className={cn(`h-5 w-5`, isFavorite ? favoriteIconStyles : null)}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Adicionar aos favoritos</TooltipContent>
      </Tooltip>

      <AddToCartDialog productId={product.id} />

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/produtos/${product.slug}`}
            className={cn(
              buttonVariants({
                className:
                  'group m-0 h-10 w-10 rounded-full bg-background p-0 text-foreground shadow-wotan-light hover:bg-primary hover:text-background',
              }),
            )}
          >
            <Eye className='h-5 w-5' />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Ver detalhes</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
