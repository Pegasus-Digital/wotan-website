'use client'

import { useState } from 'react'

import { AttributeType } from '@/payload/payload-types'

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

import { CreateAttributeForm } from './create-attribute-form'
import { Icons } from '@/components/icons'

interface CreateAttributeDialogProps {
  types: AttributeType[]
}

export function CreateAttributeDialog({ types }: CreateAttributeDialogProps) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <Icons.Plus className='mr-2 h-4 w-4' />
          Adicionar atributo
        </Button>
      </DialogTrigger>

      <DialogContent className='max-h-[832px] w-full max-w-screen-sm'>
        <DialogHeader>
          <DialogTitle>Criando novo atributo</DialogTitle>
          <DialogDescription>
            Insira as informações do novo atributo.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <CreateAttributeForm types={types} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}
