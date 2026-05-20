import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Analytics } from './Analytics'

const meta: Meta<typeof Analytics> = {
  title: 'pages/Analytics',
  component: Analytics,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof Analytics>

export const Default: Story = {
  render: (args) => (
    <ConsoleLayout>
      <Analytics {...args} />
    </ConsoleLayout>
  ),
}
