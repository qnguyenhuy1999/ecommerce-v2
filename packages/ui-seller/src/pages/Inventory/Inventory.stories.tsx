import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Inventory } from './Inventory'
import { inventoryDefaultProps } from './Inventory.fixtures'

const meta = {
  title: 'Pages/Inventory',
  component: Inventory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Inventory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...inventoryDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <Inventory {...args} />
    </ConsoleLayout>
  ),
}

export const Empty: Story = {
  args: {
    ...inventoryDefaultProps,
    inventory: [],
  },
  render: (args) => (
    <ConsoleLayout>
      <Inventory {...args} />
    </ConsoleLayout>
  ),
}
