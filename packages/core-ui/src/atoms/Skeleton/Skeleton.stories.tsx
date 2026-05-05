import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from '.'

const meta: Meta<typeof Skeleton> = {
  title: 'atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-60" />,
}
