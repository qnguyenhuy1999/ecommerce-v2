import { LucideIcon } from 'lucide-react'

export type Accent = 'primary' | 'success' | 'info' | 'warning' | 'destructive'

export interface StatCardProps {
  label: string
  value: string
  icon?: LucideIcon
  trend?: number
  spark?: { x: number; y: number }[]
  accent?: Accent
  className?: string
}

export type StatCardHeader = Pick<StatCardProps, 'label' | 'icon'>

export type StatChartProps = Pick<StatCardProps, 'value' | 'spark'>
