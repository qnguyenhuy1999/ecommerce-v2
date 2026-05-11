import type { Meta, StoryObj } from '@storybook/react-vite'
import { Activity, DollarSign, Users } from 'lucide-react'
import { StatCard } from '.'

const meta: Meta<typeof StatCard> = {
  title: 'Molecules/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  args: {
    label: 'Revenue',
    value: '$12,340',
    trend: 12.5,
    accent: 'primary',
  },
}

export default meta

type Story = StoryObj<typeof StatCard>

// mock spark data
const spark = [
  { x: 1, y: 10 },
  { x: 2, y: 20 },
  { x: 3, y: 15 },
  { x: 4, y: 30 },
  { x: 5, y: 25 },
  { x: 6, y: 40 },
]

export const Default: Story = {
  args: {
    label: 'Revenue',
    value: '$12,340',
    trend: 12.5,
    spark,
    icon: DollarSign,
  },
}

export const NegativeTrend: Story = {
  args: {
    label: 'Churn',
    value: '3.2%',
    trend: -4.3,
    spark,
    icon: Activity,
    accent: 'destructive',
  },
}

export const NoTrend: Story = {
  args: {
    label: 'Users',
    value: '8,421',
    spark,
    icon: Users,
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
    <StatCard.Root accent="primary" className="w-55">
      <StatCard.Header label="Revenue" icon={DollarSign} />
      <StatCard.Chart value="$12,340" spark={spark} />
      <StatCard.Trend trend={12.5} />
    </StatCard.Root>
  ),
}

export const Grid: Story = {
  render: () => (
    <div className="w-175 grid grid-cols-3 gap-4">
      <StatCard label="Revenue" value="$12,340" trend={12.5} spark={spark} icon={DollarSign} />
      <StatCard label="Users" value="8,421" trend={4.2} spark={spark} icon={Users} accent="info" />
      <StatCard label="Churn" value="3.2%" trend={-2.1} spark={spark} icon={Activity} accent="destructive" />
    </div>
  ),
}
