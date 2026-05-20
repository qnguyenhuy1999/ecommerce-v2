import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { messagesDefaultProps } from './Messages.fixtures'
import { Messages } from './Messages'

const meta = {
  title: 'Pages/Messages',
  component: Messages,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Messages>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...messagesDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <Messages {...args} />
    </ConsoleLayout>
  ),
}
