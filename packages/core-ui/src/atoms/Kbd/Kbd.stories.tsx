import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kbd, KbdGroup } from '.'

const meta: Meta<typeof Kbd> = {
  title: 'atoms/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Kbd>

export const Default: Story = {
  render: () => <Kbd>⌘K</Kbd>,
}

export const Group: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <span>+</span>
      <Kbd>B</Kbd>
    </KbdGroup>
  ),
}
