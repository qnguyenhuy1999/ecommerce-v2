import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Orders } from './Orders'

const meta: Meta<typeof Orders> = {
  title: 'pages/Orders',
  component: Orders,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof Orders>

export const Default: Story = {
  render: (args) => (
    <ConsoleLayout>
      <Orders {...args} />
    </ConsoleLayout>
  ),
}
