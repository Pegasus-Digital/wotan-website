'use client'

import { useState } from 'react'

import { AttributeType } from '@/payload/payload-types'

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

import { CreateAttributeForm } from './create-attribute-form'

interface CreateAttributeDialogProps {
  types: AttributeType[]
}

export function CreateAttributeDialog({ types }: CreateAttributeDialogProps) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
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
