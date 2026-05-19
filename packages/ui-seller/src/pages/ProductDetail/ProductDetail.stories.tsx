import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { ProductDetail } from './ProductDetail'
import { productDetailDefaultProps } from './ProductDetail.fixtures'

const meta: Meta<typeof ProductDetail> = {
  title: 'pages/ProductDetail',
  component: ProductDetail,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof ProductDetail>

export const Default: Story = {
  render: (args) => (
    <ConsoleLayout>
      <ProductDetail {...args} />
    </ConsoleLayout>
  ),
}

export const EmptyDraft: Story = {
  args: {
    ...productDetailDefaultProps,
    initialData: {
      ...productDetailDefaultProps.initialData,
      name: '',
      shortDescription: '',
      fullDescription: '',
      media: [],
      optionGroups: [{ id: 'color', name: 'Color', values: [] }],
      variantSeeds: [],
      metaTitle: '',
      metaDescription: '',
    },
  },
  render: (args) => (
    <ConsoleLayout>
      <ProductDetail {...args} />
    </ConsoleLayout>
  ),
}
