import type { Meta, StoryObj } from '@storybook/react-vite'
import { SellerOnboarding } from './SellerOnboarding'

const meta: Meta<typeof SellerOnboarding> = {
  title: 'pages/SellerOnboarding',
  component: SellerOnboarding,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof SellerOnboarding>

export const Default: Story = {}
