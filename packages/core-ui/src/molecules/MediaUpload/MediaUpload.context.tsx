import { createContext, useContext } from 'react'
import type { MediaItem } from './MediaUpload.types'

type MediaUploadContextValue = {
  items: MediaItem[]
  maxItems: number
  coverIndex: number
  accept: string
  canAdd: boolean
  onAdd?: (files: FileList) => void
  onRemove?: (id: string) => void
}

export const MediaUploadContext = createContext<MediaUploadContextValue | null>(null)

export function useMediaUpload() {
  const ctx = useContext(MediaUploadContext)
  if (!ctx) {
    throw new Error('MediaUpload components must be used within <MediaUpload.Root>')
  }
  return ctx
}
