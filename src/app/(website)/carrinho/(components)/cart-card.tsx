'use client'

import { toast } from 'sonner'

import { CartItem } from '@/components/cart-store'
import { useCartStore } from '@/components/cart-store-provider'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Heading } from '@/pegasus/heading'
import { Lead } from '@/components/typography/texts'

import { Trash } from 'lucide-react'

export function CartCard({ productId, amount, attributes }: CartItem) {
  const { remove } = useCartStore((state) => state)

  function handleRemoveFromCart() {
    remove({ productId, amount, attributes })

    toast('Item removido do carrinho.', {
      icon: <Trash className='h-5 w-5' />,
    })
  }

  return (
    <Card>
      <CardHeader>
        <Heading variant='h3'>{productId}</Heading>
      </CardHeader>
      <CardContent>
        <Lead>Amount: {amount}</Lead>

        <div>
          {attributes.length > 0 ? (
            <>
              <Lead>Attributes:</Lead>

              {attributes.map((attribute, index) => (
                <div key={attribute.id + '-' + index} className='mt-4'>
                  <Lead>Attribute ID: {attribute.id}</Lead>
                  <Lead>Attribute Title: {attribute.title}</Lead>
                  <Lead>Attribute Type: {attribute.type}</Lead>
                  <Lead>Attribute Value: {attribute.value}</Lead>
                </div>
              ))}
            </>
          ) : (
            <>
              <Lead>No attributes selected.</Lead>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant='destructive' onClick={handleRemoveFromCart} size='sm'>
          <Trash className='mr-2 h-5 w-5' /> Remover
        </Button>
      </CardFooter>
    </Card>
  )
}
