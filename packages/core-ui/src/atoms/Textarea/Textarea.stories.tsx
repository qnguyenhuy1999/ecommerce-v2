import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from '.'

const meta: Meta<typeof Textarea> = {
  title: 'atoms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  render: () => <Textarea placeholder="Write something..." className="w-80" />,
}

export const Disabled: Story = {
  render: () => <Textarea placeholder="Write something..." className="w-80" disabled />,
}
