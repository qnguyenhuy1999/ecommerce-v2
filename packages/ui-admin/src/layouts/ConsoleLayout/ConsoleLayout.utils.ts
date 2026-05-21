import type {
  ConsoleLayoutAccount,
  ConsoleLayoutSwitcher,
  ConsoleLayoutUserMenu,
} from '@ecom/core-ui'
import { sidebarGroups as defaultSidebarGroups } from './ConsoleLayout.fixtures'

export { defaultSidebarGroups }

export const defaultSidebarAccount: ConsoleLayoutAccount = {
  name: 'Halo Admin',
  subtitle: 'Platform console',
  avatarFallback: 'HA',
}

export const defaultWorkspaceSwitcher: ConsoleLayoutSwitcher = {
  label: 'Admin Console',
  items: ['Admin Console', 'Support Queue'],
}

export const defaultUserMenu: ConsoleLayoutUserMenu = {
  name: 'Ops Admin',
  email: 'ops.admin@halo.market',
  avatarFallback: 'OA',
}
