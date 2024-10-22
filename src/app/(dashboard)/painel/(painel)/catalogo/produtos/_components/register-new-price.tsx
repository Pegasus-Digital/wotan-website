'use client'

import { useState } from 'react'

import { z } from 'zod'
import { toast } from 'sonner'

import { Icons } from '@/components/icons'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface RegisterNewPrice {
  addPrice: ({
    quantity,
    unitPrice,
  }: {
    quantity: number
    unitPrice: number
  }) => void
}

const schema = z.object({
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
})

export function RegisterNewPrice({ addPrice }: RegisterNewPrice) {
  const [createMode, toggleCreateMode] = useState<boolean>(false)

  const [quantity, setQuantity] = useState<string>('')
  function onQuantityChange(event: any) {
    setQuantity(event.target.value)
  }

  const [unitPrice, setUnitPrice] = useState<string>('')
  function onUnitPriceChange(event: any) {
    setUnitPrice(event.target.value)
  }

  function handleDone(event: any) {
    event.preventDefault()

    const result = schema.safeParse({
      quantity: parseInt(quantity),
      unitPrice: parseInt(unitPrice),
    })

    if (result.success) {
      addPrice({
        quantity: result.data.quantity,
        unitPrice: result.data.unitPrice,
      })
      toggleCreateMode(false)
    }

    if (!result.success) {
      toast.error(
        'Não foi possível atualizar a tabela, verifique se os dados estão inseridos corretamente.',
      )
    }
  }

  return (
    <Card className='space-y-2.5 border-none px-2.5 py-2'>
      {createMode ? (
        <div className='flex items-end gap-2.5'>
          <div>
            <Label>A partir de x produtos</Label>
            <Input
              min={0}
              type='number'
              onChange={onQuantityChange}
              placeholder='Insira a quantidade'
            />
          </div>
          <div>
            <Label>O preço unitário passa a ser y</Label>
            <Input
              min={0}
              type='number'
              onChange={onUnitPriceChange}
              placeholder='Insira o valor unitário'
            />
          </div>
          <Button
            size='icon'
            type='button'
            onClick={handleDone}
            className='flex gap-1.5'
          >
            <Icons.Check className='h-5 w-5' />
          </Button>
        </div>
      ) : (
        <Button
          type='button'
          onClick={() => toggleCreateMode(true)}
          className='flex gap-1.5'
        >
          <Icons.Add />
          Adicionar
        </Button>
      )}
    </Card>
  )
}
