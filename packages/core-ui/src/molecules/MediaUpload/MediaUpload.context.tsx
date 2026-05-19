'use client'

import { createContext, useContext } from 'react'
import type { MediaItem } from './MediaUpload.types'

type MediaUploadItemsContextValue = {
  items: MediaItem[]
  coverIndex: number
  onRemove?: (id: string) => void
}

type MediaUploadActionsContextValue = {
  maxItems: number
  accept: string
  canAdd: boolean
  onAdd?: (files: FileList) => void
}

export const MediaUploadItemsContext = createContext<MediaUploadItemsContextValue | null>(null)
export const MediaUploadActionsContext = createContext<MediaUploadActionsContextValue | null>(null)

export function useMediaUploadItems() {
  const ctx = useContext(MediaUploadItemsContext)
  if (!ctx) {
    throw new Error('MediaUpload components must be used within <MediaUpload.Root>')
  }
  return ctx
}

export function useMediaUploadActions() {
  const ctx = useContext(MediaUploadActionsContext)
  if (!ctx) {
    throw new Error('MediaUpload components must be used within <MediaUpload.Root>')
  }
  return ctx
}
