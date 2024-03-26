'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { NewProductForm } from './new-product-form'

export function NewProductDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Novo produto
        </Button>
      </DialogTrigger>

      <DialogContent className='max-h-[832px] max-w-screen-lg'>
        <DialogHeader>
          <DialogTitle>Criando novo produto</DialogTitle>
        </DialogHeader>

        <ScrollArea className='max-h-[736px] px-2'>
          <NewProductForm />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
