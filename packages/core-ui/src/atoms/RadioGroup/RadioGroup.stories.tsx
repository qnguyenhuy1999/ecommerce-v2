import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroup, RadioGroupItem } from '.'
import { Label } from '../Label'

const meta: Meta<typeof RadioGroup> = {
  title: 'atoms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="card">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="card" id="r1" />
        <Label htmlFor="r1">Card</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="paypal" id="r2" />
        <Label htmlFor="r2">PayPal</Label>
      </div>
    </RadioGroup>
  ),
}
