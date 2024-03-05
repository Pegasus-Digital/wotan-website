import { cn } from '@/lib/utils'

type ContentProps = React.ComponentProps<'div'>

export function Content({ className, ref, ...props }: ContentProps) {
  return <div className={cn('w-full', className)} ref={ref} {...props} />
}
