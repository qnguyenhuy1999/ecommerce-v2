import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Finance } from './Finance'
import { financeDefaultProps } from './Finance.fixtures'

const meta = {
  title: 'Pages/Finance',
  component: Finance,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Finance>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...financeDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <Finance {...args} />
    </ConsoleLayout>
  ),
}
