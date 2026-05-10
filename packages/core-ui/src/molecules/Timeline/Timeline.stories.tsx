import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline } from '.'

const meta: Meta<typeof Timeline> = {
  title: 'molecules/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Timeline>

const orderItems = [
  { label: 'Order placed', timestamp: 'Apr 20, 14:00', status: 'completed' as const },
  { label: 'Payment confirmed', timestamp: 'Apr 21, 14:01', status: 'completed' as const },
  { label: 'Packed', timestamp: 'Apr 22, 14:02', status: 'completed' as const },
  { label: 'Shipped', timestamp: 'Apr 23, 14:03', status: 'pending' as const },
  { label: 'Delivered', timestamp: 'Apr 24, 14:04', status: 'pending' as const },
]

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <Timeline title="TIMELINE" items={orderItems} />
    </div>
  ),
}

export const AllCompleted: Story = {
  render: () => (
    <div className="w-80">
      <Timeline title="TIMELINE" items={orderItems.map((i) => ({ ...i, status: 'completed' as const }))} />
    </div>
  ),
}

export const NoTitle: Story = {
  render: () => (
    <div className="w-80">
      <Timeline items={orderItems} />
    </div>
  ),
}
