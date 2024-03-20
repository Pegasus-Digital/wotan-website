import { FeaturedSection } from '@/payload/payload-types'
import { Lead } from '../../components/typography/texts'
import { Heading } from '@/pegasus/heading'
import { BentoGrid, BentoGridItem } from '@/pegasus/bento-grid'
import { Image } from '@/components/media/image'

type FeaturedGridProps = FeaturedSection & {
  id?: string
}
export default function FeaturedGrid({
  title,
  description,
  cards,
}: FeaturedGridProps) {
  return (
    <section className='w-full overflow-x-hidden overflow-y-clip'>
      <div className='container flex w-full flex-col items-center space-y-2'>
        <div className='mb-3 flex flex-col gap-2 text-center'>
          <Heading variant='h2'>{title}</Heading>
          <Lead>{description}</Lead>
        </div>
        <BentoGrid className='max-w-desktop mx-auto  py-4'>
          {cards.map((card, index) => {
            return (
              <BentoGridItem
                title={card.title}
                description={card.description}
                key={index}
                image={
                  <Image
                    resource={card.image}
                    imgClassName='bg-white w-full h-full '
                  />
                }
                className={` tablet:col-span-2 ${index === 0 ? 'desktop:row-span-2' : index !== 3 && ' desktop:col-span-1'}`}
                linkTo={getSlug({ ...card })}
              />
            )
          })}
        </BentoGrid>
      </div>
    </section>
  )
}

function getSlug({ linkTo }: FeaturedGridProps['cards'][0]) {
  if (typeof linkTo.value === 'object' && linkTo.value.slug) {
    if (linkTo.relationTo === 'products') {
      return `produtos/${linkTo.value.slug}`
    } else if (linkTo.relationTo === 'categories') {
      return `categorias/${linkTo.value.slug}`
    }

  }
  return 'nao-encontrado'
}
