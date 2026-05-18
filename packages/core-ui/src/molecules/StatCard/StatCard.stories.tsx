import type { Meta, StoryObj } from '@storybook/react-vite'
import { Activity, ShoppingCart, Users } from 'lucide-react'
import { StatCard } from '.'

const meta: Meta<typeof StatCard> = {
  title: 'Molecules/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  args: {
    label: 'Orders (7D)',
    value: '412',
    trend: 8.1,
    accent: 'success',
  },
}

export default meta

type Story = StoryObj<typeof StatCard>

// mock spark data
const spark = [
  { x: 1, y: 12 },
  { x: 2, y: 22 },
  { x: 3, y: 21 },
  { x: 4, y: 11 },
  { x: 5, y: 14 },
  { x: 6, y: 20 },
]

export const Default: Story = {
  args: {
    label: 'Orders (7D)',
    value: '412',
    trend: 8.1,
    spark,
    description: 'vs prev',
    accent: 'success',
  },
}

export const NegativeTrend: Story = {
  args: {
    label: 'Conversion',
    value: '3.8%',
    trend: -0.4,
    spark: [
      { x: 1, y: 10 },
      { x: 2, y: 24 },
      { x: 3, y: 24 },
      { x: 4, y: 10 },
      { x: 5, y: 10 },
      { x: 6, y: 10 },
    ],
    description: 'vs prev',
    accent: 'destructive',
  },
}

export const NoTrend: Story = {
  args: {
    label: 'Users',
    value: '8,421',
    spark,
    icon: Users,
    description: 'Active this week',
  },
}

export const NoSpark: Story = {
  args: {
    label: 'Sessions',
    value: '21,903',
    trend: 5.1,
    icon: Activity,
  },
}

export const Compound: Story = {
  render: () => (
    <StatCard.Root accent="success" className="w-92">
      <StatCard.Header label="Orders (7D)" icon={ShoppingCart} />
      <StatCard.Chart value="412" spark={spark} />
      <StatCard.Trend trend={8.1} description="vs prev" />
    </StatCard.Root>
  ),
}

export const Grid: Story = {
  render: () => (
    <div className="grid w-[46rem] grid-cols-2 gap-4">
      <StatCard label="Orders (7D)" value="412" trend={8.1} spark={spark} accent="success" />
      <StatCard
        label="Conversion"
        value="3.8%"
        trend={-0.4}
        spark={[
          { x: 1, y: 10 },
          { x: 2, y: 24 },
          { x: 3, y: 24 },
          { x: 4, y: 10 },
          { x: 5, y: 10 },
          { x: 6, y: 10 },
        ]}
        accent="destructive"
      />
    </div>
  ),
}
