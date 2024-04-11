import Loading from '@/app/loading'
import { AdminAuthProvider } from '@/components/admin-auth-provider'
import ToasterParams from '@/components/render-params'
import { Sidebar } from '@/components/sidebar'
import { PegasusStamp } from '@/pegasus/pegasus-stamp'
import { Suspense } from 'react'
import { Toaster } from 'sonner'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <section className='flex min-h-screen w-full flex-col'>
      <Suspense fallback={<Loading />}>
        <AdminAuthProvider>
          <div className=' mb-16 grid w-full grow grid-cols-dashboard gap-6 px-4 py-4'>
            <Sidebar />
            {children}
          </div>
        </AdminAuthProvider>
        <footer className='fixed bottom-0 left-0 right-0 z-50 w-full bg-wotanRed-500'>
          <PegasusStamp />
        </footer>
        <ToasterParams />
        <Toaster richColors closeButton theme='light' />
      </Suspense>
    </section>
  )
}
