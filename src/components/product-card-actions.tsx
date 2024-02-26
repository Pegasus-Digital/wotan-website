'use client'

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from './ui/tooltip'

import { Button } from './ui/button'
import { Heart, ShoppingCart, Eye } from 'lucide-react'

interface ProductCardActions {
  productId: string
  isFavorite: boolean
}

export function ProductCardActions() {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className='bg-background hover:bg-wotanRed-500 hover:text-background text-foreground group m-0 h-10 w-10 rounded-full p-0'>
            <Heart className='h-5 w-5' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Adicionar aos favoritos</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className='bg-background hover:bg-wotanRed-500 hover:text-background text-foreground group m-0 h-10 w-10 rounded-full p-0'>
            <ShoppingCart className='h-5 w-5' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Adicionar ao carrinho</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className='bg-background hover:bg-wotanRed-500 hover:text-background text-foreground group m-0 h-10 w-10 rounded-full p-0'>
            <Eye className='h-5 w-5' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Ver detalhes</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
