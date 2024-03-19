import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'

import { cn } from '../lib/utils'

const headingStyles = cva('', {
  variants: {
    variant: {
      h1: 'text-3xl tablet:text-4xl font-extrabold tracking-tight font-heading text-wotanRed-500 desktop:text-5xl ',
      h2: 'text-2xl tablet:text-3xl font-bold tracking-tight font-heading text-wotanRed-500 desktop:text-4xl',
      h3: 'text-xl tablet:text-2xl font-semibold tracking-tight font-heading text-wotanRed-500 desktop:text-3xl',
      h4: 'text-lg tablet:text-xl font-semibold tracking-tight font-heading text-wotanRed-500 desktop:text-2xl',
      h5: 'text-lg font-semibold tracking-tight text-wotanRed-500 desktop:text-xl',
      h6: 'text-base font-semibold tracking-tight text-wotanRed-500 desktop:text-lg',
    },
  },
  defaultVariants: {
    variant: 'h1',
  },
})

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingStyles> {}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant = 'h1', children, ...props }, ref) => {
    const Element = variant!
    return (
      <Element
        ref={ref}
        className={cn(headingStyles({ variant }), className)}
        {...props}
      >
        {children}
      </Element>
    )
  },
)
Heading.displayName = 'Heading'

export { Heading }
