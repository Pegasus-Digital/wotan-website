import { Sidebar } from '@/components/sidebar'
import { Toaster } from 'sonner'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <section className='min-h-screen w-full'>
      <div className='grid w-full grid-cols-dashboard gap-6 px-16 py-4'>
        <Sidebar />

        {children}
      </div>
      <Toaster richColors closeButton theme='light' />
    </section>
  )
}
