import { Lead } from '@/components/typography/texts'
import { Page } from '@/payload/payload-types'
import { Heading } from '@/pegasus/heading'

type LowImpactHeroProps = Pick<Page, 'title' | 'description'>

export function LowImpactHero({ title, description }: LowImpactHeroProps) {
  return (
    <div className='animate-fade-in flex min-h-32 w-fit flex-col justify-center gap-2 text-center'>
      <Heading variant='h1'>{title}</Heading>
      {description && <Lead>{description}</Lead>}
    </div>
  )
}
