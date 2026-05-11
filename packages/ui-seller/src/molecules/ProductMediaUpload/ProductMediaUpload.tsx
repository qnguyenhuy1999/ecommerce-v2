import { MediaUpload, type MediaItem, type MediaUploadProps } from '@ecom/core-ui'
import { cn } from '../../lib/utils'

type ProductMediaUploadProps = Omit<MediaUploadProps, 'coverIndex'> & {
  className?: string
}

export function ProductMediaUpload({
  items,
  maxItems = 9,
  onAdd,
  onRemove,
  accept,
  className,
}: ProductMediaUploadProps) {
  return (
    <div className={cn('border-border bg-surface rounded-xl border p-4', className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Media</h3>
        <span className="text-muted-foreground text-sm">
          {items.length} of {maxItems} images
        </span>
      </div>
      <MediaUpload
        items={items}
        maxItems={maxItems}
        onAdd={onAdd}
        onRemove={onRemove}
        accept={accept}
      />
    </div>
  )
}

export type { MediaItem }
