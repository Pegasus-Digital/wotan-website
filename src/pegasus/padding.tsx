import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'

import { cn } from '../lib/utils'

const paddingSizes = cva('', {
  variants: {
    top: {
      large: 'pt-8',
      medium: 'pt-4',
      small: 'pt-2',
      none: 'pt-0',
    },
    bottom: {
      large: 'pb-8',
      medium: 'pb-4',
      small: 'pb-2',
      none: 'pb-0',
    },
  },
})

export interface VerticalPaddingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paddingSizes> {}

const VerticalPadding = React.forwardRef<HTMLDivElement, VerticalPaddingProps>(
  (
    { className, top = 'medium', bottom = 'medium', children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(paddingSizes({ top, bottom }), className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)
VerticalPadding.displayName = 'VerticalPadding'

export { VerticalPadding }
