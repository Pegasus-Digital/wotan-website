import * as React from 'react'
import { cn } from '@/lib/utils'

type H1Props = React.ComponentProps<'h1'>

export function H1({ className, ref, ...props }: H1Props) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
}

type H2Props = React.ComponentProps<'h2'>

export function H2({ className, ref, ...props }: H2Props) {
  return (
    <h2
      className={cn(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
}

type H3Props = React.ComponentProps<'h3'>

export function H3({ className, ref, ...props }: H3Props) {
  return (
    <h3
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
}

type H4Props = React.ComponentProps<'h4'>

export function H4({ className, ref, ...props }: H4Props) {
  return (
    <h4
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
}
