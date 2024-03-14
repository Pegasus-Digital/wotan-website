'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/payload/payload-types'

import { toast } from 'sonner'

import { CartItem } from '@/components/cart-store'
import { useCartStore } from '@/components/cart-store-provider'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import { Heading } from '@/pegasus/heading'
import { Lead, Muted } from '@/components/typography/texts'

import { Trash } from 'lucide-react'
import { H2 } from '@/components/typography/headings'

interface CartCardProps {
  cartItem: CartItem
  product?: Product
}

export function CartCard({ cartItem, product }: CartCardProps) {
  const { remove, update } = useCartStore((state) => state)

  const [amount, setAmount] = useState(cartItem.amount)
  const [attributes, setAttributes] = useState(cartItem.attributes)

  function handleRemoveFromCart() {
    remove({ productId: cartItem.productId, amount, attributes })

    toast('Item removido do carrinho.', {
      icon: <Trash className='h-5 w-5' />,
    })
  }

  // Eu odeio essa função na mesma intensidade que eu odeio contato social.
  // obs.: muito
  function handleAmountChange(e: React.MouseEvent<HTMLButtonElement>) {
    const value = e.currentTarget.innerText

    switch (value) {
      case '-10':
        if (amount - 10 < product.minimumQuantity) {
          toast.warning(
            `Quantidade mínima deste produto é de ${product.minimumQuantity} unidades.`,
          )
          return
        }
        setAmount(amount - 10)
        update(cartItem, { ...cartItem, amount: amount - 10 })
        break
      case '-1':
        if (amount - 1 < product.minimumQuantity) {
          toast.warning(
            `Quantidade mínima deste produto é de ${product.minimumQuantity} unidades.`,
          )
          return
        }
        setAmount(amount - 1)
        update(cartItem, { ...cartItem, amount: amount - 1 })
        break
      case '+1':
        setAmount(amount + 1)
        update(cartItem, { ...cartItem, amount: amount + 1 })
        break
      case '+10':
        setAmount(amount + 10)
        update(cartItem, { ...cartItem, amount: amount + 10 })
        break
    }
  }

  if (!product) return <H2>Carregando item...</H2>

  return (
    <Card>
      <CardHeader>
        <Heading variant='h3'>{product.title}</Heading>
        <Muted>Código: {product.sku}</Muted>
      </CardHeader>

      <CardContent>
        <div className='flex items-center space-x-1 transition-all'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleAmountChange}
            className='hover:bg-wotanRed-400 hover:text-primary-foreground active:scale-110'
          >
            -10
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleAmountChange}
            className='hover:bg-wotanRed-400 hover:text-primary-foreground active:scale-110'
          >
            -1
          </Button>

          <Input
            className='pointer-events-none max-w-12 bg-wotanRed-400 px-0 text-center text-lg font-bold text-primary-foreground'
            value={amount}
            readOnly
          />

          <Button
            variant='outline'
            size='sm'
            onClick={handleAmountChange}
            className='hover:bg-wotanRed-400 hover:text-primary-foreground active:scale-110'
          >
            +1
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleAmountChange}
            className='hover:bg-wotanRed-400 hover:text-primary-foreground active:scale-110'
          >
            +10
          </Button>
        </div>

        <div>
          {attributes.length > 0 ? (
            <>
              <Lead>Attributes:</Lead>

              {attributes.map((attribute, index) => (
                <div key={attribute.id + '-' + index} className='mt-4'>
                  <Lead>Attribute ID: {attribute.id}</Lead>
                  <Lead>Attribute Title: {attribute.name}</Lead>
                  <Lead>Attribute Type: {String(attribute.type)}</Lead>
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
