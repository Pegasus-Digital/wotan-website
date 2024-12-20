'use client'

import { useState } from 'react'

import { Category } from '@/payload/payload-types'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'

import { CreateCategoryForm } from './create-category-form'
import { Icons } from '@/components/icons'

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
          <Icons.Plus className='mr-2 h-4 w-4' />
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
