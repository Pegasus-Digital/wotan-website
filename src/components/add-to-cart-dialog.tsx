import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { AddToCartContent } from './add-to-cart-content'

import { ShoppingCart } from 'lucide-react'

interface AddToCartDialogProps {
  productId: string
}

export function AddToCartDialog({ productId }: AddToCartDialogProps) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className='group m-0 h-10 w-10 rounded-full bg-background p-0 text-foreground shadow-wotan-light hover:bg-primary hover:text-background'
          variant='outline'
          size='sm'
        >
          <ShoppingCart className='h-5 w-5 ' />
        </Button>
      </DialogTrigger>

      <DialogContent className=' w-[calc(100%-1rem)] max-w-screen-xl overflow-clip'>
        <DialogHeader>
          <DialogTitle>Adicionar ao carrinho</DialogTitle>
          <DialogDescription>
            Complete as informações para adicionar ao carrinho
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <AddToCartContent productId={productId} />
      </DialogContent>
    </Dialog>
  )
}
