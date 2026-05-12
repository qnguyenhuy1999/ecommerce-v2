import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProductMediaUpload } from './ProductMediaUpload'
import type { MediaItem } from './ProductMediaUpload'

const meta: Meta<typeof ProductMediaUpload> = {
  title: 'Molecules/ProductMediaUpload',
  component: ProductMediaUpload,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof ProductMediaUpload>

const mockItems: MediaItem[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
  { id: '2', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
  { id: '3', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
]

export const Default: Story = {
  args: {
    items: mockItems,
    maxItems: 9,
  },
}

export const WithUploadProgress: Story = {
  args: {
    items: [
      ...mockItems,
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
        progress: 65,
      },
    ],
    maxItems: 9,
  },
}

export const simulateUpload = (item: MediaItem, setItems: React.Dispatch<React.SetStateAction<MediaItem[]>>) => {
  let progress = 0
  const interval = setInterval(() => {
    progress += 20
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, progress } : i)))
    if (progress >= 100) {
      clearInterval(interval)
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, progress: undefined } : i)))
    }
  }, 300)
}

export const Interactive: Story = {
  render: () => {
    const [items, setItems] = React.useState<MediaItem[]>(mockItems)

    const handleAdd = (files: FileList) => {
      const newItems: MediaItem[] = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        progress: 0,
      }))
      setItems((prev) => [...prev, ...newItems])

      for (const item of newItems) {
        simulateUpload(item, setItems)
      }
    }

    const handleRemove = (id: string) => {
      setItems((prev) => prev.filter((i) => i.id !== id))
    }

    return (
      <div className="w-[600px]">
        <ProductMediaUpload items={items} maxItems={9} onAdd={handleAdd} onRemove={handleRemove} />
      </div>
    )
  },
}
