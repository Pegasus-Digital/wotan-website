import { Suspense } from 'react'

import { Toaster } from 'sonner'

import ToasterParams from '@/components/render-params'
import PanelLayout from '@/components/painel-sistema/panel-layout'
import { SalesAuthProvider } from '@/components/sales-auth-provider'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    // <section className='flex min-h-screen w-full flex-col'>
    <>
      {/* <Suspense fallback={<Loading />}> */}
      <SalesAuthProvider>
        <PanelLayout>{children}</PanelLayout>
      </SalesAuthProvider>

      <ToasterParams />
      <Toaster richColors closeButton theme='light' />
      {/* </Suspense> */}
    </>
    // </section>
  )
}
