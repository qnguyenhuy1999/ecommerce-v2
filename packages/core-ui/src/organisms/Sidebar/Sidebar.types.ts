import type { LucideIcon } from 'lucide-react'

export type SidebarMenuItem = {
  id: string
  label: string
  icon?: LucideIcon
  href?: string
  badge?: string | number
  isActive?: boolean
  children?: SidebarMenuItem[]
  disabled?: boolean
}

export type SidebarGroup = {
  id: string
  label?: string
  items: SidebarMenuItem[]
}
