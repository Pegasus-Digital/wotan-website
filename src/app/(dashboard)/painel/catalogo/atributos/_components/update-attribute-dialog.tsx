'use client'

import { useState } from 'react'

import { Attribute, AttributeType } from '@/payload/payload-types'

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'

import { Button } from '@/pegasus/button'
import { Icons } from '@/components/icons'
import { Separator } from '@/components/ui/separator'

import { UpdateAttributeForm } from './update-attribute-form'

interface UpdateAttributeDialogProps {
  attribute: Attribute
  types: AttributeType[]
  readonly?: boolean
}

export function UpdateAttributeDialog({
  attribute,
  types,
  readonly = false,
}: UpdateAttributeDialogProps) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={readonly}
          variant='outline'
          size='icon'
          className='h-6 w-6'
        >
          <Icons.Edit className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[832px] w-full max-w-screen-sm'>
        <DialogHeader>
          <DialogTitle>Atualizando atributo</DialogTitle>
          <DialogDescription>
            Atualize as informações a seguir.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <UpdateAttributeForm
          currentAttribute={attribute}
          setOpen={setOpen}
          types={types}
        />
      </DialogContent>
    </Dialog>
  )
}
