import { Lead } from '@/components/typography/texts'
import { ThreeColumns as ThreeColumnsProps } from '@/payload/payload-types'
import { Heading } from '@/pegasus/heading'
import { Eye, Gem, Rocket } from 'lucide-react'

export default function ThreeColumns({
  title,
  description,
  mission,
  vision,
  values,
}: ThreeColumnsProps) {
  return (
    <section className='w-full overflow-x-hidden overflow-y-clip'>
      <div className='container flex w-full flex-col items-center space-y-2'>
        <div className='mb-3 flex flex-col gap-2 text-center'>
          <Heading variant='h2'>{title}</Heading>
          <Lead>{description}</Lead>
        </div>
        <div className='mt-12'>
          <ul className='grid gap-x-12 gap-y-6 tablet:grid-cols-3'>
            <CardWithICon
              icon={<Rocket className='h-14 w-14' />}
              title={mission.title}
              description={mission.description}
            />
            <CardWithICon
              icon={<Eye className='h-14 w-14' />}
              title={vision.title}
              description={vision.description}
            />
            <CardWithICon
              icon={<Gem className='h-14 w-14' />}
              title={values.title}
              description={values.description}
            />
          </ul>
        </div>
      </div>
    </section>
  )
}

type CardWithIConProps = Pick<
  ThreeColumnsProps['values'],
  'title' | 'description'
> & {
  icon: JSX.Element
}

function CardWithICon({ icon, title, description }: CardWithIConProps) {
  return (
    <li className='space-y-4'>
      <div className='mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-wotanRed-50 text-center text-wotanRed-500'>
        {icon}
      </div>
      <div className='mb-3 flex flex-col gap-2 text-center'>
        <Heading variant='h3'>{title}</Heading>
        <Lead>{description}</Lead>
      </div>
    </li>
  )
}
