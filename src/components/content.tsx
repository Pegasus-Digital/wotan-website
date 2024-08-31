import { cn } from '@/lib/utils'
import { H1 } from './typography/headings'
import { Lead } from './typography/texts'
import { Heading } from '@/pegasus/heading'

type ContentProps = React.ComponentProps<'div'>

export function Content({ className, ref, ...props }: ContentProps) {
  return <div className={cn('w-full', className)} ref={ref} {...props} />
}

type ContentHeaderProps = React.ComponentProps<'section'> & {
  title: string
  description: string
}

export function ContentHeader({
  title,
  description,
  className,
  ...props
}: ContentHeaderProps) {
  return (
    <section
      className={cn('mb-1 flex flex-col py-1 text-primary', className)}
      {...props}
    >
      <Heading variant='h2'>{title}</Heading>
      <Lead className='text-lg'>{description}</Lead>
    </section>
  )
}
