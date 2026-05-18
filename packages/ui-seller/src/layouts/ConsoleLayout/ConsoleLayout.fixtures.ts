import {
  BarChart2,
  DollarSign,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Package,
  RefreshCcw,
  Settings,
  ShoppingCart,
  Store,
  Tag,
  Ticket,
  Warehouse,
} from 'lucide-react'

import { type SidebarGroup } from '@ecom/core-ui'

export const sidebarGroups: SidebarGroup[] = [
  {
    id: 'main',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' }],
  },
  {
    id: 'manage',
    label: 'Manage',
    items: [
      { id: 'products', label: 'Products', icon: Package, href: '/products', isActive: true },
      { id: 'inventory', label: 'Inventory', icon: Warehouse, href: '/inventory' },
      { id: 'orders', label: 'Orders', icon: ShoppingCart, href: '/orders' },
      { id: 'returns', label: 'Returns', icon: RefreshCcw, href: '/returns' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    items: [
      { id: 'promotions', label: 'Promotions', icon: Megaphone, href: '/promotions' },
      { id: 'vouchers', label: 'Vouchers', icon: Ticket, href: '/vouchers' },
      { id: 'storefront', label: 'Storefront', icon: Store, href: '/storefront' },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart2, href: '/analytics' },
      { id: 'finance', label: 'Finance', icon: DollarSign, href: '/finance' },
    ],
  },
  {
    id: 'engage',
    label: 'Engage',
    items: [{ id: 'messages', label: 'Messages', icon: MessageSquare, href: '/messages' }],
  },
  {
    id: 'system',
    items: [
      { id: 'shop-profile', label: 'Shop profile', icon: Tag, href: '/shop-profile' },
      { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
    ],
  },
]
