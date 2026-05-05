import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '.'

const meta: Meta<typeof Checkbox> = {
  title: 'atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  render: () => <Checkbox defaultChecked />,
}

export const Disabled: Story = {
  render: () => <Checkbox defaultChecked disabled />,
}
