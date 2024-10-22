import { Suspense } from 'react'

import { Toaster } from 'sonner'

import ToasterParams from '@/components/render-params'
import { AdminAuthProvider } from '@/components/admin-auth-provider'
import PanelLayout from '@/components/painel-sistema/panel-layout'
import { PegasusStamp } from '@/pegasus/pegasus-stamp'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    // <section className='flex min-h-screen w-full flex-col'>
    <>
      {/* <Suspense fallback={<Loading />}> */}
      <AdminAuthProvider>
        <PanelLayout>{children}</PanelLayout>
      </AdminAuthProvider>

      <ToasterParams />
      <Toaster richColors closeButton theme='light' />
      {/* </Suspense> */}
    </>
    // </section>
  )
}
