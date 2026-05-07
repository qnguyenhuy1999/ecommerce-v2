import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '.'
import { Input } from '../../atoms/Input'

const meta: Meta<typeof Field> = {
  title: 'molecules/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Field>

export const Default: Story = {
  render: () => (
    <Field>
      <FieldLabel>Email</FieldLabel>
      <FieldContent>
        <Input placeholder="you@example.com" />
      </FieldContent>
      <FieldDescription>We’ll never share your email.</FieldDescription>
      <FieldError />
    </Field>
  ),
}
