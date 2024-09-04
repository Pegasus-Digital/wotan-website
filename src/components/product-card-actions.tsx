'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

import { Product } from '@/payload/payload-types'
import { useCartStore } from './cart-store-provider'

import { toast } from 'sonner'

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from './ui/tooltip'

import { Button, buttonVariants } from './ui/button'

import { AddToCartDialog } from './add-to-cart-dialog'

import { Icons } from './icons'

interface ProductCardActions {
  product: Product
}

const favoriteIconStyles = `stroke-primary fill-primary group-hover/favorite:fill-white group-hover/favorite:stroke-white`

export function ProductCardActions({ product }: ProductCardActions) {
  const { addFavorite, removeFavorite, favorites } = useCartStore(
    (state) => state,
  )

  const isFavorite = favorites.some((id) => id === product.id)

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
            <Icons.Favorite
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
            <Icons.Look className='h-5 w-5' />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Ver detalhes</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
