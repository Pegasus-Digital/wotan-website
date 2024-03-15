import { Sidebar } from '@/components/sidebar'

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
    </section>
  )
}
