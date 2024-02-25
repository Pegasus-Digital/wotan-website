import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { Lead, P } from './typography/texts'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter } from './ui/card'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from './ui/tooltip'

interface ProductCardProps {
  name: string
  category: string
  colors: any[]
}

export function ProductCard() {
  return (
    <Card className='group my-3 shadow-md'>
      <CardContent className='relative m-0 rounded-md p-0'>
        <img
          className='aspect-square h-full max-h-[300px] min-h-[300px] w-full rounded-t-md object-cover'
          alt='random'
          src='https://source.unsplash.com/random/'
        />

        <div className='absolute bottom-2 flex w-full translate-y-10 items-center justify-center gap-2.5 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100'>
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
        </div>
      </CardContent>
      <CardFooter className='z-10 flex flex-col items-start space-y-2.5 py-4'>
        <Lead className='text-wotanRed-500 text-sm font-bold'>Categoria</Lead>
        <P className='text-foreground text-base font-bold'>Nome do Produto</P>
        <div className='flex items-center gap-1'>
          <div className='h-4 w-4 rounded-full bg-red-500' />
          <div className='h-4 w-4 rounded-full bg-green-500' />
          <div className='h-4 w-4 rounded-full bg-blue-500' />
        </div>
      </CardFooter>
    </Card>
  )
}
