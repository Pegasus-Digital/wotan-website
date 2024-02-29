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
        <div className='bg-wotanRed-500 max-w-screen-desktop aspect-[1280/420] grow'></div>
      </div>
    </>
  )
}
