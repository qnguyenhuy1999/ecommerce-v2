import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from './ConsoleLayout'

const meta: Meta = {
  title: 'layouts/ConsoleLayout',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

export const Primary: Story = {
  render: () => <ConsoleLayout>abc</ConsoleLayout>,
}
