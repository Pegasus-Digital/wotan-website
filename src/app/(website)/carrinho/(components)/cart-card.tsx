'use client'

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
import { Media } from '@/components/media'

interface CartCardProps {
  cartItem: CartItem
  product: Product
}

export function CartCard({ cartItem, product }: CartCardProps) {
  const { remove, incrementAmount, decrementAmount } = useCartStore(
    (state) => state,
  )

  console.log(product)

  function onCartRemove() {
    remove(cartItem.id)

    toast.error('Item removido do carrinho.', {
      icon: <Trash className='h-5 w-5' />,
    })
  }

  function onAmountChange(e: React.MouseEvent<HTMLButtonElement>) {
    const type = e.currentTarget.value

    switch (type) {
      case 'increment':
        incrementAmount(cartItem.id, 1)
        break
      case 'decrement':
        cartItem.amount - 1 >= product.minimumQuantity
          ? decrementAmount(cartItem.id, 1)
          : toast.warning(
              `A quantidade mínima deste produto é de ${product.minimumQuantity}`,
            )
        break
      default:
        toast.error('Ocorreu algum erro.')
        break
    }
  }

  if (!product)
    return (
      <Heading variant='h3' className='text-center'>
        Carregando item...
      </Heading>
    )

  return (
    <Card>
      <CardHeader>
        <Heading variant='h3'>{product.title}</Heading>
        {product.featuredImage && (
          <Media
            imgClassName='rounded-md aspect-square'
            resource={product.featuredImage}
            className='aspect-square max-w-48 rounded-full'
          />
        )}

        <Muted>Código: {product.sku}</Muted>
      </CardHeader>

      <CardContent>
        <div className='flex items-center space-x-1 transition-all'>
          <Button
            value='decrement'
            variant='outline'
            size='sm'
            onClick={onAmountChange}
            className='aspect-square text-lg font-semibold hover:bg-wotanRed-400 hover:text-primary-foreground active:scale-110'
          >
            -
          </Button>

          <Input
            className='pointer-events-none max-w-12 bg-wotanRed-400 px-0 text-center text-lg font-bold text-primary-foreground'
            value={cartItem.amount}
            readOnly
          />

          <Button
            value='increment'
            variant='outline'
            size='sm'
            onClick={onAmountChange}
            className='aspect-square text-lg font-semibold hover:bg-wotanRed-400 hover:text-primary-foreground active:scale-110'
          >
            +
          </Button>
        </div>

        <div>
          {cartItem.attributes.length > 0 ? (
            <>
              <Lead>Attributes:</Lead>

              {cartItem.attributes.map((attribute, index) => (
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
        <Button variant='destructive' onClick={onCartRemove} size='sm'>
          <Trash className='mr-2 h-5 w-5' /> Remover
        </Button>
      </CardFooter>
    </Card>
  )
}
