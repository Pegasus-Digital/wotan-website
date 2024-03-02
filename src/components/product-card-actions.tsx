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
          <Button className='group m-0 h-10 w-10 rounded-full bg-background p-0 text-foreground hover:bg-wotanRed-500 hover:text-background'>
            <Heart className='h-5 w-5' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Adicionar aos favoritos</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className='group m-0 h-10 w-10 rounded-full bg-background p-0 text-foreground hover:bg-wotanRed-500 hover:text-background'>
            <ShoppingCart className='h-5 w-5' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Adicionar ao carrinho</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className='group m-0 h-10 w-10 rounded-full bg-background p-0 text-foreground hover:bg-wotanRed-500 hover:text-background'>
            <Eye className='h-5 w-5' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Ver detalhes</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
