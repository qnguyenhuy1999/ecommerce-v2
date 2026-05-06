import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stepper } from '.'

const meta: Meta<typeof Stepper> = {
  title: 'molecules/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Stepper>

const steps = [
  { label: 'Type' },
  { label: 'Setup' },
  { label: 'Scope' },
  { label: 'Schedule' },
  { label: 'Review' },
]

export const Step1: Story = {
  render: () => <Stepper steps={steps} current={1} />,
}

export const Step3: Story = {
  render: () => <Stepper steps={steps} current={3} />,
}

export const Step5: Story = {
  render: () => <Stepper steps={steps} current={5} />,
}

export const AllCompleted: Story = {
  render: () => <Stepper steps={steps} current={6} />,
}
