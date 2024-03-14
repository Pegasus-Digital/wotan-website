import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '../ui/button'

type BlockquoteProps = React.ComponentProps<'blockquote'>

export function Blockquote({ className, ref, ...props }: BlockquoteProps) {
  return (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      ref={ref}
      {...props}
    />
  )
}

type ParagraphProps = React.ComponentProps<'p'>

export function P({ className, ref, ...props }: ParagraphProps) {
  return (
    <p
      className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
      ref={ref}
      {...props}
    />
  )
}

type ULProps = React.ComponentProps<'ul'>

export function List({ className, ref, ...props }: ULProps) {
  return (
    <ul
      className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}
      ref={ref}
      {...props}
    />
  )
}

type CodeProps = React.ComponentProps<'code'>

export function InlineCode({ className, ref, ...props }: CodeProps) {
  return (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
}

type LargeProps = React.ComponentProps<'div'>

export function Large({ className, ref, ...props }: LargeProps) {
  return (
    <div
      className={cn('text-lg font-semibold', className)}
      ref={ref}
      {...props}
    />
  )
}

type SmallProps = React.ComponentProps<'small'>

export function Small({ className, ref, ...props }: SmallProps) {
  return (
    <small
      className={cn('text-sm font-medium leading-none', className)}
      ref={ref}
      {...props}
    />
  )
}

type MutedProps = React.ComponentProps<'p'>

export function Muted({ className, ref, ...props }: MutedProps) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      ref={ref}
      {...props}
    />
  )
}

type LeadProps = React.ComponentProps<'p'>
export function Lead({ className, ref, ...props }: LeadProps) {
  return (
    <p
      className={cn('text-xl text-muted-foreground', className)}
      ref={ref}
      {...props}
    />
  )
}

interface LinkIconProps extends React.ComponentProps<typeof Link> {
  Icon: React.ElementType
}

export function LinkIcon({ className, ref, Icon, ...props }: LinkIconProps) {
  return (
    <Link
      className={cn(
        buttonVariants({ size: 'icon', variant: 'ghost', className }),
      )}
      href={props.href}
      ref={ref}
      {...props}
    >
      <Icon className='h-5 w-5' />
    </Link>
  )
}

type NavLinkProps = React.ComponentProps<typeof Link>

export function NavLink({ className, ref, ...props }: NavLinkProps) {
  return (
    <Link
      className={cn(
        'text-sm underline-offset-2 hover:text-blue-400 hover:underline',
        className,
      )}
      href={props.href}
      ref={ref}
      {...props}
    />
  )
}
