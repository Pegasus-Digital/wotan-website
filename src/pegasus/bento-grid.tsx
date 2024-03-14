import { cn } from '@/lib/utils'

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'mx-auto grid w-full grid-cols-1 gap-4 bg-transparent tablet:auto-rows-[18rem] tablet:grid-cols-4 ',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'group/bento relative row-span-1 flex flex-col justify-between space-y-4 overflow-hidden rounded-md border border-transparent shadow-input transition duration-200 hover:shadow-wotan-light',
        className,
      )}
    >
      {header}
      <div className='absolute bottom-4 left-4 text-background transition duration-200 group-hover/bento:translate-x-2'>
        <div className='text-xl font-bold'>{title}</div>
        <div className='mt-2 text-base font-normal'>{description}</div>
      </div>
    </div>
  )
}
