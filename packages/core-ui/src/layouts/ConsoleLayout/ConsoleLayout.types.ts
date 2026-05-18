import type { SidebarGroup } from '../../organisms/Sidebar'

export interface ConsoleLayoutAccount {
  name: string
  subtitle?: string
  avatarUrl?: string
  avatarAlt?: string
  avatarFallback?: string
}

export interface ConsoleLayoutSwitcher {
  label: string
  items: string[]
}

export interface ConsoleLayoutUserMenu {
  name: string
  email: string
  avatarUrl?: string
  avatarAlt?: string
  avatarFallback?: string
}

export interface ConsoleLayoutProps {
  children: React.ReactNode
  sidebarGroups?: SidebarGroup[]
  sidebarAccount?: ConsoleLayoutAccount
  workspaceSwitcher?: ConsoleLayoutSwitcher
  searchPlaceholder?: string
  balanceLabel?: string
  notificationCount?: number
  storefrontLabel?: string
  userMenu?: ConsoleLayoutUserMenu
}
