import { Page } from '@/payload/payload-types'
import { H1 } from '../../components/typography/headings'
import { Lead } from '../../components/typography/texts'
import { Heading } from '@/pegasus/heading'

type FeaturedGridProps = Extract<
  Page['layout'][0],
  { blockType: 'featured-grid' }
> & {
  id?: string
}
export default function FeaturedGrid({
  title,
  description,
}: FeaturedGridProps) {
  return (
    <section className='w-full overflow-x-hidden'>
      <div className='container flex w-full flex-col items-center space-y-2'>
        <div className='mb-3 flex flex-col gap-2 text-center'>
          <Heading variant='h2'>{title}</Heading>
          <Lead>{description}</Lead>
        </div>

        <div className='grid max-w-96 grid-cols-1 grid-rows-4 gap-4 tablet:max-h-96 tablet:max-w-none tablet:grid-cols-4 tablet:grid-rows-2'>
          <div className='tablet:col-span-2 tablet:row-span-2 '>
            <img
              className='aspect-square h-full w-full rounded-md object-cover'
              alt='random'
              src='https://source.unsplash.com/random/'
            />
          </div>
          <div className='tablet:col-start-3'>
            <img
              className='aspect-square h-full w-full rounded-md object-cover'
              alt='random'
              src='https://source.unsplash.com/random/'
            />
          </div>
          <div className='tablet:col-start-4 '>
            <img
              className='aspect-square h-full  w-full rounded-md object-cover'
              alt='random'
              src='https://source.unsplash.com/random/'
            />
          </div>
          <div className='tablet:col-span-2 tablet:col-start-3 tablet:row-start-2'>
            <img
              className='aspect-square h-full w-full rounded-md object-cover'
              alt='random'
              src='https://source.unsplash.com/random/'
            />
          </div>
        </div>
      </div>
    </section>
  )
}
