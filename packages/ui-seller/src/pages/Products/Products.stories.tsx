import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Products } from './Products'
import { productsDefaultProps } from './Products.fixtures'
import type { ProductsStatusTab } from './Products.types'

const meta: Meta<typeof Products> = {
  title: 'pages/Products',
  component: Products,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof Products>

export const Default: Story = {
  render: (args) => (
    <ConsoleLayout>
      <Products {...args} />
    </ConsoleLayout>
  ),
}

export const ControlledFilters: Story = {
  render: (args) => {
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState<ProductsStatusTab>('ALL')

    return (
      <ConsoleLayout>
        <Products {...args} search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} />
      </ConsoleLayout>
    )
  },
}

export const EmptyState: Story = {
  args: {
    ...productsDefaultProps,
    products: [],
  },
  render: (args) => (
    <ConsoleLayout>
      <Products {...args} />
    </ConsoleLayout>
  ),
}
