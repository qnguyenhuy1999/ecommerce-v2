import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Orders } from './Orders'
import { ordersDefaultProps } from './Orders.fixtures'
import type { OrdersStatusTab } from './Orders.types'

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

export const ControlledFilters: Story = {
  render: (args) => {
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState<OrdersStatusTab>('ALL')

    return (
      <ConsoleLayout>
        <Orders {...args} search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} />
      </ConsoleLayout>
    )
  },
}

export const Loading: Story = {
  args: {
    ...ordersDefaultProps,
    loading: true,
  },
  render: (args) => (
    <ConsoleLayout>
      <Orders {...args} />
    </ConsoleLayout>
  ),
}
