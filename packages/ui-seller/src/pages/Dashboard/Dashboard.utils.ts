import { ArrowRight, CircleAlert, MessageSquareText, PackageCheck, RotateCcw } from 'lucide-react'

export const dashboardTodoStyles = {
  default: {
    badgeClassName: 'bg-muted text-foreground',
    iconClassName: 'bg-muted text-foreground',
    icon: RotateCcw,
  },
  warning: {
    badgeClassName: 'bg-warning/10 text-warning',
    iconClassName: 'bg-warning/10 text-warning',
    icon: PackageCheck,
  },
  destructive: {
    badgeClassName: 'bg-destructive/10 text-destructive',
    iconClassName: 'bg-destructive/10 text-destructive',
    icon: CircleAlert,
  },
  info: {
    badgeClassName: 'bg-info/10 text-info',
    iconClassName: 'bg-info/10 text-info',
    icon: MessageSquareText,
  },
} as const

export const dashboardChevronIcon = ArrowRight

export function formatDashboardNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}
