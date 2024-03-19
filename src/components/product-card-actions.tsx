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

interface ProductCardActions {
  productId: string
  minimumQuantity: number
}

export function ProductCardActions({
  productId,
  minimumQuantity,
}: ProductCardActions) {
  const { add } = useCartStore((state) => state)

  function handleAddToCart() {
    add({
      id: uuidv4(),
      productId,
      amount: minimumQuantity,
      attributes: [],
    })

    toast.success('Produto adicionado ao carrinho.', {
      icon: <PlusCircle className='h-5 w-5' />,
    })
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className='group m-0 h-10 w-10 rounded-full bg-background p-0 text-wotanRed-500 shadow-wotan-light hover:bg-wotanRed-500 hover:text-background'>
            <Heart className='h-5 w-5' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Adicionar aos favoritos</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleAddToCart}
            className='group m-0 h-10 w-10 rounded-full bg-background p-0 text-wotanRed-500 shadow-wotan-light hover:bg-wotanRed-500 hover:text-background'
          >
            <ShoppingCart className='h-5 w-5 ' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Adicionar ao carrinho</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/produtos/${productId}`}
            className={cn(
              buttonVariants({
                className:
                  'group m-0 h-10 w-10 rounded-full bg-background p-0 text-wotanRed-500 shadow-wotan-light  hover:bg-wotanRed-500 hover:text-background',
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
