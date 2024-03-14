import { Page } from '@/payload/payload-types'
import { H1 } from '../../components/typography/headings'
import { Lead } from '../../components/typography/texts'
import { Heading } from '@/pegasus/heading'
import { BentoGrid, BentoGridItem } from '@/pegasus/bento-grid'

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
        <BentoGrid className='max-w-desktop mx-auto py-4 md:auto-rows-[20rem]'>
          <BentoGridItem
            title='Item 1'
            description='Item 1'
            header={
              <img
                className='h-full w-full rounded-md object-cover'
                alt='random'
                src='https://source.unsplash.com/random/'
              />
            }
            className='tablet:col-span-2 desktop:row-span-2'
          />
          <BentoGridItem
            title='Item 1'
            description='Item 1'
            header={
              <img
                className='h-full w-full rounded-md  object-cover'
                alt='random'
                src='https://source.unsplash.com/random/'
              />
            }
            className='tablet:col-span-2 desktop:col-span-1 '
          />
          <BentoGridItem
            title='Item 1'
            description='Item 1'
            header={
              <img
                className='h-full w-full rounded-md  object-cover'
                alt='random'
                src='https://source.unsplash.com/random/'
              />
            }
            className='tablet:col-span-2 desktop:col-span-1 '
          />
          <BentoGridItem
            title='Item 1'
            description='Item 1'
            header={
              <img
                className='h-full w-full rounded-md  object-cover'
                alt='random'
                src='https://source.unsplash.com/random/'
              />
            }
            className='tablet:col-span-2 '
          />
        </BentoGrid>
      </div>
    </section>
  )
}
