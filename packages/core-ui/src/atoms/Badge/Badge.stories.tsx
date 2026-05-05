import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '.'
import { TypographyH1 } from '@/primitives/ui/typography'

const meta: Meta<typeof Badge> = {
  title: 'atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  render: () => <Badge>Add to Cart</Badge>,
}

export const AllVariants: Story = {
  render: () => (
    <div>
      <TypographyH1 className="mb-2">All Variants</TypographyH1>
      <div className="flex items-center gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="ghost">Ghost</Badge>
        <Badge variant="link">Link</Badge>
      </div>

      <TypographyH1 className="mt-10 mb-2">All Sizes</TypographyH1>
      <div className="flex items-center gap-2">
        <Badge size="sm">Small</Badge>
        <Badge size="default">Default</Badge>
        <Badge size="lg">Large</Badge>
      </div>
    </div>
  ),
}
