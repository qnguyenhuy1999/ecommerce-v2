import type { Meta, StoryObj } from '@storybook/react-vite'
import { TypographyH2, TypographyP } from '.'

const meta: Meta<typeof TypographyH2> = {
  title: 'atoms/Typography',
  component: TypographyH2,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof TypographyH2>

export const Default: Story = {
  render: () => (
    <div className="max-w-xl">
      <TypographyH2>Typography</TypographyH2>
      <TypographyP>Clean, readable text styles aligned with the design system.</TypographyP>
    </div>
  ),
}
