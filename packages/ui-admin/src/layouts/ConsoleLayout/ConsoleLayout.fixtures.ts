import {
  BadgeDollarSign,
  BarChart3,
  BellRing,
  Boxes,
  ChartNoAxesColumn,
  FolderKanban,
  LayoutDashboard,
  Megaphone,
  Package,
  Scale,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { SidebarGroup } from '@ecom/core-ui'

type SidebarFixtureItem = {
  id: string
  label: string
  href: string
  icon: LucideIcon
  badge?: string | number
  isActive?: boolean
}

function createItem({ id, label, href, icon, badge, isActive = false }: SidebarFixtureItem) {
  return {
    id,
    label,
    href,
    icon,
    ...(badge !== undefined ? { badge } : {}),
    ...(isActive ? { isActive } : {}),
  }
}

export const sidebarGroups: SidebarGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      createItem({
        id: 'dashboard',
        label: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
        isActive: true,
      }),
    ],
  },
  {
    id: 'commerce',
    label: 'Commerce',
    items: [
      createItem({ id: 'orders', label: 'Orders', href: '/orders', icon: ShoppingBag }),
      createItem({
        id: 'products',
        label: 'Products',
        href: '/products',
        icon: Package,
        badge: 6,
      }),
      createItem({
        id: 'categories',
        label: 'Categories',
        href: '/categories',
        icon: FolderKanban,
      }),
      createItem({ id: 'disputes', label: 'Disputes', href: '/disputes', icon: Scale, badge: 4 }),
    ],
  },
  {
    id: 'accounts',
    label: 'Accounts',
    items: [
      createItem({ id: 'users', label: 'Users', href: '/users', icon: Users }),
      createItem({
        id: 'sellers',
        label: 'Sellers & KYC',
        href: '/sellers',
        icon: ShieldCheck,
        badge: 2,
      }),
      createItem({ id: 'roles', label: 'Roles', href: '/roles', icon: Boxes }),
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    items: [
      createItem({ id: 'campaigns', label: 'Campaigns', href: '/campaigns', icon: Megaphone }),
      createItem({
        id: 'commission',
        label: 'Commission',
        href: '/commission',
        icon: BadgeDollarSign,
      }),
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      createItem({ id: 'support', label: 'Support', href: '/support', icon: BellRing, badge: 3 }),
      createItem({ id: 'audit-log', label: 'Audit log', href: '/audit-log', icon: BarChart3 }),
      createItem({
        id: 'analytics',
        label: 'Analytics',
        href: '/analytics',
        icon: ChartNoAxesColumn,
      }),
      createItem({ id: 'settings', label: 'Settings', href: '/settings', icon: Settings }),
    ],
  },
]
