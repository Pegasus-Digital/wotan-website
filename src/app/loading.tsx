import WotanLogo from '@/components/logo-wotan'
import { LoadingSpinner } from '@/components/spinner'

export default function Loading() {
  return (
    <div className='flex h-screen w-screen items-center justify-center transition'>
      <div className='flex flex-col items-center gap-8'>
        <WotanLogo className='h-48 w-48' />

        <LoadingSpinner />
      </div>
    </div>
  )
}
