import type { ReactNode } from 'react'

export type MediaItem = {
  id: string
  url: string
  progress?: number
  alt?: string
}

export type MediaUploadProps = {
  items: MediaItem[]
  maxItems?: number
  onAdd?: (files: FileList) => void
  onRemove?: (id: string) => void
  coverIndex?: number
  accept?: string
  className?: string
}

export type MediaUploadRootProps = MediaUploadProps & {
  children?: ReactNode
}

export type MediaUploadItemProps = {
  item: MediaItem
  index: number
}
