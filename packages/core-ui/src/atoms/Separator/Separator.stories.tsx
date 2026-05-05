import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from '.'

const meta: Meta<typeof Separator> = {
  title: 'atoms/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Separator>

export const Default: Story = {
  render: () => <Separator className="w-60" />,
}
