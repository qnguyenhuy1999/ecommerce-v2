import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '.'
import { Plus } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  render: () => <Button>Add to Cart</Button>,
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="default">Default</Button>
        <Button variant="default" disabled>
          Disabled
        </Button>
        <Button variant="default" loading>
          Loading
        </Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex items-center gap-4">
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">
          <Plus />
        </Button>
        <Button size="icon-xs">
          <Plus />
        </Button>
        <Button size="icon-sm">
          <Plus />
        </Button>
        <Button size="icon-lg">
          <Plus />
        </Button>
      </div>
    </div>
  ),
}
