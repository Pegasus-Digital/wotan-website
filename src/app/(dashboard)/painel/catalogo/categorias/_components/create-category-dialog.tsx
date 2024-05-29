'use client'

import { useState } from 'react'

import { Category } from '@/payload/payload-types'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { CreateCategoryForm } from './create-category-form'

interface CreateCategoryDialogProps {
  categories: Category[]
}

export function CreateCategoryDialog({
  categories,
}: CreateCategoryDialogProps) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Adicionar categoria
        </Button>
      </DialogTrigger>

      <DialogContent className='max-h-[832px] w-full max-w-screen-sm'>
        <DialogHeader>
          <DialogTitle>Criando nova categoria</DialogTitle>
          <DialogDescription>
            Insira as informações da nova categoria.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <CreateCategoryForm categories={categories} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}
