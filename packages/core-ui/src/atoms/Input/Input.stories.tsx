import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'atoms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  render: () => <Input value="Default value" />,
}

export const WithPlaceholder: Story = {
  render: () => <Input placeholder="Enter your text here" />,
}

export const Disabled: Story = {
  render: () => <Input value="Disabled input" disabled />,
}
