import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

export const productStatusPillVariants = cva('', {
  variants: {
    variant: {
      pending: 'bg-warning/15 text-warning',
      packing: 'bg-info/15 text-info',
      shipping: 'bg-primary/15 text-primary',
      delivered: 'bg-success/15 text-success',
      cancelled: 'bg-destructive/15 text-destructive',
      refund: 'bg-muted text-muted-foreground',
      active: 'bg-success/15 text-success',
      draft: 'bg-muted text-muted-foreground',
      out: 'bg-destructive/15 text-destructive',
      review: 'bg-warning/15 text-warning',
    },
  },
})

export const mappingLabel = {
  pending: 'Pending',
  packing: 'Packing',
  shipping: 'Shipping',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refund: 'Refund',
  active: 'Active',
  draft: 'Draft',
  out: 'Out of Stock',
  review: 'Review',
}

export type ProductStatusPillVariantProps = VariantProps<typeof productStatusPillVariants>
