import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '.'

const meta: Meta<typeof Label> = {
  title: 'atoms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  render: () => <Label htmlFor="email">Email</Label>,
}
