import { Metadata } from 'next'
import { CartContent } from './content'

export const metadata: Metadata = {
  title: 'Carrinho',
}

export default async function Cart() {
  return <CartContent />
}
