'use client'

import { Category, Product } from '@/payload/payload-types'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog,
} from '@/components/ui/dialog'

import { BulkUpdateProductForm } from './bulk-update-form'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface BulkUpdateProductDialogProps {
  products: Product[]
}

export function BulkUpdateProductDialog({
  products,
}: BulkUpdateProductDialogProps) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Atualização em massa
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[832px] max-w-screen-lg overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Atualizando produtos</DialogTitle>
          <DialogDescription>
            Atualize as categorias dos produtos selecionados.
          </DialogDescription>
        </DialogHeader>
        <BulkUpdateProductForm products={products} />
      </DialogContent>
    </Dialog>
  )
}
