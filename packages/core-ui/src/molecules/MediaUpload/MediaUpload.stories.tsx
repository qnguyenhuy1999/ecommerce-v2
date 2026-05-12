/* eslint-disable sonarjs/pseudo-random, sonarjs/no-nested-functions */
import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MediaUpload } from './MediaUpload'
import type { MediaItem } from './MediaUpload.types'

const meta: Meta<typeof MediaUpload> = {
  title: 'molecules/MediaUpload',
  component: MediaUpload,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof MediaUpload>

const mockItems: MediaItem[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
    alt: 'Headphones',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
    alt: 'Headphones 2',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
    alt: 'Headphones 3',
  },
]

export const Default: Story = {
  args: {
    items: mockItems,
    maxItems: 9,
  },
}

export const WithProgress: Story = {
  args: {
    items: [
      ...mockItems,
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
        progress: 60,
      },
    ],
    maxItems: 9,
  },
}

export const Empty: Story = {
  args: {
    items: [],
    maxItems: 9,
  },
}

export const MaxReached: Story = {
  args: {
    items: mockItems,
    maxItems: 3,
  },
}

export const Composed: Story = {
  render: () => (
    <MediaUpload.Root items={mockItems} maxItems={9} coverIndex={1}>
      <MediaUpload.Items />
      <MediaUpload.AddButton />
    </MediaUpload.Root>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [items, setItems] = React.useState<MediaItem[]>(mockItems)

    const handleAdd = (files: FileList) => {
      const newItems: MediaItem[] = Array.from(files).map((file) => ({
        id: String(Date.now() + Math.random()),
        url: URL.createObjectURL(file),
        progress: 0,
        alt: file.name,
      }))
      setItems((prev) => [...prev, ...newItems])

      // Simulate upload progress
      for (const item of newItems) {
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
    }

    const handleRemove = (id: string) => {
      setItems((prev) => prev.filter((i) => i.id !== id))
    }

    return <MediaUpload items={items} maxItems={9} onAdd={handleAdd} onRemove={handleRemove} />
  },
}
