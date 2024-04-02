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

export function NewEstimateDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Novo orçamento
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[832px] max-w-screen-lg'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            Criando novo orçamento
          </DialogTitle>
        </DialogHeader>

        <NewEstimateForm />
      </DialogContent>
    </Dialog>
  )
}
