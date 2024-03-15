import { PegasusIcon } from '@/pegasus/pegasus-stamp'

export default function Loading() {
  return (
    <div className='flex h-screen w-screen items-center justify-center transition'>
      <PegasusIcon className='h-48 w-48 animate-ping' />
    </div>
  )
}
