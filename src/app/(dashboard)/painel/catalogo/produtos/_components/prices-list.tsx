'use client'

import { useState } from 'react'

import { PriceQuantityTable } from '@/payload/payload-types'

import { z } from 'zod'
import { toast } from 'sonner'

import { Trash2 } from 'lucide-react'

import { Heading } from '@/pegasus/heading'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Small } from '@/components/typography/texts'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { RegisterNewPrice } from './register-new-price'

interface PricesListProps {
  table: PriceQuantityTable
  setPrices: (priceQuantityTable: PriceQuantityTable) => void
  edit?: boolean
}

export function PricesList({
  table = [],
  setPrices,
  edit = false,
}: PricesListProps) {
  const [hasEdited, setHasEdited] = useState<number[]>([])

  function addPrice({
    quantity,
    unitPrice,
  }: {
    quantity: number
    unitPrice: number
  }) {
    const quantityAlreadyExists = table.find(
      (entry) => entry.quantity === quantity,
    )

    const updatedTable = [...table, { quantity, unitPrice }].sort((a, b) => {
      if (a.quantity > b.quantity) {
        return 1
      }
      if (a.quantity < b.quantity) {
        return -1
      }
      return 0
    })

    if (!quantityAlreadyExists) {
      setPrices(updatedTable)
      return toast.success('Entrada adicionada com sucesso.')
    }

    toast.error(
      'Não foi possível adicionar a entrada. Preço unitário para essa quantidade já existe.',
    )
  }

  function removePrice(quantity: number) {
    const updatedTable = table
      .filter((entry) => entry.quantity !== quantity)
      .sort((a, b) => {
        if (a.quantity > b.quantity) {
          return 1
        }
        if (a.quantity < b.quantity) {
          return -1
        }
        return 0
      })

    setPrices(updatedTable)
  }

  // Essa função é provavelmente o maior pedaço de bosta que eu já escrevi em toda minha vida, mas funciona (aparentemente)
  function updatePrice(index: number, quantity: number) {
    const newUnitPrice = parseInt(
      // @ts-ignore
      document.getElementById(`quantity-${quantity}`).value,
    )

    const parseResult = z.number().min(0).safeParse(newUnitPrice)

    if (!parseResult.success) {
      return toast.error(
        'Não foi possível atualizar a tabela, verifique se os dados estão inseridos corretamente.',
      )
    }

    let updatedTable = table.filter((entry) => entry.quantity !== quantity)

    updatedTable = [
      ...updatedTable,
      { quantity, unitPrice: newUnitPrice },
    ].sort((a, b) => {
      if (a.quantity > b.quantity) {
        return 1
      }
      if (a.quantity < b.quantity) {
        return -1
      }
      return 0
    })

    const updatedHasEdited = hasEdited.filter(
      (elementIndex) => elementIndex !== index,
    )

    toast.success('Tabela atualizada com sucesso.')
    setHasEdited(updatedHasEdited)
    setPrices(updatedTable)
  }

  return (
    <div className='flex flex-col gap-2 pt-4'>
      <Heading variant='h5'>Tabela quantidade-preços</Heading>

      {table.length === 0 ? (
        <Small className='text-muted-foreground'>
          A tabela se encontra vazia.
        </Small>
      ) : (
        <Table>
          <TableHeader className='w-full'>
            <TableRow className='w-full'>
              <TableHead>Quantidade</TableHead>
              <TableHead>Preço unitário</TableHead>
              <TableHead className='text-end'>Interações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.map((entry, i) => (
              <TableRow key={entry.quantity}>
                <TableCell className='font-medium'>
                  A partir de {entry.quantity} produtos
                </TableCell>
                <TableCell className='flex items-center gap-2 font-medium'>
                  <Label>R$</Label>
                  <Input
                    disabled={edit}
                    id={`quantity-${entry.quantity}`}
                    className='w-20 font-bold'
                    prefix='R$'
                    defaultValue={entry.unitPrice}
                    onChange={(e) => {
                      if (!hasEdited.includes(i)) {
                        setHasEdited([...hasEdited, i])
                      }
                    }}
                  />
                  {hasEdited.includes(i) && (
                    <Button
                      disabled={edit}
                      type='button'
                      size='sm'
                      onClick={() => updatePrice(i, entry.quantity)}
                    >
                      Salvar
                    </Button>
                  )}
                </TableCell>
                <TableCell className='text-right'>
                  <Button
                    disabled={edit}
                    type='button'
                    size='icon'
                    className='rounded-full'
                    onClick={() => removePrice(entry.quantity)}
                  >
                    <Trash2 className='h-5 w-5' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {!edit && <RegisterNewPrice addPrice={addPrice} />}
    </div>
  )
}
