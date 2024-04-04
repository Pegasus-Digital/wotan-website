'use client'

import { Attribute } from '@/payload/payload-types'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { Pencil, Trash } from 'lucide-react'

import { deleteAttribute } from '../_logic/actions'

interface AttributeActionsProps {
  attribute: Attribute
}

export function AttributeActions({ attribute }: AttributeActionsProps) {
  async function handleDeleteAttribute() {
    const response = await deleteAttribute(attribute.id)

    if (response.status === true) {
      toast.success(response.message)
    }

    if (response.status === false) {
      toast.error(response.message)
    }
  }

  return (
    <div className='flex gap-2'>
      <Button variant='outline' size='icon' className='h-6 w-6'>
        <Pencil className='h-4 w-4' />
      </Button>

      <Button
        onClick={handleDeleteAttribute}
        variant='outline'
        size='icon'
        className='h-6 w-6'
      >
        <Trash className='h-4 w-4' />
      </Button>
    </div>
  )
}
