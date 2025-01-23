import React from 'react'
import { Suspense } from 'react'

import { Toaster } from 'sonner'

import ToasterParams from '@/components/render-params'
import { PegasusStamp } from '@/pegasus/pegasus-stamp'
import { SalesAuthProvider } from '@/components/sales-auth-provider'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <SalesAuthProvider>
      <div className='flex min-h-screen w-full flex-col '>
        <div className='flex flex-1 items-center justify-center'>
          {children}
        </div>
        <div className=' w-full bg-wotanRed-500'>
          <PegasusStamp />
        </div>
      </div>

      <ToasterParams />
      <Toaster richColors closeButton theme='light' />
    </SalesAuthProvider>
  )
}
