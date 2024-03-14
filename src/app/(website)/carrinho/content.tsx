import { Heading } from '@/pegasus/heading'
import { CartDisplay } from './(components)/cart-display'

export function CartContent() {
  return (
    <section className='relative mt-6 w-full px-6'>
      <div className='container flex flex-col items-center rounded-lg'>
        <Heading>Carrinho</Heading>

        <CartDisplay />
      </div>
    </section>
  )
}
