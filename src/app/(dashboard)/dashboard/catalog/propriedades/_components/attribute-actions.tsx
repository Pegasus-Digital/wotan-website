'use client'

import { Attribute, AttributeType } from '@/payload/payload-types'

import { toast } from 'sonner'

import { Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { UpdateAttributeDialog } from './update-attribute-dialog'

import { deleteAttribute } from '../_logic/actions'

interface AttributeActionsProps {
  attribute: Attribute
  types: AttributeType[]
}

export function AttributeActions({ attribute, types }: AttributeActionsProps) {
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
      <UpdateAttributeDialog attribute={attribute} types={types} />

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
