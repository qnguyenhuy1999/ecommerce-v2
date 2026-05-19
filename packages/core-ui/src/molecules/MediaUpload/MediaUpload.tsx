'use client'

import * as React from 'react'
import { withDefined } from '@ecom/shared/utils'
import { Upload, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Progress } from '../../atoms/Progress'
import {
  MediaUploadActionsContext,
  MediaUploadItemsContext,
  useMediaUploadActions,
  useMediaUploadItems,
} from './MediaUpload.context'
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
  const itemsContextValue = React.useMemo(
    () => ({
      items,
      coverIndex,
      ...withDefined({ onRemove }),
    }),
    [coverIndex, items, onRemove],
  )
  const actionsContextValue = React.useMemo(
    () => ({
      maxItems,
      accept,
      canAdd,
      ...withDefined({ onAdd }),
    }),
    [accept, canAdd, maxItems, onAdd],
  )

  return (
    <MediaUploadActionsContext.Provider value={actionsContextValue}>
      <MediaUploadItemsContext.Provider value={itemsContextValue}>
        <div className={cn('flex flex-wrap gap-2', className)}>{children}</div>
      </MediaUploadItemsContext.Provider>
    </MediaUploadActionsContext.Provider>
  )
}

function Item({ item, index }: MediaUploadItemProps) {
  const { coverIndex, onRemove } = useMediaUploadItems()
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
        <div className="bg-foreground/50 absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-3">
          <span className="text-background text-xs font-semibold">{item.progress}%</span>
          <Progress value={item.progress} className="h-1 w-full" />
        </div>
      )}

      {isCover && (
        <span className="bg-primary text-primary-foreground absolute top-1.5 left-1.5 rounded-sm px-1.5 py-0.5 text-[10px] leading-none font-semibold">
          Cover
        </span>
      )}

      {onRemove && !isUploading && (
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="bg-foreground/50 text-background hover:bg-foreground/70 absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

function Items() {
  const { items } = useMediaUploadItems()

  return (
    <>
      {items.map((item, index) => (
        <Item key={item.id} item={item} index={index} />
      ))}
    </>
  )
}

function AddButton() {
  const { canAdd, accept, onAdd } = useMediaUploadActions()
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
