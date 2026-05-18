import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionCard } from './SectionCard'

const meta: Meta = {
  title: 'atoms/SectionCard',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <SectionCard
      title="Revenue (30 days)"
      subtitle={<span className="text-success">+12.4% vs prev period</span>}
      action={<span className="text-muted-foreground tabular text-xs">$ thousands</span>}
      className="lg:col-span-2">
      <div className="bg-muted h-24 rounded-lg" />
    </SectionCard>
  ),
}
