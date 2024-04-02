'use client'

import { Category } from '@/payload/payload-types'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { UpdateCategoryForm } from './update-category-form'

interface UpdateCategoryDialogProps {
  category: Category
  categories: Category[]
  setOpen: (state: boolean) => void
}

export function UpdateCategoryDialog({
  category,
  categories,
  setOpen,
}: UpdateCategoryDialogProps) {
  return (
    <DialogContent className='max-h-[832px] w-fit max-w-screen-lg'>
      <DialogHeader>
        <DialogTitle>Atualizando categoria</DialogTitle>
        <DialogDescription>Atualize as informações a seguir.</DialogDescription>
      </DialogHeader>

      <UpdateCategoryForm
        currentCategory={category}
        categories={categories}
        setOpen={setOpen}
      />
    </DialogContent>
  )
}
