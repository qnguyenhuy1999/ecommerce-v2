import * as React from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Progress } from '../../atoms/Progress'
import { MediaUploadContext, useMediaUpload } from './MediaUpload.context'
import type {
  MediaUploadItemProps,
  MediaUploadProps,
  MediaUploadRootProps,
} from './MediaUpload.types'

function Root({
  items,
  maxItems = 9,
  onAdd,
  onRemove,
  coverIndex = 0,
  accept = 'image/*',
  className,
  children,
}: MediaUploadRootProps) {
  const canAdd = items.length < maxItems

  return (
    <MediaUploadContext.Provider
      value={{ items, maxItems, coverIndex, accept, canAdd, onAdd, onRemove }}
    >
      <div className={cn('flex flex-wrap gap-2', className)}>{children}</div>
    </MediaUploadContext.Provider>
  )
}

function Item({ item, index }: MediaUploadItemProps) {
  const { coverIndex, onRemove } = useMediaUpload()
  const isUploading = typeof item.progress === 'number' && item.progress < 100
  const isCover = index === coverIndex && !isUploading

  return (
    <div className="bg-muted group relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
      <img
        src={item.url}
        alt={item.alt ?? `Media ${index + 1}`}
        className="h-full w-full object-cover"
      />

      {isUploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/50 px-3">
          <span className="text-xs font-semibold text-white">{item.progress}%</span>
          <Progress value={item.progress} className="h-1 w-full" />
        </div>
      )}

      {isCover && (
        <span className="absolute left-1.5 top-1.5 rounded-sm bg-orange-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
          Cover
        </span>
      )}

      {onRemove && !isUploading && (
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

function Items() {
  const { items } = useMediaUpload()

  return (
    <>
      {items.map((item, index) => (
        <Item key={item.id} item={item} index={index} />
      ))}
    </>
  )
}

function AddButton() {
  const { canAdd, accept, onAdd } = useMediaUpload()
  const inputRef = React.useRef<HTMLInputElement>(null)

  if (!canAdd) return null

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="sr-only"
        onChange={(e) => e.target.files && onAdd?.(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="border-border text-muted-foreground hover:border-primary hover:text-primary flex h-32 w-32 flex-shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed transition-colors"
      >
        <Upload className="h-5 w-5" />
        <span className="text-xs">Add</span>
      </button>
    </>
  )
}

export function MediaUploadBase(props: MediaUploadProps) {
  return (
    <Root {...props}>
      <Items />
      <AddButton />
    </Root>
  )
}

type MediaUploadComponent = React.FC<MediaUploadProps> & {
  Root: typeof Root
  Items: typeof Items
  Item: typeof Item
  AddButton: typeof AddButton
}

export const MediaUpload = Object.assign(MediaUploadBase, {
  Root,
  Items,
  Item,
  AddButton,
}) as MediaUploadComponent
