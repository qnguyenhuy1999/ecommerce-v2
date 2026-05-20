import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { VoucherDetail } from './VoucherDetail'
import { voucherDetailDefaultProps } from './VoucherDetail.fixtures'

const meta = {
  title: 'Pages/VoucherDetail',
  component: VoucherDetail,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof VoucherDetail>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...voucherDetailDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <VoucherDetail {...args} />
    </ConsoleLayout>
  ),
}
