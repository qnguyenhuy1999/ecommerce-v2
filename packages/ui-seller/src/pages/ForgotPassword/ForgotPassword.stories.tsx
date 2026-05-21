import type { Meta, StoryObj } from '@storybook/react-vite'
import { ForgotPassword } from './ForgotPassword'
import { forgotPasswordDefaultProps } from './ForgotPassword.fixtures'

const meta = {
  title: 'Pages/ForgotPassword',
  component: ForgotPassword,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ForgotPassword>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...forgotPasswordDefaultProps,
  },
}
