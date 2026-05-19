import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { OrderDetail } from './OrderDetail'

const meta: Meta<typeof OrderDetail> = {
  title: 'pages/OrderDetail',
  component: OrderDetail,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof OrderDetail>

export const Default: Story = {
  render: (args) => (
    <ConsoleLayout>
      <OrderDetail {...args} />
    </ConsoleLayout>
  ),
}
