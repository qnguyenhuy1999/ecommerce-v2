import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Dashboard } from './Dashboard'

const meta: Meta<typeof Dashboard> = {
  title: 'pages/Dashboard',
  component: Dashboard,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof Dashboard>

export const Default: Story = {
  render: (args) => (
    <ConsoleLayout>
      <Dashboard {...args} />
    </ConsoleLayout>
  ),
}
