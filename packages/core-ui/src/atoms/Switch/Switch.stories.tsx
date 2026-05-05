import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from '.'

const meta: Meta<typeof Switch> = {
  title: 'atoms/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: () => <Switch defaultChecked />,
}

export const Disabled: Story = {
  render: () => <Switch defaultChecked disabled />,
}
