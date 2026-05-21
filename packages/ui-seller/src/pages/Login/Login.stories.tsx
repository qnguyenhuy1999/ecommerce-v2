import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login } from './Login'
import { loginDefaultProps } from './Login.fixtures'

const meta = {
  title: 'Pages/Login',
  component: Login,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Login>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...loginDefaultProps,
  },
}
