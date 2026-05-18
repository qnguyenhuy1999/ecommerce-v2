import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Products } from './Products'

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
