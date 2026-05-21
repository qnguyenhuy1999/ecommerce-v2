import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResetPassword } from './ResetPassword'
import { resetPasswordDefaultProps } from './ResetPassword.fixtures'

const meta = {
  title: 'Pages/ResetPassword',
  component: ResetPassword,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ResetPassword>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...resetPasswordDefaultProps,
    token: 'sample-reset-token',
  },
}
