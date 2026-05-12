import { Badge } from '@ecom/core-ui'
import type { BadgeProps } from '@ecom/core-ui'

import { cn } from '../../lib/utils'
import {
  mappingLabel,
  productStatusPillVariants,
  type ProductStatusPillVariantProps,
} from './ProductStatusPill.fixtures'

type ProductStatusPillProps = React.ComponentProps<'span'> &
  ProductStatusPillVariantProps &
  Omit<BadgeProps, 'variant'>

export function ProductStatusPill({ variant, className, ...props }: ProductStatusPillProps) {
  return (
    <Badge className={cn(productStatusPillVariants({ variant }), className)} {...props}>
      {variant ? (
        <span className="inline-flex items-center gap-1 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {mappingLabel[variant]}
        </span>
      ) : null}
    </Badge>
  )
}
