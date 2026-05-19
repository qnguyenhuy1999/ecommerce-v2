import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { ReturnsRefunds } from './ReturnsRefunds'

const meta: Meta<typeof ReturnsRefunds> = {
  title: 'pages/ReturnsRefunds',
  component: ReturnsRefunds,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof ReturnsRefunds>

export const Default: Story = {
  render: (args) => (
    <ConsoleLayout>
      <ReturnsRefunds {...args} />
    </ConsoleLayout>
  ),
}
