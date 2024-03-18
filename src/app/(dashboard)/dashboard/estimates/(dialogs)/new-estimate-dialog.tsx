'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { NewEstimateForm } from './new-estimate-form'

export async function NewEstimateDialog() {
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

        <ScrollArea className='max-h-[736px] px-2'>
          <NewEstimateForm />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
