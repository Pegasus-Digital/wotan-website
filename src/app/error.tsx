'use client'

import { useEffect } from 'react'
import { Button } from '@/pegasus/button'
import { Heading } from '@/pegasus/heading'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <div className='mx-auto flex min-h-screen max-w-screen-xl flex-col items-center justify-center px-4 py-8'>
      <div className='mx-auto max-w-lg space-y-4 text-center'>
        <Heading variant='h2' className='leading-normal'>
          Algo deu errado
        </Heading>
        <p className='text-gray-600'>
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className='mt-4 rounded-lg bg-red-50 p-4 text-left'>
            <p className='font-mono text-sm text-red-800'>
              {error.message}
            </p>
            {error.stack && (
              <pre className='mt-2 overflow-auto text-xs text-red-700'>
                {error.stack}
              </pre>
            )}
            {error.digest && (
              <p className='mt-2 text-xs text-red-600'>
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
        <div className='flex flex-wrap items-center justify-center gap-3'>
          <Button size='lg' variant='default' onClick={reset}>
            Tentar novamente
          </Button>
          <Button
            size='lg'
            variant='outline'
            onClick={() => (window.location.href = '/')}
          >
            Voltar para o início
          </Button>
        </div>
      </div>
    </div>
  )
}

