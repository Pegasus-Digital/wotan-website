import { PegasusStamp } from '@/pegasus/pegasus-stamp'

export function Footer() {
  return (
    <>
      <div className='fixed bottom-0 z-20 w-full bg-wotanRed-500/95 shadow backdrop-blur '>
        <PegasusStamp />
      </div>
      <div className='z-20 w-full opacity-0 shadow backdrop-blur'>
        <PegasusStamp />
      </div>
    </>
  )
}
