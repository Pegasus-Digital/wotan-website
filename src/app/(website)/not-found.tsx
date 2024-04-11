import { Button } from '@/pegasus/button'
import { Heading } from '@/pegasus/heading'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='mx-auto flex min-h-96 max-w-screen-xl grow flex-col items-center justify-center  px-4 md:px-8'>
      <div className='mx-auto max-w-lg space-y-3 text-center'>
        {/* <Heading variant='h2'>Erro 404</Heading> */}
        <Heading variant='h2' className='leading-normal '>
          Página não encontrada
        </Heading>
        <p className='text-gray-600'>
          Ops, parece que o brinde que você está procurando não foi encontrado.
        </p>
        <div className='flex flex-wrap items-center justify-center gap-3'>
          <Button size='lg' variant='default' asChild>
            <Link href='/'>Voltar para o Início</Link>
          </Button>
          <Button size='lg' variant='outline' asChild>
            <Link href='/contato'>Entrar em contato</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
