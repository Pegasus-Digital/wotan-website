import { Lead } from '@/components/typography/texts'
import { Page } from '@/payload/payload-types'
import { Heading } from '@/pegasus/heading'

type LowImpactHeroProps = Pick<Page, 'title' | 'description'>

export function LowImpactHero({ title, description }: LowImpactHeroProps) {
  return (
    <div className='w-full'>
      <Heading variant='h1'>{title}</Heading>
      {description && <Lead>{description}</Lead>}
    </div>
  )
}
