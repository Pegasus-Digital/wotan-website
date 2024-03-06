'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { NewEstimateForm } from './new-estimate-form'
import { Large } from '@/components/typography/texts'

export function NewEstimateDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Novo orçamento
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-screen-lg'>
        <DialogHeader>
          <DialogTitle>Criando novo orçamento</DialogTitle>
        </DialogHeader>

        <NewEstimateForm />
      </DialogContent>
    </Dialog>
  )
}
