'use client'

import { Category } from '@/payload/payload-types'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Separator } from '@/components/ui/separator'

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
    <DialogContent className='max-h-[832px] w-full max-w-screen-sm'>
      <DialogHeader>
        <DialogTitle>Atualizando categoria</DialogTitle>
        <DialogDescription>Atualize as informações a seguir.</DialogDescription>
      </DialogHeader>

      <Separator />

      <UpdateCategoryForm
        currentCategory={category}
        categories={categories}
        setOpen={setOpen}
      />
    </DialogContent>
  )
}
