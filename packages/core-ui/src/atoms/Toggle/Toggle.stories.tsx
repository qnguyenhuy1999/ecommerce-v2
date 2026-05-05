import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toggle } from '.'

const meta: Meta<typeof Toggle> = {
  title: 'atoms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  render: () => <Toggle aria-label="Toggle bold">B</Toggle>,
}

export const Outline: Story = {
  render: () => (
    <Toggle defaultChecked aria-label="Toggle bold" variant="outline">
      B
    </Toggle>
  ),
}
