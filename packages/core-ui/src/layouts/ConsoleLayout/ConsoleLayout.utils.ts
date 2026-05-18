import type {
  ConsoleLayoutAccount,
  ConsoleLayoutSwitcher,
  ConsoleLayoutUserMenu,
} from './ConsoleLayout.types'

export const defaultSidebarAccount: ConsoleLayoutAccount = {
  name: 'Console',
  subtitle: 'Workspace',
  avatarFallback: 'CO',
}

export const defaultWorkspaceSwitcher: ConsoleLayoutSwitcher = {
  label: 'Workspace',
  items: ['Workspace'],
}

export const defaultUserMenu: ConsoleLayoutUserMenu = {
  name: 'Console User',
  email: 'console@example.com',
  avatarFallback: 'CU',
}

export const getInitials = (value: string): string =>
  value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
