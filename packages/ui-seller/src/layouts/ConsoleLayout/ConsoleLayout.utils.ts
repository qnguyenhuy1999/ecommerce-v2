import type {
  ConsoleLayoutAccount,
  ConsoleLayoutSwitcher,
  ConsoleLayoutUserMenu,
} from '@ecom/core-ui'
import { sidebarGroups as defaultSidebarGroups } from './ConsoleLayout.fixtures'

export { defaultSidebarGroups }

export const defaultSidebarAccount: ConsoleLayoutAccount = {
  name: 'Halo Seller',
  subtitle: 'Lumen Audio Official',
  avatarUrl: 'https://github.com/evilrabbit.png',
  avatarAlt: 'Halo Seller',
  avatarFallback: 'HS',
}

export const defaultWorkspaceSwitcher: ConsoleLayoutSwitcher = {
  label: 'Seller Center',
  items: ['Seller Center', 'Buyer Account'],
}

export const defaultUserMenu: ConsoleLayoutUserMenu = {
  name: 'Evil Rabbit',
  email: 'evil.rabbit@example.com',
  avatarUrl: 'https://github.com/evilrabbit.png',
  avatarAlt: '@evilrabbit',
  avatarFallback: 'ER',
}
