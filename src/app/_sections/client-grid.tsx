import { Media } from '@/components/media'
import { H1 } from '@/components/typography/headings'
import { Lead } from '@/components/typography/texts'
import { Page } from '@/payload/payload-types'

type ClientGridProps = Extract<
  Page['layout'][0],
  { blockType: 'client-grid' }
> & {
  id?: string
}

export default function ClientGrid({
  title,
  description,
  clients,
}: ClientGridProps) {
  return (
    <section className='my-6 w-full overflow-hidden'>
      <div className='container flex flex-col items-center justify-center pb-6'>
        <div className='mb-3 flex flex-col gap-2 text-center'>
          <H1 className='text-wotanRed-500'>{title}</H1>
          <Lead>{description}</Lead>
        </div>
        <div className='tablet:grid-cols-4 desktop:grid-cols-5 tablet:gap-8 max-w-screen-desktop grid grid-cols-2 gap-4'>
          {clients.map((client, index) => (
            <Media
              key={index}
              resource={client.logo}
              className='shadow-wotan-light m-2 aspect-square h-full max-h-48  max-w-48 rounded-md object-cover p-2'
            />
          ))}
        </div>
      </div>
    </section>
  )
}
