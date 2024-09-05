import { useState } from 'react'

import { Icons } from './icons'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

import { AddToCartContent } from './add-to-cart-content'

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
          <Icons.Cart className='h-5 w-5 ' />
        </Button>
      </DialogTrigger>

      <DialogContent className='  max-w-96 overflow-clip  px-2  tablet:max-w-screen-md desktop:max-w-screen-xl'>
        {/* <DialogHeader>
          <DialogTitle>Adicionar ao carrinho</DialogTitle>
          <DialogDescription>
            Complete as informações para adicionar ao carrinho
          </DialogDescription>
        </DialogHeader>

        <Separator /> */}

        <AddToCartContent productId={productId} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}
