import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Promotions } from './Promotions'
import { promotionsDefaultProps } from './Promotions.fixtures'

const meta = {
  title: 'Pages/Promotions',
  component: Promotions,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Promotions>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...promotionsDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <Promotions {...args} />
    </ConsoleLayout>
  ),
}
