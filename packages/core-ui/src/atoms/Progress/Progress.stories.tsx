import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from '.'

const meta: Meta<typeof Progress> = {
  title: 'atoms/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  render: () => <Progress value={45} className="w-60" />,
}
