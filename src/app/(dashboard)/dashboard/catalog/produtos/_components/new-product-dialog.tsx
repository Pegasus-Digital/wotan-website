'use client'

import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'

import { NewProductForm } from './new-product-form'

export function NewProductDialog() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Novo produto
        </Button>
      </DialogTrigger>

      <DialogContent className='max-h-[832px] max-w-screen-lg overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Criando novo produto</DialogTitle>
          <DialogDescription>
            Insira as informações e escolha as etiquetas do novo produto.
          </DialogDescription>
        </DialogHeader>

        <NewProductForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}
