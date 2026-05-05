import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from '.'

const meta: Meta<typeof Spinner> = {
  title: 'atoms/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {
  render: () => <Spinner />,
}
