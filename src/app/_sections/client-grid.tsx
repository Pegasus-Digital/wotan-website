import { Media } from '@/components/media'
import { H1 } from '@/components/typography/headings'
import { Lead } from '@/components/typography/texts'
import { Page, ClientGrid as ClientGridType } from '@/payload/payload-types'
import { Heading } from '@/pegasus/heading'

type ClientGridProps = ClientGridType & {
  id?: string
}

export default function ClientGrid({
  title,
  description,
  clients,
}: ClientGridProps) {
  return (
    <section className='w-full overflow-hidden'>
      <div className='container flex flex-col items-center justify-center pb-6'>
        <div className='mb-3 flex flex-col gap-2 text-center'>
          <Heading variant='h2'>{title}</Heading>
          <Lead>{description}</Lead>
        </div>
        <div className='grid max-w-screen-desktop grid-cols-2 gap-4 tablet:grid-cols-4 tablet:gap-8 desktop:grid-cols-5'>
          {clients.map((client, index) => (
            <Media
              key={index}
              resource={client.logo}
              className='m-2 aspect-square h-full max-h-48 max-w-48  rounded-md bg-white object-cover p-2 shadow-wotan-light'
            />
          ))}
        </div>
      </div>
    </section>
  )
}
