import { Product } from '@/payload/payload-types'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { UpdateProductForm } from './update-product-form'

interface UpdateProductDialogProps {
  currentProduct: Product
  setOpen: (state: boolean) => void
}

export function UpdateProductDialog({
  currentProduct,
  setOpen,
}: UpdateProductDialogProps) {
  return (
    <DialogContent className='max-h-[832px] max-w-screen-lg'>
      <DialogHeader>
        <DialogTitle>Atualizando produto</DialogTitle>
        <DialogDescription>
          Atualize as informações de um produto existente.
        </DialogDescription>
      </DialogHeader>

      <UpdateProductForm currentProduct={currentProduct} setOpen={setOpen} />
    </DialogContent>
  )
}
