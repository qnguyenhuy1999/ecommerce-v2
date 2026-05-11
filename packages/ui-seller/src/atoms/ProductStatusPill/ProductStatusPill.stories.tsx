import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProductStatusPill } from './ProductStatusPill'
import type { ProductStatusPillVariantProps } from './ProductStatusPill.fixtures'

const meta: Meta = {
  title: 'atoms/ProductStatusPill',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <ProductStatusPill variant="active" />,
}

export const FullVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {['pending', 'packing', 'shipping', 'delivered', 'cancelled', 'refund', 'active', 'draft', 'out', 'review'].map(
        (variant) => (
          <ProductStatusPill key={variant} variant={variant as ProductStatusPillVariantProps['variant']} size="sm" />
        ),
      )}
    </div>
  ),
}
