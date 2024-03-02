import { Page } from '@/payload/payload-types'

// type HeroProps = Extract<
//   Page['hero'],
//   { blockType: 'client-grid' }
// > & {
//   id?: string
// }

export default function Hero() {
  return (
    <>
      <div className='flex  w-full items-center justify-center bg-slate-500'>
        <div className='aspect-[1280/420] max-w-screen-desktop grow bg-wotanRed-500'></div>
      </div>
    </>
  )
}
