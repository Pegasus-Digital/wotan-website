'use client'

import { useState } from 'react'

import { toast } from 'sonner'

import { Product } from '@/payload/payload-types'

import { Button } from '@/components/ui/button'
import { BulkUpdateProductForm } from './bulk-update-form'

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'

interface BulkUpdateProductDialogProps {
  products: Product[]
}

export function BulkUpdateProductDialog({
  products,
}: BulkUpdateProductDialogProps) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <Button
        variant='outline'
        size='sm'
        onClick={() => {
          if (products.length >= 2) {
            setOpen(true)
          } else toast.error('Selecione pelo menos dois produtos')
        }}
        disabled={products.length < 2}
      >
        Atualização em massa
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-h-[832px] max-w-screen-lg overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Atualizando produtos</DialogTitle>
            <DialogDescription>
              Atualize as categorias dos produtos selecionados.
            </DialogDescription>
          </DialogHeader>

          <BulkUpdateProductForm products={products} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  )
}
