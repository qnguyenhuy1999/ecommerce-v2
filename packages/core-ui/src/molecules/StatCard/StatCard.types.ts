import type { LucideIcon } from 'lucide-react'

export type Accent = 'primary' | 'success' | 'info' | 'warning' | 'destructive'

export interface StatCardProps {
  label?: string
  title?: string
  value: string | number
  icon?: LucideIcon
  trend?: number
  spark?: { x: number; y: number }[]
  accent?: Accent
  className?: string
  loading?: boolean
  description?: string
}

export type StatCardHeader = { label?: string; title?: string; icon?: LucideIcon }

export type StatChartProps = Pick<StatCardProps, 'value' | 'spark'>
